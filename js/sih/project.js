// Express Routes for Project Management & Financial Audit Data
const express = require('express');
const router = express.Router();

let projectsData = [
  {
    id: "PRJ-2026-089",
    name: "Metropolitan Elevated Expressway Line 4",
    region: "Northern Transit Zone",
    sector: "Transport & Highways",
    contractor: "Vanguard Infra Consortium",
    contractorTaxId: "TX-9981-VNG",
    contractorRisk: "High Monopoly Risk (Shared address with 3 shell firms)",
    allocatedBudget: 450000000,
    disbursedBudget: 405000000,
    reportedProgress: 92,
    actualProgress: 38,
    discrepancyDelta: -54,
    riskScore: 96,
    riskLevel: "CRITICAL",
    status: "RED",
    workflowStatus: "FLAGGED",
    slaDeadlineHours: 36,
    assignedAuthority: "Central Vigilance Bureau - Zone 1",
    coordinates: [19.0760, 72.8777],
    locationName: "Bandra-Kurla Transit Corridor",
    anomalies: [
      { type: "Financial Discrepancy", code: "FIN_DISC_90", severity: "HIGH", description: "Disbursed budget (90% / $405M) drastically outpaces physical progress (38%). Unexplained $234M variance.", detectedDate: "2026-09-02" },
      { type: "Image / Progress Mismatch", code: "CNN_MISMATCH_54", severity: "CRITICAL", description: "CNN Satellite & Citizen photo analysis confirms 4 major piers missing rebar steel grid. Claimed 92% complete.", detectedDate: "2026-09-05" },
      { type: "Contract NLP Discrepancy", code: "NLP_CLAUSE_VIOLATION", severity: "HIGH", description: "Clause 14.2 requires Independent Quality Audit Signoff before Tranche #4 release. Tranche released without audit document ID.", detectedDate: "2026-09-08" }
    ],
    citizenPhotos: [
      {
        id: "RPT-881",
        submitter: "Anonymous Citizen #409",
        timestamp: "2026-09-10 14:22 UTC",
        lat: 19.0765,
        lng: 72.8782,
        imageUrl: "assets/site_foundation_incomplete_1789104285937.png",
        userNotes: "Piers 12 through 16 are completely abandoned. No workers on site for 3 months despite official claims of paving.",
        exifData: { camera: "iPhone 14 Pro", deviceHash: "SHA256:e3b0c442", accuracy: "±3.2 meters", ISO: 100, focalLength: "24mm" },
        cnnAnalysis: { detectedState: "Incomplete Foundation", estimatedCompletion: 35, confidenceScore: 98.4, detectedObjects: ["Exposed Rebar 12%", "Idle Excavator 1", "Unpoured Concrete 88%"] }
      }
    ]
  },
  {
    id: "PRJ-2026-042",
    name: "Suburban Multi-Specialty General Hospital Wing B",
    region: "Eastern District",
    sector: "Public Health",
    contractor: "Apex Healthcare BuildCorp",
    contractorTaxId: "TX-4412-APX",
    contractorRisk: "Moderate (Single previous tender overrun)",
    allocatedBudget: 180000000,
    disbursedBudget: 144000000,
    reportedProgress: 85,
    actualProgress: 42,
    discrepancyDelta: -43,
    riskScore: 88,
    riskLevel: "HIGH",
    status: "RED",
    workflowStatus: "UNDER_INVESTIGATION",
    slaDeadlineHours: 18,
    assignedAuthority: "Ministry of Public Works Audit Division",
    coordinates: [19.1197, 72.9050],
    locationName: "Powai Medical Complex",
    anomalies: [
      { type: "Image / Progress Mismatch", code: "CNN_MISMATCH_43", severity: "HIGH", description: "Official filings claim HVAC and ICU electrical grid complete. CNN photo analysis shows unroofed brick shell.", detectedDate: "2026-09-04" }
    ],
    citizenPhotos: []
  },
  {
    id: "PRJ-2026-115",
    name: "Godavari Basin Flood Defense Wall & River Dam",
    region: "Southern Watershed",
    sector: "Water & Disaster Prevention",
    contractor: "HydroShield Infrastructure",
    contractorTaxId: "TX-1092-HYD",
    contractorRisk: "Severe Structural Safety Breach",
    allocatedBudget: 320000000,
    disbursedBudget: 224000000,
    reportedProgress: 75,
    actualProgress: 48,
    discrepancyDelta: -27,
    riskScore: 91,
    riskLevel: "CRITICAL",
    status: "RED",
    workflowStatus: "ESCALATED",
    slaDeadlineHours: 0,
    assignedAuthority: "Central Anti-Corruption Vigilance Bureau",
    coordinates: [19.0176, 72.8561],
    locationName: "Basin Zone Pier 4",
    anomalies: [
      { type: "Quality / Safety Fraud", code: "QUAL_CRACK_SEV", severity: "CRITICAL", description: "Citizen photo EXIF analysis & ultrasonic testing confirmed micro-cracks in load-bearing spillway pier.", detectedDate: "2026-09-01" }
    ],
    citizenPhotos: []
  }
];

// GET All Projects
router.get('/', (req, res) => {
  res.json({ success: true, count: projectsData.length, data: projectsData });
});

// GET Single Project by ID
router.get('/:id', (req, res) => {
  const project = projectsData.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, data: project });
});

// POST Update Project Status / Workflow
router.put('/:id', (req, res) => {
  const index = projectsData.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Project not found' });

  projectsData[index] = { ...projectsData[index], ...req.body };
  res.json({ success: true, data: projectsData[index] });
});

module.exports = { router, projectsData };
