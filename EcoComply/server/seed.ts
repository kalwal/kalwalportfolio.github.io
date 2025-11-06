import { db } from "./db";
import { users, complaints, industries, complianceReports } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create users with different roles
  const dummyUsers = [
    {
      id: "citizen1",
      email: "citizen1@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "citizen" as const,
    },
    {
      id: "citizen2",
      email: "citizen2@example.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "citizen" as const,
    },
    {
      id: "citizen3",
      email: "citizen3@example.com",
      firstName: "Bob",
      lastName: "Johnson",
      role: "citizen" as const,
    },
    {
      id: "admin1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const,
    },
    {
      id: "admin2",
      email: "inspector@example.com",
      firstName: "Inspector",
      lastName: "Garcia",
      role: "admin" as const,
    },
    {
      id: "industry1",
      email: "industry1@example.com",
      firstName: "Corporate",
      lastName: "Owner",
      role: "industry" as const,
    },
    {
      id: "industry2",
      email: "industry2@example.com",
      firstName: "Factory",
      lastName: "Manager",
      role: "industry" as const,
    },
  ];

  for (const user of dummyUsers) {
    await db.insert(users).values(user).onConflictDoNothing();
  }
  console.log("✓ Created users");

  // Create industries
  const dummyIndustries = [
    {
      ownerId: "industry1",
      name: "GreenTech Manufacturing",
      location: "123 Industrial Park, San Francisco, CA",
      sector: "Manufacturing",
      complianceScore: 85,
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      ownerId: "industry1",
      name: "EcoPlastics Inc",
      location: "456 Factory Rd, Los Angeles, CA",
      sector: "Plastics",
      complianceScore: 92,
      latitude: 34.0522,
      longitude: -118.2437,
    },
    {
      ownerId: "industry2",
      name: "ChemicalCorp",
      location: "789 Chemical Ave, Houston, TX",
      sector: "Chemical Processing",
      complianceScore: 78,
      latitude: 29.7604,
      longitude: -95.3698,
    },
    {
      ownerId: "industry2",
      name: "PowerPlant Solutions",
      location: "321 Energy Blvd, Phoenix, AZ",
      sector: "Energy",
      complianceScore: 88,
      latitude: 33.4484,
      longitude: -112.074,
    },
    {
      ownerId: "industry1",
      name: "WasteWater Systems",
      location: "654 Treatment St, Seattle, WA",
      sector: "Water Treatment",
      complianceScore: 95,
      latitude: 47.6062,
      longitude: -122.3321,
    },
  ];

  const createdIndustries = [];
  for (const industry of dummyIndustries) {
    const [created] = await db.insert(industries).values(industry).returning().onConflictDoNothing();
    if (created) createdIndustries.push(created);
  }
  console.log("✓ Created industries");

  // Create complaints
  const categories = ["air", "water", "waste", "noise", "industrial", "other"] as const;
  const statuses = ["submitted", "under_review", "resolved", "rejected"] as const;
  
  const dummyComplaints = [
    {
      userId: "citizen1",
      category: "air" as const,
      description: "Heavy smoke and fumes coming from factory chimney causing air pollution in residential area. Strong chemical smell.",
      latitude: 37.7849,
      longitude: -122.4094,
      status: "submitted" as const,
    },
    {
      userId: "citizen2",
      category: "water" as const,
      description: "Industrial waste being discharged into the river. Water has turned brownish and smells terrible.",
      latitude: 34.0622,
      longitude: -118.2337,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen3",
      category: "noise" as const,
      description: "Excessive noise from construction site operating beyond permitted hours, disturbing sleep.",
      latitude: 29.7704,
      longitude: -95.3598,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Construction company warned and agreed to limit hours to 7am-7pm",
    },
    {
      userId: "citizen1",
      category: "waste" as const,
      description: "Illegal dumping of industrial waste in public area. Hazardous materials visible.",
      latitude: 33.4584,
      longitude: -112.064,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen2",
      category: "industrial" as const,
      description: "Factory emitting toxic gases without proper filtration system. Residents experiencing respiratory issues.",
      latitude: 47.6162,
      longitude: -122.3221,
      status: "submitted" as const,
    },
    {
      userId: "citizen3",
      category: "air" as const,
      description: "Coal plant releasing excessive particulate matter, visible black soot on buildings.",
      latitude: 37.7649,
      longitude: -122.4294,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Plant installed new filtration systems and passed inspection",
    },
    {
      userId: "citizen1",
      category: "water" as const,
      description: "Oil spill in local lake from nearby factory. Dead fish observed.",
      latitude: 34.0422,
      longitude: -118.2537,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen2",
      category: "waste" as const,
      description: "Chemical waste barrels improperly stored in open area, risk of contamination.",
      latitude: 29.7504,
      longitude: -95.3798,
      status: "submitted" as const,
    },
    {
      userId: "citizen3",
      category: "noise" as const,
      description: "Industrial facility running heavy machinery 24/7, exceeding noise limits.",
      latitude: 33.4384,
      longitude: -112.084,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Facility installed soundproofing and adjusted operating hours",
    },
    {
      userId: "citizen1",
      category: "air" as const,
      description: "Pesticide spraying near residential area causing strong odor and health concerns.",
      latitude: 47.6262,
      longitude: -122.3121,
      status: "submitted" as const,
    },
    {
      userId: "citizen2",
      category: "industrial" as const,
      description: "Factory releasing untreated wastewater directly into drainage system.",
      latitude: 37.7549,
      longitude: -122.4394,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen3",
      category: "other" as const,
      description: "Radiation levels near nuclear plant higher than normal, locals concerned.",
      latitude: 34.0522,
      longitude: -118.2237,
      status: "submitted" as const,
    },
    {
      userId: "citizen1",
      category: "water" as const,
      description: "Sewage overflow from treatment plant contaminating nearby water bodies.",
      latitude: 29.7804,
      longitude: -95.3498,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Treatment plant repaired overflow valves",
    },
    {
      userId: "citizen2",
      category: "waste" as const,
      description: "Medical waste found in regular garbage bins near hospital, biohazard risk.",
      latitude: 33.4684,
      longitude: -112.054,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen3",
      category: "air" as const,
      description: "Paint factory emitting strong VOC fumes, causing headaches and nausea.",
      latitude: 47.6362,
      longitude: -122.3021,
      status: "submitted" as const,
    },
    {
      userId: "citizen1",
      category: "noise" as const,
      description: "Airport noise pollution exceeding limits, affecting nearby schools.",
      latitude: 37.7449,
      longitude: -122.4494,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Airport adjusted flight paths to reduce noise impact",
    },
    {
      userId: "citizen2",
      category: "industrial" as const,
      description: "Mining operation causing dust storms and air quality degradation.",
      latitude: 34.0322,
      longitude: -118.2637,
      status: "submitted" as const,
    },
    {
      userId: "citizen3",
      category: "water" as const,
      description: "Agricultural runoff contaminating groundwater with pesticides.",
      latitude: 29.7904,
      longitude: -95.3398,
      status: "under_review" as const,
      assignedInspectorId: "admin1",
    },
    {
      userId: "citizen1",
      category: "waste" as const,
      description: "E-waste recycling facility illegally burning components, toxic smoke.",
      latitude: 33.4784,
      longitude: -112.044,
      status: "submitted" as const,
    },
    {
      userId: "citizen2",
      category: "other" as const,
      description: "Light pollution from industrial complex affecting wildlife habitat.",
      latitude: 47.6462,
      longitude: -122.2921,
      status: "resolved" as const,
      assignedInspectorId: "admin2",
      resolvedAt: new Date(),
      resolutionNotes: "Facility installed directional lighting and shields",
    },
  ];

  for (const complaint of dummyComplaints) {
    await db.insert(complaints).values(complaint).onConflictDoNothing();
  }
  console.log("✓ Created complaints");

  // Create compliance reports
  const dummyReports = [
    {
      industryId: createdIndustries[0]?.id || "",
      reportType: "EIA Report",
      status: "approved",
      notes: "Environmental Impact Assessment completed and approved",
    },
    {
      industryId: createdIndustries[1]?.id || "",
      reportType: "Emission Report",
      status: "pending",
      notes: "Quarterly emission levels submitted for review",
    },
    {
      industryId: createdIndustries[2]?.id || "",
      reportType: "Wastewater Report",
      status: "approved",
      notes: "Wastewater treatment compliance verified",
    },
    {
      industryId: createdIndustries[3]?.id || "",
      reportType: "Safety Audit",
      status: "under_review",
      notes: "Annual safety audit documentation under review",
    },
  ];

  for (const report of dummyReports) {
    if (report.industryId) {
      await db.insert(complianceReports).values(report).onConflictDoNothing();
    }
  }
  console.log("✓ Created compliance reports");

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
