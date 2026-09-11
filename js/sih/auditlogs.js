// Express Routes for Authority Escalation Cases & Audit Logging
const express = require('express');
const router = express.Router();

let auditLogs = [
  { id: "LOG-1009", timestamp: "2026-09-11 09:30:14 IST", projectId: "PRJ-2026-089", projectName: "Metropolitan Elevated Expressway Line 4", action: "AI Anomaly Triggered", details: "CNN Satellite feed & Treasury disbursement parser detected 54% completion discrepancy. Automated alert dispatched.", actor: "CIVIC-EYE AI Engine", type: "CRITICAL" },
  { id: "LOG-1008", timestamp: "2026-09-10 14:22:00 IST", projectId: "PRJ-2026-089", projectName: "Metropolitan Elevated Expressway Line 4", action: "Citizen Evidence Uploaded", details: "Report #RPT-881 uploaded with EXIF GPS coordinates [19.0765, 72.8782]. CNN verified incomplete foundation.", actor: "Citizen #409", type: "INFO" },
  { id: "LOG-1007", timestamp: "2026-09-09 11:15:30 IST", projectId: "PRJ-2026-115", projectName: "Godavari Basin Flood Defense Wall", action: "Escalated to Vigilance Bureau", details: "72h SLA timer expired without contractor remediation plan. Case transferred to Central Anti-Corruption Bureau.", actor: "Automated SLA Monitor", type: "WARNING" }
];

// GET Audit Logs
router.get('/logs', (req, res) => {
  res.json({ success: true, count: auditLogs.length, data: auditLogs });
});

// POST New Audit Log Entry
router.post('/logs', (req, res) => {
  const newLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST",
    ...req.body
  };
  auditLogs.unshift(newLog);
  res.status(201).json({ success: true, data: newLog });
});

module.exports = router;
