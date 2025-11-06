// Reference: javascript_log_in_with_replit blueprint
import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertComplaintSchema, insertIndustrySchema, insertComplianceReportSchema, insertInspectionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and CSVs are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Stats endpoint
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let complaints;
      if (user?.role === 'citizen') {
        complaints = await storage.getUserComplaints(userId);
      } else {
        complaints = await storage.getAllComplaints();
      }

      const industries = user?.role === 'industry' 
        ? await storage.getUserIndustries(userId)
        : await storage.getAllIndustries();

      const stats = {
        totalComplaints: complaints.length,
        resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
        pendingComplaints: complaints.filter(c => c.status !== 'resolved').length,
        totalIndustries: industries.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Complaint routes
  app.get('/api/complaints', isAuthenticated, async (req: any, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.get('/api/complaints/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const complaints = await storage.getUserComplaints(userId);
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching user complaints:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.get('/api/complaints/:id', isAuthenticated, async (req: any, res) => {
    try {
      const complaint = await storage.getComplaintWithUser(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  app.post('/api/complaints', isAuthenticated, (req: any, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size exceeds 5MB limit' });
          }
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message || 'File upload failed' });
      }
      next();
    });
  }, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Parse form data
      const complaintData = {
        ...req.body,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };
      
      const result = insertComplaintSchema.safeParse(complaintData);
      
      if (!result.success) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const complaint = await storage.createComplaint(result.data, userId);
      res.status(201).json(complaint);
    } catch (error) {
      console.error("Error creating complaint:", error);
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  app.patch('/api/complaints/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only admin can update complaint status
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const complaint = await storage.updateComplaint(req.params.id, req.body);
      res.json(complaint);
    } catch (error) {
      console.error("Error updating complaint:", error);
      res.status(500).json({ message: "Failed to update complaint" });
    }
  });

  app.delete('/api/complaints/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const complaint = await storage.getComplaint(req.params.id);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      // Only the owner or admin can delete
      const user = await storage.getUser(userId);
      if (complaint.userId !== userId && user?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteComplaint(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting complaint:", error);
      res.status(500).json({ message: "Failed to delete complaint" });
    }
  });

  // Industry routes
  app.get('/api/industries', isAuthenticated, async (req: any, res) => {
    try {
      const industries = await storage.getAllIndustries();
      res.json(industries);
    } catch (error) {
      console.error("Error fetching industries:", error);
      res.status(500).json({ message: "Failed to fetch industries" });
    }
  });

  app.get('/api/industries/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const industries = await storage.getUserIndustries(userId);
      res.json(industries);
    } catch (error) {
      console.error("Error fetching user industries:", error);
      res.status(500).json({ message: "Failed to fetch industries" });
    }
  });

  app.post('/api/industries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = insertIndustrySchema.safeParse({ ...req.body, ownerId: userId });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const industry = await storage.createIndustry(result.data);
      res.status(201).json(industry);
    } catch (error) {
      console.error("Error creating industry:", error);
      res.status(500).json({ message: "Failed to create industry" });
    }
  });

  // Compliance Report routes
  app.get('/api/compliance-reports', isAuthenticated, async (req: any, res) => {
    try {
      const industryId = req.query.industryId as string | undefined;
      const reports = await storage.getComplianceReports(industryId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      res.status(500).json({ message: "Failed to fetch compliance reports" });
    }
  });

  app.post('/api/compliance-reports', isAuthenticated, (req: any, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size exceeds 5MB limit' });
          }
          return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: err.message || 'File upload failed' });
      }
      next();
    });
  }, async (req: any, res) => {
    try {
      const reportData = {
        ...req.body,
        fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      };
      
      const result = insertComplianceReportSchema.safeParse(reportData);
      
      if (!result.success) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const report = await storage.createComplianceReport(result.data);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating compliance report:", error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: "Failed to create compliance report" });
    }
  });

  // Inspection routes
  app.get('/api/inspections', isAuthenticated, async (req: any, res) => {
    try {
      const inspections = await storage.getInspections();
      res.json(inspections);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      res.status(500).json({ message: "Failed to fetch inspections" });
    }
  });

  app.post('/api/inspections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only admin can create inspections
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }

      const result = insertInspectionSchema.safeParse({ ...req.body, inspectorId: userId });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const inspection = await storage.createInspection(result.data);
      res.status(201).json(inspection);
    } catch (error) {
      console.error("Error creating inspection:", error);
      res.status(500).json({ message: "Failed to create inspection" });
    }
  });

  // User routes
  app.get('/api/users/inspectors', isAuthenticated, async (req: any, res) => {
    try {
      const inspectors = await storage.getUsersByRole('admin');
      res.json(inspectors);
    } catch (error) {
      console.error("Error fetching inspectors:", error);
      res.status(500).json({ message: "Failed to fetch inspectors" });
    }
  });

  // Analytics endpoint
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      
      // Category stats
      const categoryStats = complaints.reduce((acc, c) => {
        const existing = acc.find(item => item.name === c.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: c.category, count: 1 });
        }
        return acc;
      }, [] as { name: string; count: number }[]);

      // Status stats
      const statusStats = complaints.reduce((acc, c) => {
        const existing = acc.find(item => item.name === c.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: c.status.replace('_', ' '), count: 1 });
        }
        return acc;
      }, [] as { name: string; count: number }[]);

      // Resolution rate
      const resolutionRate = complaints.length > 0
        ? (complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100
        : 0;

      res.json({
        categoryStats,
        statusStats,
        resolutionRate,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
