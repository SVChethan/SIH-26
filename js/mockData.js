// Mock Data for CIVIC-EYE AI Corruption Detection Platform

window.INITIAL_PROJECTS = [
  {
    id: "PRJ-2026-089",
    name: "Metropolitan Elevated Expressway Line 4",
    region: "Northern Transit Zone",
    sector: "Transport & Highways",
    contractor: "Vanguard Infra Consortium",
    contractorTaxId: "TX-9981-VNG",
    contractorRisk: "High Monopoly Risk (Shared address with 3 shell firms)",
    allocatedBudget: 450000000,
    disbursedBudget: 405000000, // 90%
    reportedProgress: 92,
    actualProgress: 38, // CNN estimated
    discrepancyDelta: -54,
    riskScore: 96,
    riskLevel: "CRITICAL",
    status: "RED", // Corruption Risk
    workflowStatus: "FLAGGED", // FLAGGED, UNDER_INVESTIGATION, ESCALATED, RESOLVED
    slaDeadlineHours: 36,
    assignedAuthority: "Central Vigilance Bureau - Zone 1",
    coordinates: [19.0760, 72.8777], // Mumbai area
    locationName: "Bandra-Kurla Transit Corridor",
    anomalies: [
      {
        type: "Financial Discrepancy",
        code: "FIN_DISC_90",
        severity: "HIGH",
        description: "Disbursed budget (90% / $405M) drastically outpaces physical progress (38%). Unexplained $234M variance.",
        detectedDate: "2026-09-02"
      },
      {
        type: "Image / Progress Mismatch",
        code: "CNN_MISMATCH_54",
        severity: "CRITICAL",
        description: "CNN Satellite & Citizen photo analysis confirms 4 major piers missing rebar steel grid. Claimed 92% complete.",
        detectedDate: "2026-09-05"
      },
      {
        type: "Contract NLP Discrepancy",
        code: "NLP_CLAUSE_VIOLATION",
        severity: "HIGH",
        description: "Clause 14.2 requires Independent Quality Audit Signoff before Tranche #4 release. Tranche released without audit document ID.",
        detectedDate: "2026-09-08"
      },
      {
        type: "Contractor Monopoly Fraud",
        code: "MONOPOLY_BID_RICO",
        severity: "MEDIUM",
        description: "Consortium shares registered tax address (Suite 402, Trade Tower) with 2 competing losing bidders.",
        detectedDate: "2026-09-10"
      }
    ],
    contractClauses: [
      { clause: "Sec 4.2 (Payment Release)", text: "Tranche payments contingent on 3rd-party engineering verification.", verified: false, breach: "Disbursed without verification record." },
      { clause: "Sec 8.1 (Subcontracting)", text: "Subcontracting exceeding 15% of total tender value strictly prohibited.", verified: false, breach: "84% subcontracted to unregistered offshore entity." }
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
    disbursedBudget: 144000000, // 80%
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
      {
        type: "Image / Progress Mismatch",
        code: "CNN_MISMATCH_43",
        severity: "HIGH",
        description: "Official filings claim HVAC and ICU electrical grid complete. CNN photo analysis shows unroofed brick shell.",
        detectedDate: "2026-09-04"
      },
      {
        type: "Financial Discrepancy",
        code: "FIN_DISC_80",
        severity: "MEDIUM",
        description: "Disbursement reaches 80% with only structural concrete phase partially finished.",
        detectedDate: "2026-09-07"
      }
    ],
    contractClauses: [
      { clause: "Sec 12.3 (Medical Gas Piping)", text: "Must use certified ISO-9001 medical copper.", verified: false, breach: "Substandard grade copper batch detected in customs audit." }
    ],
    citizenPhotos: [
      {
        id: "RPT-904",
        submitter: "Dr. A. Verma (Resident)",
        timestamp: "2026-09-09 09:15 UTC",
        lat: 19.1200,
        lng: 72.9055,
        imageUrl: "assets/school_building_delayed_1789104312663.png",
        userNotes: "Wing B has no roof or window frames. Yet contractor billed $35M for interior air purification systems.",
        exifData: { camera: "Samsung Galaxy S23", deviceHash: "SHA256:7f83b165", accuracy: "±2.1 meters", ISO: 200, focalLength: "50mm" },
        cnnAnalysis: { detectedState: "Unroofed Shell", estimatedCompletion: 40, confidenceScore: 96.1, detectedObjects: ["Masonry Shell 40%", "No Roof Grid", "Zero HVAC Fittings"] }
      }
    ]
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
    disbursedBudget: 224000000, // 70%
    reportedProgress: 75,
    actualProgress: 48,
    discrepancyDelta: -27,
    riskScore: 91,
    riskLevel: "CRITICAL",
    status: "RED",
    workflowStatus: "ESCALATED",
    slaDeadlineHours: 0, // Breached / Escalated
    assignedAuthority: "Central Anti-Corruption Vigilance Bureau",
    coordinates: [19.0176, 72.8561],
    locationName: "Basin Zone Pier 4",
    anomalies: [
      {
        type: "Quality / Safety Fraud",
        code: "QUAL_CRACK_SEV",
        severity: "CRITICAL",
        description: "Citizen photo EXIF analysis & ultrasonic testing confirmed micro-cracks in load-bearing spillway pier.",
        detectedDate: "2026-09-01"
      },
      {
        type: "Contractor Monopoly Fraud",
        code: "BID_RIGGING_PATTERN",
        severity: "HIGH",
        description: "Bidding log shows 3 submitted tenders submitted within 14 seconds from identical IP address range 182.71.x.x.",
        detectedDate: "2026-09-03"
      }
    ],
    contractClauses: [
      { clause: "Sec 6.4 (Concrete Strength)", text: "Minimum 45 MPa compressive strength required for spillway retention.", verified: false, breach: "Core sample tests returned only 22 MPa." }
    ],
    citizenPhotos: [
      {
        id: "RPT-772",
        submitter: "Civil Eng. Oversight Volunteer",
        timestamp: "2026-09-08 11:40 UTC",
        lat: 19.0180,
        lng: 72.8565,
        imageUrl: "assets/bridge_pier_crack_1789104300196.png",
        userNotes: "Visible stress fractures running along Spillway Pillar #3. High risk of catastrophic failure during monsoon season.",
        exifData: { camera: "Pixel 7 Pro", deviceHash: "SHA256:a1b2c3d4", accuracy: "±1.8 meters", ISO: 50, focalLength: "35mm" },
        cnnAnalysis: { detectedState: "Structural Micro-Fissure", estimatedCompletion: 48, confidenceScore: 99.1, detectedObjects: ["Concrete Fissure Length 1.2m", "Unsealed Surface", "High Moisture Infiltration"] }
      }
    ]
  },
  {
    id: "PRJ-2026-204",
    name: "Model Smart High School & Digital Science Lab",
    region: "Central City Ward 7",
    sector: "Education Infrastructure",
    contractor: "BuildTech Urban Solutions",
    contractorTaxId: "TX-5510-BTU",
    contractorRisk: "Low Risk Profile",
    allocatedBudget: 42000000,
    disbursedBudget: 27300000, // 65%
    reportedProgress: 68,
    actualProgress: 56,
    discrepancyDelta: -12,
    riskScore: 45,
    riskLevel: "MEDIUM",
    status: "YELLOW", // Minor Discrepancy
    workflowStatus: "UNDER_INVESTIGATION",
    slaDeadlineHours: 64,
    assignedAuthority: "Municipal Education Board Audit Cell",
    coordinates: [19.2183, 72.9781],
    locationName: "Thane Sector 12",
    anomalies: [
      {
        type: "Financial Discrepancy",
        code: "MINOR_OVERRUN",
        severity: "LOW",
        description: "65% funds disbursed for 56% verified physical work. Minor supply chain delay reported.",
        detectedDate: "2026-09-09"
      }
    ],
    contractClauses: [
      { clause: "Sec 3.1 (Completion Timeline)", text: "Phase 2 delivery deadline set for Q3 2026.", verified: true, breach: "None" }
    ],
    citizenPhotos: []
  },
  {
    id: "PRJ-2026-310",
    name: "Solar Energy Grid & Rural Electrification Substation",
    region: "Western Agricultural Belt",
    sector: "Energy & Utilities",
    contractor: "SunGrid Power Systems",
    contractorTaxId: "TX-8831-SGP",
    contractorRisk: "Verified Compliant Contractor",
    allocatedBudget: 125000000,
    disbursedBudget: 100000000, // 80%
    reportedProgress: 82,
    actualProgress: 81,
    discrepancyDelta: -1,
    riskScore: 12,
    riskLevel: "LOW",
    status: "GREEN", // On Track
    workflowStatus: "RESOLVED",
    slaDeadlineHours: 120,
    assignedAuthority: "State Electricity Regulatory Commission",
    coordinates: [19.0330, 73.0297],
    locationName: "Navi Mumbai Green Tech Zone",
    anomalies: [],
    contractClauses: [],
    citizenPhotos: []
  },
  {
    id: "PRJ-2026-401",
    name: "District Automated Water Purification Plant",
    region: "Northern Industrial Ring",
    sector: "Water & Sanitation",
    contractor: "AquaPure Engineering",
    contractorTaxId: "TX-3311-AQP",
    contractorRisk: "Verified Compliant",
    allocatedBudget: 95000000,
    disbursedBudget: 66500000, // 70%
    reportedProgress: 72,
    actualProgress: 70,
    discrepancyDelta: -2,
    riskScore: 18,
    riskLevel: "LOW",
    status: "GREEN",
    workflowStatus: "RESOLVED",
    slaDeadlineHours: 96,
    assignedAuthority: "Water Quality Vigilance Dept",
    coordinates: [19.1663, 72.8526],
    locationName: "Goregaon Industrial Belt",
    anomalies: [],
    contractClauses: [],
    citizenPhotos: []
  }
];

