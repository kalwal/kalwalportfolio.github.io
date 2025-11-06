import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User role enum
export const userRoleEnum = pgEnum('user_role', ['citizen', 'industry', 'admin']);

// Complaint category enum
export const complaintCategoryEnum = pgEnum('complaint_category', [
  'air',
  'water',
  'waste',
  'noise',
  'industrial',
  'other'
]);

// Complaint status enum
export const complaintStatusEnum = pgEnum('complaint_status', [
  'submitted',
  'under_review',
  'resolved',
  'rejected'
]);

// User storage table - Required for Replit Auth with role extension
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('citizen'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaints table
export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: complaintCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  status: complaintStatusEnum("status").notNull().default('submitted'),
  assignedInspectorId: varchar("assigned_inspector_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
});

// Industries table
export const industries = pgTable("industries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 500 }).notNull(),
  sector: varchar("sector", { length: 100 }).notNull(),
  complianceScore: integer("compliance_score").default(100),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Compliance Reports table
export const complianceReports = pgTable("compliance_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  industryId: varchar("industry_id").notNull().references(() => industries.id, { onDelete: 'cascade' }),
  reportType: varchar("report_type", { length: 100 }).notNull(),
  fileUrl: varchar("file_url"),
  status: varchar("status", { length: 50 }).notNull().default('pending'),
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
});

// Inspections table
export const inspections = pgTable("inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").references(() => complaints.id, { onDelete: 'cascade' }),
  industryId: varchar("industry_id").references(() => industries.id, { onDelete: 'cascade' }),
  inspectorId: varchar("inspector_id").notNull().references(() => users.id),
  notes: text("notes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  complaints: many(complaints, { relationName: "userComplaints" }),
  assignedComplaints: many(complaints, { relationName: "inspectorComplaints" }),
  industries: many(industries),
  inspections: many(inspections),
}));

export const complaintsRelations = relations(complaints, ({ one }) => ({
  user: one(users, {
    fields: [complaints.userId],
    references: [users.id],
    relationName: "userComplaints",
  }),
  assignedInspector: one(users, {
    fields: [complaints.assignedInspectorId],
    references: [users.id],
    relationName: "inspectorComplaints",
  }),
}));

export const industriesRelations = relations(industries, ({ one, many }) => ({
  owner: one(users, {
    fields: [industries.ownerId],
    references: [users.id],
  }),
  complianceReports: many(complianceReports),
  inspections: many(inspections),
}));

export const complianceReportsRelations = relations(complianceReports, ({ one }) => ({
  industry: one(industries, {
    fields: [complianceReports.industryId],
    references: [industries.id],
  }),
}));

export const inspectionsRelations = relations(inspections, ({ one }) => ({
  complaint: one(complaints, {
    fields: [inspections.complaintId],
    references: [complaints.id],
  }),
  industry: one(industries, {
    fields: [inspections.industryId],
    references: [industries.id],
  }),
  inspector: one(users, {
    fields: [inspections.inspectorId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  userId: true,
  createdAt: true,
  resolvedAt: true,
  assignedInspectorId: true,
  resolutionNotes: true,
});

export const insertIndustrySchema = createInsertSchema(industries).omit({
  id: true,
  createdAt: true,
  complianceScore: true,
});

export const insertComplianceReportSchema = createInsertSchema(complianceReports).omit({
  id: true,
  submissionDate: true,
});

export const insertInspectionSchema = createInsertSchema(inspections).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;

export type InsertIndustry = z.infer<typeof insertIndustrySchema>;
export type Industry = typeof industries.$inferSelect;

export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;
export type ComplianceReport = typeof complianceReports.$inferSelect;

export type InsertInspection = z.infer<typeof insertInspectionSchema>;
export type Inspection = typeof inspections.$inferSelect;

// Extended types with relations
export type ComplaintWithUser = Complaint & { user?: User; assignedInspector?: User };
export type IndustryWithOwner = Industry & { owner?: User };
export type ComplianceReportWithIndustry = ComplianceReport & { industry?: Industry };
