// Reference: javascript_database and javascript_log_in_with_replit blueprints
import {
  users,
  complaints,
  industries,
  complianceReports,
  inspections,
  type User,
  type UpsertUser,
  type Complaint,
  type InsertComplaint,
  type Industry,
  type InsertIndustry,
  type ComplianceReport,
  type InsertComplianceReport,
  type Inspection,
  type InsertInspection,
  type ComplaintWithUser,
  type IndustryWithOwner,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Complaint operations
  getComplaint(id: string): Promise<Complaint | undefined>;
  getComplaintWithUser(id: string): Promise<ComplaintWithUser | undefined>;
  getAllComplaints(): Promise<ComplaintWithUser[]>;
  getUserComplaints(userId: string): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint, userId: string): Promise<Complaint>;
  updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint>;
  deleteComplaint(id: string): Promise<void>;
  
  // Industry operations
  getIndustry(id: string): Promise<Industry | undefined>;
  getAllIndustries(): Promise<IndustryWithOwner[]>;
  getUserIndustries(userId: string): Promise<Industry[]>;
  createIndustry(industry: InsertIndustry): Promise<Industry>;
  updateIndustry(id: string, data: Partial<Industry>): Promise<Industry>;
  
  // Compliance Report operations
  getComplianceReports(industryId?: string): Promise<ComplianceReport[]>;
  createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport>;
  
  // Inspection operations
  createInspection(inspection: InsertInspection): Promise<Inspection>;
  getInspections(): Promise<Inspection[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Complaint operations
  async getComplaint(id: string): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async getComplaintWithUser(id: string): Promise<ComplaintWithUser | undefined> {
    const result = await db
      .select()
      .from(complaints)
      .leftJoin(users, eq(complaints.userId, users.id))
      .where(eq(complaints.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].complaints,
      user: result[0].users || undefined,
    };
  }

  async getAllComplaints(): Promise<ComplaintWithUser[]> {
    const result = await db
      .select()
      .from(complaints)
      .leftJoin(users, eq(complaints.userId, users.id))
      .orderBy(desc(complaints.createdAt));
    
    return result.map(row => ({
      ...row.complaints,
      user: row.users || undefined,
    }));
  }

  async getUserComplaints(userId: string): Promise<Complaint[]> {
    return await db
      .select()
      .from(complaints)
      .where(eq(complaints.userId, userId))
      .orderBy(desc(complaints.createdAt));
  }

  async createComplaint(complaintData: InsertComplaint, userId: string): Promise<Complaint> {
    const [complaint] = await db
      .insert(complaints)
      .values({ ...complaintData, userId })
      .returning();
    return complaint;
  }

  async updateComplaint(id: string, data: Partial<Complaint>): Promise<Complaint> {
    const [complaint] = await db
      .update(complaints)
      .set(data)
      .where(eq(complaints.id, id))
      .returning();
    return complaint;
  }

  async deleteComplaint(id: string): Promise<void> {
    await db.delete(complaints).where(eq(complaints.id, id));
  }

  // Industry operations
  async getIndustry(id: string): Promise<Industry | undefined> {
    const [industry] = await db.select().from(industries).where(eq(industries.id, id));
    return industry;
  }

  async getAllIndustries(): Promise<IndustryWithOwner[]> {
    const result = await db
      .select()
      .from(industries)
      .leftJoin(users, eq(industries.ownerId, users.id))
      .orderBy(desc(industries.createdAt));
    
    return result.map(row => ({
      ...row.industries,
      owner: row.users || undefined,
    }));
  }

  async getUserIndustries(userId: string): Promise<Industry[]> {
    return await db
      .select()
      .from(industries)
      .where(eq(industries.ownerId, userId))
      .orderBy(desc(industries.createdAt));
  }

  async createIndustry(industryData: InsertIndustry): Promise<Industry> {
    const [industry] = await db
      .insert(industries)
      .values(industryData)
      .returning();
    return industry;
  }

  async updateIndustry(id: string, data: Partial<Industry>): Promise<Industry> {
    const [industry] = await db
      .update(industries)
      .set(data)
      .where(eq(industries.id, id))
      .returning();
    return industry;
  }

  // Compliance Report operations
  async getComplianceReports(industryId?: string): Promise<ComplianceReport[]> {
    if (industryId) {
      return await db
        .select()
        .from(complianceReports)
        .where(eq(complianceReports.industryId, industryId))
        .orderBy(desc(complianceReports.submissionDate));
    }
    return await db
      .select()
      .from(complianceReports)
      .orderBy(desc(complianceReports.submissionDate));
  }

  async createComplianceReport(reportData: InsertComplianceReport): Promise<ComplianceReport> {
    const [report] = await db
      .insert(complianceReports)
      .values(reportData)
      .returning();
    return report;
  }

  // Inspection operations
  async createInspection(inspectionData: InsertInspection): Promise<Inspection> {
    const [inspection] = await db
      .insert(inspections)
      .values(inspectionData)
      .returning();
    return inspection;
  }

  async getInspections(): Promise<Inspection[]> {
    return await db
      .select()
      .from(inspections)
      .orderBy(desc(inspections.createdAt));
  }
}

export const storage = new DatabaseStorage();