window.INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-1009",
    timestamp: "2026-09-11 09:30:14 IST",
    projectId: "PRJ-2026-089",
    projectName: "Metropolitan Elevated Expressway Line 4",
    action: "AI Anomaly Triggered",
    details: "CNN Satellite feed & Treasury disbursement parser detected 54% completion discrepancy. Automated alert dispatched.",
    actor: "CIVIC-EYE AI Engine",
    type: "CRITICAL"
  },
  {
    id: "LOG-1008",
    timestamp: "2026-09-10 14:22:00 IST",
    projectId: "PRJ-2026-089",
    projectName: "Metropolitan Elevated Expressway Line 4",
    action: "Citizen Evidence Uploaded",
    details: "Report #RPT-881 uploaded with EXIF GPS coordinates [19.0765, 72.8782]. CNN verified incomplete foundation.",
    actor: "Citizen #409",
    type: "INFO"
  },
  {
    id: "LOG-1007",
    timestamp: "2026-09-09 11:15:30 IST",
    projectId: "PRJ-2026-115",
    projectName: "Godavari Basin Flood Defense Wall",
    action: "Escalated to Vigilance Bureau",
    details: "72h SLA timer expired without contractor remediation plan. Case transferred to Central Anti-Corruption Bureau.",
    actor: "Automated SLA Monitor",
    type: "WARNING"
  },
  {
    id: "LOG-1006",
    timestamp: "2026-09-08 16:45:10 IST",
    projectId: "PRJ-2026-042",
    projectName: "Suburban Multi-Specialty General Hospital Wing B",
    action: "Notice Sent to Authority",
    details: "Official audit notice #PW-8830 sent to Ministry of Public Works. 48h deadline initiated.",
    actor: "Auditor Sarah Jenkins",
    type: "ACTION"
  }
];

window.CONTRACTOR_MONOPOLY_DATA = [
  { name: "Vanguard Infra Consortium", contractsWon: 14, totalValue: 1250000000, shellConnections: 3, riskIndex: 94, flag: "Collusive Bidding Network" },
  { name: "Apex Healthcare BuildCorp", contractsWon: 8, totalValue: 680000000, shellConnections: 1, riskIndex: 72, flag: "Repeated Budget Overruns" },
  { name: "HydroShield Infrastructure", contractsWon: 6, totalValue: 540000000, shellConnections: 2, riskIndex: 88, flag: "Substandard Materials" },
  { name: "BuildTech Urban Solutions", contractsWon: 5, totalValue: 290000000, shellConnections: 0, riskIndex: 35, flag: "Clean Audit History" },
  { name: "SunGrid Power Systems", contractsWon: 4, totalValue: 210000000, shellConnections: 0, riskIndex: 12, flag: "High Performance Rating" }
];
