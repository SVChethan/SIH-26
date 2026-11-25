// CIVIC-EYE AI - Main React Application Engine

const { useState, useEffect, useRef } = React;

// Lucide Icon Helper Component
const Icon = ({ name, size = 18, className = "" }) => {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [name]);
  return <i data-lucide={name} className={`inline-block ${className}`} style={{ width: size, height: size }}></i>;
};

// Main App Component
function App() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("overview"); // overview, map, citizen, engine, workflow, analytics
  const [projects, setProjects] = useState(window.INITIAL_PROJECTS || []);
  const [auditLogs, setAuditLogs] = useState(window.INITIAL_AUDIT_LOGS || []);
  const [selectedProjectId, setSelectedProjectId] = useState("PRJ-2026-089");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [anomalyFilter, setAnomalyFilter] = useState("ALL");
  const [showCitizenModal, setShowCitizenModal] = useState(false);

  // SLA Countdown Clock tick
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Theme Class
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [theme]);

  // Selected Project Object
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Action Handlers
  const handleSendToAuthority = (projId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, workflowStatus: "UNDER_INVESTIGATION", slaDeadlineHours: 48 };
      }
      return p;
    }));
    const proj = projects.find(p => p.id === projId);
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST",
      projectId: projId,
      projectName: proj?.name || projId,
      action: "Notice Sent to Authority",
      details: `Official audit notice dispatched to ${proj?.assignedAuthority || 'Concerned Ministry'}. 48h SLA timer started.`,
      actor: "Auditor Sarah Jenkins",
      type: "ACTION"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleEscalateCase = (projId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { 
          ...p, 
          workflowStatus: "ESCALATED", 
          status: "RED", 
          riskScore: 98, 
          slaDeadlineHours: 0,
          assignedAuthority: "Central Anti-Corruption Vigilance Bureau"
        };
      }
      return p;
    }));
    const proj = projects.find(p => p.id === projId);
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST",
      projectId: projId,
      projectName: proj?.name || projId,
      action: "Case Escalated to Central Bureau",
      details: `Case escalated to Central Anti-Corruption Vigilance Bureau. Emergency disbursement freeze order issued.`,
      actor: "System Administrator / Anti-Corruption Director",
      type: "WARNING"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleResolveCase = (projId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, workflowStatus: "RESOLVED", status: "GREEN", riskScore: 15 };
      }
      return p;
    }));
    const proj = projects.find(p => p.id === projId);
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST",
      projectId: projId,
      projectName: proj?.name || projId,
      action: "Case Remediation Verified",
      details: "Contractor submitted verified engineering sign-off and rectified financial variance. Case marked resolved.",
      actor: "Chief Integrity Officer",
      type: "INFO"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Citizen Submission
  const handleAddCitizenReport = (reportData) => {
    setProjects(prev => prev.map(p => {
      if (p.id === reportData.projectId) {
        const updatedPhotos = [reportData.photoReport, ...p.citizenPhotos];
        const newActualProgress = reportData.photoReport.cnnAnalysis.estimatedCompletion;
        const newDelta = newActualProgress - p.reportedProgress;
        const isAnomaly = Math.abs(newDelta) > 20;
        return {
          ...p,
          actualProgress: newActualProgress,
          discrepancyDelta: newDelta,
          citizenPhotos: updatedPhotos,
          status: isAnomaly ? "RED" : p.status,
          riskScore: isAnomaly ? Math.max(p.riskScore, 92) : p.riskScore
        };
      }
      return p;
    }));

    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " IST",
      projectId: reportData.projectId,
      projectName: projects.find(p => p.id === reportData.projectId)?.name || reportData.projectId,
      action: "Citizen Evidence Uploaded & CNN Verified",
      details: `Citizen submitted site photo at GPS [${reportData.photoReport.lat}, ${reportData.photoReport.lng}]. CNN verified physical progress: ${reportData.photoReport.cnnAnalysis.estimatedCompletion}%.`,
      actor: reportData.photoReport.submitter,
      type: "INFO"
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setShowCitizenModal(false);
  };

  // KPI Computations
  const totalMonitored = projects.length;
  const totalAllocated = projects.reduce((acc, p) => acc + p.allocatedBudget, 0);
  const totalDisbursed = projects.reduce((acc, p) => acc + p.disbursedBudget, 0);
  const totalVarianceRisk = projects.filter(p => p.status === "RED").reduce((acc, p) => acc + (p.disbursedBudget - (p.allocatedBudget * (p.actualProgress / 100))), 0);
  const flaggedAlertsCount = projects.filter(p => p.status === "RED").length;
  const pendingReviewCount = projects.filter(p => p.workflowStatus === "UNDER_INVESTIGATION" || p.workflowStatus === "FLAGGED").length;
  const escalatedCount = projects.filter(p => p.workflowStatus === "ESCALATED").length;

  // Filtered Projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "ALL" || p.status === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Icon name="shield-alert" size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg tracking-wider text-slate-100 uppercase">CIVIC-EYE AI</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold font-mono">v3.4-PROD</span>
            </div>
            <p className="text-xs text-slate-400">AI-Powered Public Construction & Corruption Detection System</p>
          </div>
        </div>

        {/* Global Quick Search */}
        <div className="hidden md:flex items-center bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/60 rounded-xl px-3 py-1.5 w-72">
          <Icon name="search" size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search projects, contractors, tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-400 focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-200">
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCitizenModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-cyan-500/20 transition"
          >
            <Icon name="upload-cloud" size={16} />
            <span className="hidden sm:inline">Submit Geotagged Photo</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
            title="Toggle Light/Dark Theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-slate-900/70 border-b border-slate-800 px-4 py-2 flex items-center space-x-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "overview" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="layout-dashboard" size={16} />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "map" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="map-pin" size={16} />
          <span>GIS Construction Map</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveTab("citizen")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "citizen" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="camera" size={16} />
          <span>Citizen Evidence Portal</span>
        </button>

        <button
          onClick={() => setActiveTab("engine")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "engine" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="cpu" size={16} />
          <span>AI Anomaly Engine</span>
          {flaggedAlertsCount > 0 && (
            <span className="bg-red-500/30 text-red-400 border border-red-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {flaggedAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("workflow")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "workflow" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="scale" size={16} />
          <span>Authority Workflow & Escalation</span>
          {escalatedCount > 0 && (
            <span className="bg-amber-500/30 text-amber-400 border border-amber-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-bounce">
              {escalatedCount} ESCALATED
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "analytics" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <Icon name="bar-chart-3" size={16} />
          <span>Monopoly & Risk Analytics</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Module 1: Dashboard Overview Header & KPI Metrics */}
        <KPIHeader
          totalMonitored={totalMonitored}
          totalAllocated={totalAllocated}
          totalDisbursed={totalDisbursed}
          totalVarianceRisk={totalVarianceRisk}
          flaggedAlertsCount={flaggedAlertsCount}
          pendingReviewCount={pendingReviewCount}
          escalatedCount={escalatedCount}
          riskFilter={riskFilter}
          setRiskFilter={setRiskFilter}
        />

        {/* Tab 1: Overview Dashboard Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Actions & Urgent Alerts Banner */}
            <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                  <Icon name="alert-triangle" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    CRITICAL CORRUPTION ANOMALY DETECTED
                    <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">PRIORITY AUDIT</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Metropolitan Elevated Expressway Line 4: 90% budget paid ($405M) vs 38% physical CNN progress. $234M unexplained variance.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedProjectId("PRJ-2026-089");
                    setIsDrawerOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center space-x-1.5"
                >
                  <Icon name="eye" size={16} />
                  <span>Inspect Audit File</span>
                </button>
                <button
                  onClick={() => setActiveTab("workflow")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition"
                >
                  View Case Queue
                </button>
              </div>
            </div>

            {/* Split View: GIS Map Mini Preview + High Risk Projects Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* GIS Map Preview Card */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="map-pin" size={18} className="text-cyan-400" />
                    <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Live GIS Construction Map</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("map")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Full Screen Map</span>
                    <Icon name="arrow-up-right" size={14} />
                  </button>
                </div>

                <div className="relative flex-1 min-h-[320px] rounded-xl overflow-hidden border border-slate-800">
                  <LeafletMapComponent
                    projects={filteredProjects}
                    selectedProjectId={selectedProjectId}
                    onSelectProject={(id) => {
                      setSelectedProjectId(id);
                      setIsDrawerOpen(true);
                    }}
                  />
                </div>
              </div>

              {/* Anomaly Watchlist */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="shield-alert" size={18} className="text-red-400" />
                    <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Flagged Projects Queue</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{filteredProjects.length} Active Items</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setIsDrawerOpen(true);
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer hover:border-cyan-500/50 ${
                        p.status === "RED"
                          ? "bg-red-950/20 border-red-900/40"
                          : p.status === "YELLOW"
                          ? "bg-amber-950/20 border-amber-900/40"
                          : "bg-slate-800/40 border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              p.status === "RED" ? "bg-red-500 animate-pulse" : p.status === "YELLOW" ? "bg-amber-500" : "bg-emerald-500"
                            }`}></span>
                            <span className="font-mono text-xs text-slate-400 font-bold">{p.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.workflowStatus === "ESCALATED" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                              p.workflowStatus === "UNDER_INVESTIGATION" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                              "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {p.workflowStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">{p.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{p.contractor} • {p.sector}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className={`text-xs font-extrabold ${p.discrepancyDelta < -20 ? "text-red-400" : "text-slate-300"}`}>
                            {p.discrepancyDelta}% Delta
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Risk Score: <span className="text-white font-bold">{p.riskScore}/100</span></p>
                        </div>
                      </div>

                      {/* Progress Comparison */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Claimed: <strong className="text-blue-400">{p.reportedProgress}%</strong></span>
                          <span>CNN Estimated: <strong className="text-cyan-400">{p.actualProgress}%</strong></span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div style={{ width: `${p.actualProgress}%` }} className="bg-cyan-400 h-full"></div>
                          <div style={{ width: `${Math.max(0, p.reportedProgress - p.actualProgress)}%` }} className="bg-red-500/60 h-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit History Log Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name="history" size={18} className="text-cyan-400" />
                  <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Recent Audit & Escalation Log</h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Immutable Blockchain Hash: SHA256-VIGIL-8921</span>
              </div>
              <AuditLogTable logs={auditLogs.slice(0, 5)} />
            </div>
          </div>
        )}

        {/* Tab 2: Full GIS Map Module */}
        {activeTab === "map" && (
          <div className="h-[calc(100vh-180px)] min-h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Icon name="map-pin" size={20} className="text-cyan-400" />
                  Interactive GIS Public Works Corruption Map
                </h2>
                <p className="text-xs text-slate-400">Click any marker pin to open full project audit file, contractor shell profile, and geotagged citizen evidence photos.</p>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk ({projects.filter(p=>p.status==="RED").length})
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Discrepancy ({projects.filter(p=>p.status==="YELLOW").length})
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> On Track ({projects.filter(p=>p.status==="GREEN").length})
                </span>
              </div>
            </div>

            <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800">
              <LeafletMapComponent
                projects={filteredProjects}
                selectedProjectId={selectedProjectId}
                onSelectProject={(id) => {
                  setSelectedProjectId(id);
                  setIsDrawerOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Citizen Evidence Portal */}
        {activeTab === "citizen" && (
          <CitizenPortalModule
            projects={projects}
            onAddReport={handleAddCitizenReport}
          />
        )}

        {/* Tab 4: AI Anomaly Detection Engine */}
        {activeTab === "engine" && (
          <AnomalyEngineModule
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setIsDrawerOpen(true);
            }}
          />
        )}

        {/* Tab 5: Authority Workflow & Escalation */}
        {activeTab === "workflow" && (
          <CaseWorkflowModule
            projects={projects}
            auditLogs={auditLogs}
            onSendToAuthority={handleSendToAuthority}
            onEscalateCase={handleEscalateCase}
            onResolveCase={handleResolveCase}
          />
        )}

        {/* Tab 6: Analytics & Risk Models */}
        {activeTab === "analytics" && (
          <AnalyticsChartsModule projects={projects} />
        )}
      </main>

      {/* Slide-over Inspection Drawer */}
      <ProjectDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={selectedProject}
        onSendToAuthority={handleSendToAuthority}
        onEscalateCase={handleEscalateCase}
      />

      {/* Citizen Submission Modal */}
      {showCitizenModal && (
        <CitizenSubmissionModal
          projects={projects}
          onClose={() => setShowCitizenModal(false)}
          onSubmitReport={handleAddCitizenReport}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Module 1 Component: KPI Header Metrics Cards
// ----------------------------------------------------------------------
function KPIHeader({
  totalMonitored,
  totalAllocated,
  totalDisbursed,
  totalVarianceRisk,
  flaggedAlertsCount,
  pendingReviewCount,
  escalatedCount,
  riskFilter,
  setRiskFilter
}) {
  const formatMoney = (val) => `$${(val / 1000000).toFixed(1)}M`;

  return (
    <div className="space-y-4">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Monitored Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects Monitored</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Icon name="building-2" size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-100 font-mono">{totalMonitored} Sites</div>
            <p className="text-xs text-slate-400 mt-1">Capital Allocated: <strong className="text-slate-200">{formatMoney(totalAllocated)}</strong></p>
          </div>
        </div>

        {/* KPI 2: Budget Allocated vs Disbursed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed vs Unearned</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Icon name="dollar-sign" size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-100 font-mono">{formatMoney(totalDisbursed)}</div>
            <p className="text-xs text-red-400 font-bold mt-1 flex items-center gap-1">
              <Icon name="trending-up" size={14} />
              {formatMoney(totalVarianceRisk)} High-Risk Variance
            </p>
          </div>
        </div>

        {/* KPI 3: Flagged Anomaly Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged Corruption Alerts</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 glow-red">
              <Icon name="alert-triangle" size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-red-400 font-mono flex items-center gap-2">
              {flaggedAlertsCount} High Risk
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Automated CNN/NLP Scans Active</p>
          </div>
        </div>

        {/* KPI 4: Pending Authority Reviews & Escalated */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending SLA & Bureau Cases</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Icon name="clock" size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-400 font-mono flex items-center gap-2">
              {pendingReviewCount} Active
              {escalatedCount > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  {escalatedCount} Escalated
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Under Investigation / Escalated</p>
          </div>
        </div>
      </div>

      {/* Risk Filter Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Icon name="filter" size={14} className="text-cyan-400" />
          Filter by Corruption Status:
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setRiskFilter("ALL")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              riskFilter === "ALL" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setRiskFilter("RED")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              riskFilter === "RED" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🔴 Corruption Risk
          </button>
          <button
            onClick={() => setRiskFilter("YELLOW")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              riskFilter === "YELLOW" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🟡 Discrepancy
          </button>
          <button
            onClick={() => setRiskFilter("GREEN")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              riskFilter === "GREEN" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🟢 On Track
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Leaflet GIS Map Component
// ----------------------------------------------------------------------
function LeafletMapComponent({ projects, selectedProjectId, onSelectProject }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center around Mumbai/Maharashtra project area
      const map = L.map(mapContainerRef.current, {
        center: [19.0760, 72.8777],
        zoom: 11,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Render pins
    projects.forEach(p => {
      const pinClass = p.status === "RED" ? "pin-red" : p.status === "YELLOW" ? "pin-yellow" : "pin-green";
      const customIcon = L.divIcon({
        className: `custom-map-pin ${pinClass}`,
        html: `<span>${p.status === "RED" ? "!" : p.status === "YELLOW" ? "?" : "✓"}</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(p.coordinates, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 220px;">
          <div style="font-size: 11px; font-weight: bold; color: #64748b; font-family: monospace;">${p.id}</div>
          <div style="font-size: 13px; font-weight: border; color: #0f172a; margin-top: 2px;">${p.name}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">Contractor: <strong>${p.contractor}</strong></div>
          <hr style="margin: 6px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <div style="display: flex; justify-between: space-between; font-size: 11px;">
            <span>Reported: <strong>${p.reportedProgress}%</strong></span>
            <span style="color: ${p.discrepancyDelta < -20 ? '#dc2626' : '#059669'};">CNN Actual: <strong>${p.actualProgress}%</strong></span>
          </div>
          <button id="btn-inspect-${p.id}" style="margin-top: 8px; width: 100%; background: #0284c7; color: white; border: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
            Inspect Audit File →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        onSelectProject(p.id);
      });

      markersRef.current[p.id] = marker;
    });

    // Delegate Popup Button Clicks
    const handlePopupClick = (e) => {
      if (e.target && e.target.id && e.target.id.startsWith("btn-inspect-")) {
        const id = e.target.id.replace("btn-inspect-", "");
        onSelectProject(id);
      }
    };
    document.addEventListener("click", handlePopupClick);

    return () => {
      document.removeEventListener("click", handlePopupClick);
    };
  }, [projects]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

// ----------------------------------------------------------------------
// Project Detail Inspection Drawer
// ----------------------------------------------------------------------
function ProjectDetailDrawer({ isOpen, onClose, project, onSendToAuthority, onEscalateCase }) {
  if (!isOpen || !project) return null;

  const formatMoney = (val) => `$${(val / 1000000).toFixed(2)}M`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-Over Panel */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl h-full flex flex-col z-10 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {project.id}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                project.status === "RED" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                project.status === "YELLOW" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {project.status === "RED" ? "🔴 CORRUPTION RISK" : project.status === "YELLOW" ? "🟡 DISCREPANCY" : "🟢 ON TRACK"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-2">{project.name}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <Icon name="map-pin" size={14} className="text-cyan-400" />
              {project.locationName} • {project.sector}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Action Button Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Workflow:</span>
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {project.workflowStatus}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSendToAuthority(project.id)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
            >
              <Icon name="send" size={14} />
              <span>Send to Authority</span>
            </button>
            <button
              onClick={() => onEscalateCase(project.id)}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow shadow-red-600/30 transition flex items-center space-x-1"
            >
              <Icon name="alert-circle" size={14} />
              <span>Escalate Case</span>
            </button>
          </div>
        </div>

        {/* Financial & Progress Audit Matrix */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="calculator" size={16} className="text-cyan-400" />
            Financial vs Physical Progress Audit
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Allocated</span>
              <div className="text-sm font-bold text-slate-200 mt-1">{formatMoney(project.allocatedBudget)}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Disbursed</span>
              <div className="text-sm font-bold text-cyan-400 mt-1">{formatMoney(project.disbursedBudget)}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Claimed %</span>
              <div className="text-sm font-bold text-blue-400 mt-1">{project.reportedProgress}%</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">CNN Actual %</span>
              <div className="text-sm font-bold text-red-400 mt-1">{project.actualProgress}%</div>
            </div>
          </div>

          {/* Progress Comparison Visual Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Completion Deficit:</span>
              <span className="text-red-400 font-bold">{project.discrepancyDelta}% Unearned Payout</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex relative">
              <div style={{ width: `${project.actualProgress}%` }} className="bg-cyan-400 h-full" title="CNN Verified Actual Progress"></div>
              <div style={{ width: `${Math.max(0, project.reportedProgress - project.actualProgress)}%` }} className="bg-red-500/80 h-full stripe-pattern" title="Discrepancy Deficit"></div>
            </div>
          </div>
        </div>

        {/* Contractor Profile & Shell Warning */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="briefcase" size={16} className="text-cyan-400" />
              Contractor & Entity Bidding Background
            </h3>
            <span className="text-xs text-red-400 font-mono font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              {project.contractorRisk}
            </span>
          </div>
          <div className="text-xs text-slate-300">
            <p>Name: <strong className="text-slate-100">{project.contractor}</strong></p>
            <p className="font-mono text-slate-400 mt-0.5">Tax Reg ID: {project.contractorTaxId}</p>
          </div>
        </div>

        {/* Detected Anomalies List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="cpu" size={16} className="text-red-400" />
            Automated Anomaly Triggers ({project.anomalies.length})
          </h3>
          <div className="space-y-2">
            {project.anomalies.map((a, idx) => (
              <div key={idx} className="bg-red-950/20 border border-red-900/40 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-red-400">{a.type}</span>
                  <span className="text-[10px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded">
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geotagged Citizen Photos */}
        {project.citizenPhotos && project.citizenPhotos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="camera" size={16} className="text-cyan-400" />
              Attached Geotagged Citizen Photo Evidence
            </h3>
            <div className="space-y-3">
              {project.citizenPhotos.map((photo) => (
                <div key={photo.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-3 space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-56">
                    <img src={photo.imageUrl} alt="Citizen Evidence" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-cyan-400">
                      GPS: {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-300 italic">"{photo.userNotes}"</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Submitter: {photo.submitter}</span>
                      <span>Device: {photo.exifData.camera}</span>
                    </div>

                    {/* CNN Analysis Box */}
                    <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-xl p-2.5 mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                        <span>CNN Classification: {photo.cnnAnalysis.detectedState}</span>
                        <span>Confidence: {photo.cnnAnalysis.confidenceScore}%</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {photo.cnnAnalysis.detectedObjects.map((obj, i) => (
                          <span key={i} className="text-[10px] bg-cyan-900/40 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Citizen Portal Module & Scanning Simulator
// ----------------------------------------------------------------------
function CitizenPortalModule({ projects, onAddReport }) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [userNotes, setUserNotes] = useState("");
  const [submitterName, setSubmitterName] = useState("Anonymous Auditor #702");
  const [selectedSamplePhoto, setSelectedSamplePhoto] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const samplePhotos = [
    {
      url: "assets/site_foundation_incomplete_1789104285937.png",
      label: "Incomplete Site Foundation (Exp Expressway Line 4)",
      lat: 19.0765,
      lng: 72.8782,
      estProgress: 35,
      objects: ["Exposed Rebar 12%", "Idle Excavator 1", "Unpoured Concrete 88%"]
    },
    {
      url: "assets/bridge_pier_crack_1789104300196.png",
      label: "Bridge Pier Stress Fracture (Dam Project)",
      lat: 19.0180,
      lng: 72.8565,
      estProgress: 48,
      objects: ["Micro-Fracture 1.2m", "Unsealed Surface", "High Moisture"]
    },
    {
      url: "assets/school_building_delayed_1789104312663.png",
      label: "Delayed Unroofed Shell (Hospital Project)",
      lat: 19.1200,
      lng: 72.9055,
      estProgress: 40,
      objects: ["Masonry Shell 40%", "No Roof Grid", "Zero HVAC"]
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const photo = samplePhotos[selectedSamplePhoto];

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanResult({
          detectedState: photo.label,
          estimatedCompletion: photo.estProgress,
          confidenceScore: 98.6,
          detectedObjects: photo.objects
        });
      }
    }, 400);
  };

  const handleSubmit = () => {
    if (!scanResult) return;
    const photo = samplePhotos[selectedSamplePhoto];
    const newReport = {
      projectId: selectedProjectId,
      photoReport: {
        id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
        submitter: submitterName || "Anonymous Citizen",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC",
        lat: photo.lat,
        lng: photo.lng,
        imageUrl: photo.url,
        userNotes: userNotes || "Ground truth site photo submitted via Citizen Portal.",
        exifData: { camera: "iPhone 15 Pro Max", deviceHash: "SHA256:f91a82c3", accuracy: "±1.5m", ISO: 100, focalLength: "24mm" },
        cnnAnalysis: scanResult
      }
    };
    onAddReport(newReport);
    alert("Citizen Geotagged Photo Submitted Successfully! Project anomaly updated.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Icon name="camera" size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Citizen Reporting & GPS Photo Verification Portal</h2>
            <p className="text-xs text-slate-400">Submit site photos with auto-extracted EXIF metadata for real-time CNN optical completion verification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Submission Form Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Construction Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name} ({p.sector})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Submitter Identity / Handle</label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Ground Truth Site Photo</label>
              <div className="grid grid-cols-3 gap-2">
                {samplePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedSamplePhoto(idx);
                      setScanResult(null);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition max-h-24 ${
                      selectedSamplePhoto === idx ? "border-cyan-500 shadow-md shadow-cyan-500/20" : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <img src={photo.url} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Site Notes / Discrepancy Observations</label>
              <textarea
                rows={3}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Describe observed physical progress, idle equipment, or structural flaws..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
            >
              <Icon name="cpu" size={16} />
              <span>{isScanning ? `Scanning CNN Neural Net (${scanProgress}%)...` : "Run CNN Optical Image Verification"}</span>
            </button>
          </div>

          {/* CNN Neural Net Analysis Display */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Icon name="eye" size={16} />
                CNN Neural Network Visualizer
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Model: ResNet-152-Civic</span>
            </div>

            {/* Photo Scan Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 my-3 min-h-[220px] flex items-center justify-center bg-slate-900">
              <img src={samplePhotos[selectedSamplePhoto].url} alt="Scan Target" className="w-full h-full object-cover" />

              {/* Laser Scan Line */}
              {isScanning && <div className="laser-line"></div>}

              {!scanResult && !isScanning && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                  <Icon name="scan" size={32} className="text-cyan-400 mb-2 animate-bounce" />
                  <p className="text-xs text-slate-200 font-semibold">Click "Run CNN Optical Image Verification" to analyze physical features</p>
                </div>
              )}
            </div>

            {/* Analysis Output Results */}
            {scanResult && (
              <div className="bg-cyan-950/40 border border-cyan-900/50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">State: {scanResult.detectedState}</span>
                  <span className="text-emerald-400 font-bold">Confidence: {scanResult.confidenceScore}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Estimated Physical Progress:</span>
                  <strong className="text-cyan-300 font-mono text-sm">{scanResult.estimatedCompletion}%</strong>
                </div>

                <div className="flex flex-wrap gap-1">
                  {scanResult.detectedObjects.map((obj, i) => (
                    <span key={i} className="text-[10px] bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 px-2 py-0.5 rounded font-mono">
                      {obj}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Icon name="check-circle-2" size={16} />
                  <span>Attach Evidence to Project Record</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Module 4: Data Extraction & AI Anomaly Engine Component
// ----------------------------------------------------------------------
function AnomalyEngineModule({ projects, onSelectProject }) {
  const [activeTriggerTab, setActiveTriggerTab] = useState("FINANCIAL"); // FINANCIAL, MONOPOLY, IMAGE, NLP

  const allAnomalies = projects.flatMap(p => 
    p.anomalies.map(a => ({ ...a, project: p }))
  );

  const filteredAnomalies = allAnomalies.filter(a => {
    if (activeTriggerTab === "FINANCIAL") return a.type.includes("Financial");
    if (activeTriggerTab === "MONOPOLY") return a.type.includes("Monopoly") || a.type.includes("Bid");
    if (activeTriggerTab === "IMAGE") return a.type.includes("Image");
    if (activeTriggerTab === "NLP") return a.type.includes("Contract NLP");
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Icon name="cpu" size={20} className="text-cyan-400" />
              Automated Data Extraction & AI Anomaly Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Powered by simulated BeautifulSoup e-Procurement scrapers, Treasury disbursement ETL, and NLP tender clause verification.</p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              NLP Model: Llama-3-GovAudit
            </span>
          </div>
        </div>

        {/* Anomaly Trigger Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTriggerTab("FINANCIAL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTriggerTab === "FINANCIAL" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon name="dollar-sign" size={16} />
            <span>Financial Discrepancy Triggers</span>
          </button>
          <button
            onClick={() => setActiveTriggerTab("MONOPOLY")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTriggerTab === "MONOPOLY" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon name="building" size={16} />
            <span>Contractor Monopoly & Bidding Collusion</span>
          </button>
          <button
            onClick={() => setActiveTriggerTab("IMAGE")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTriggerTab === "IMAGE" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon name="image" size={16} />
            <span>Image / Progress Mismatch</span>
          </button>
          <button
            onClick={() => setActiveTriggerTab("NLP")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTriggerTab === "NLP" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon name="file-text" size={16} />
            <span>Contract NLP Clause Breaches</span>
          </button>
        </div>

        {/* Anomaly Feed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Detected Date</th>
                <th className="p-3">Project & Contractor</th>
                <th className="p-3">Anomaly Rule Code</th>
                <th className="p-3">Description & Severity</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAnomalies.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400">{item.detectedDate}</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{item.project.name}</div>
                    <div className="text-[11px] text-slate-400">{item.project.contractor}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-cyan-400">{item.code}</td>
                  <td className="p-3 max-w-md">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.severity === "CRITICAL" ? "bg-red-500 text-white" : "bg-amber-500 text-slate-950"
                      }`}>
                        {item.severity}
                      </span>
                      <span className="text-slate-300">{item.description}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectProject(item.project.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Audit File →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Module 5: Authority Verification & Escalation Workflow Component
// ----------------------------------------------------------------------
function CaseWorkflowModule({ projects, auditLogs, onSendToAuthority, onEscalateCase, onResolveCase }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Icon name="scale" size={20} className="text-cyan-400" />
              Authority Verification & Escalation Case Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Enforce SLA response deadlines, issue audit notices, and escalate unresolved cases directly to Central Anti-Corruption Vigilance Bureau.</p>
          </div>
          <span className="font-mono text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold">
            SLA Response Deadline: 48 Hours
          </span>
        </div>

        {/* Active Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{p.id}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      p.workflowStatus === "ESCALATED" ? "bg-red-500 text-white animate-pulse" :
                      p.workflowStatus === "UNDER_INVESTIGATION" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                      "bg-slate-800 text-slate-300"
                    }`}>
                      {p.workflowStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.contractor}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400">Risk Score</span>
                  <div className="text-base font-extrabold text-red-400">{p.riskScore}/100</div>
                </div>
              </div>

              {/* SLA Response Timer */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="clock" size={16} className={p.slaDeadlineHours === 0 ? "text-red-500 animate-bounce" : "text-amber-400"} />
                  <span className="text-xs text-slate-300 font-mono">
                    {p.slaDeadlineHours === 0 ? "SLA BREACHED - ESCALATED" : `SLA Deadline: ${p.slaDeadlineHours}h Remaining`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{p.assignedAuthority}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                {p.workflowStatus !== "UNDER_INVESTIGATION" && p.workflowStatus !== "ESCALATED" && (
                  <button
                    onClick={() => onSendToAuthority(p.id)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <Icon name="send" size={14} />
                    <span>Send Notice to Authority</span>
                  </button>
                )}

                {p.workflowStatus !== "ESCALATED" && (
                  <button
                    onClick={() => onEscalateCase(p.id)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <Icon name="alert-circle" size={14} />
                    <span>Escalate to Bureau</span>
                  </button>
                )}

                <button
                  onClick={() => onResolveCase(p.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Audit History Log */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="history" size={16} className="text-cyan-400" />
            Complete Audit Timeline Log
          </h3>
          <AuditLogTable logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable Audit Log Table
// ----------------------------------------------------------------------
function AuditLogTable({ logs }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
          <tr>
            <th className="p-3">Timestamp</th>
            <th className="p-3">Log ID & Project</th>
            <th className="p-3">Action Performed</th>
            <th className="p-3">Actor / Agent</th>
            <th className="p-3">Audit Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-800/30 transition">
              <td className="p-3 text-slate-400">{log.timestamp}</td>
              <td className="p-3">
                <span className="font-bold text-cyan-400">{log.id}</span>
                <div className="text-[10px] text-slate-400">{log.projectName}</div>
              </td>
              <td className="p-3">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  log.type === "CRITICAL" ? "bg-red-500 text-white" :
                  log.type === "WARNING" ? "bg-amber-500 text-slate-950" :
                  log.type === "ACTION" ? "bg-cyan-500 text-slate-950" :
                  "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {log.action}
                </span>
              </td>
              <td className="p-3 text-slate-300">{log.actor}</td>
              <td className="p-3 text-slate-300 font-sans max-w-sm">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------------------------------------------------------------
// Module 6: Analytics & Risk Models Component
// ----------------------------------------------------------------------
function AnalyticsChartsModule({ projects }) {
  const monopolyData = window.CONTRACTOR_MONOPOLY_DATA || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contractor Monopoly Risk Index Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Icon name="building-2" size={18} className="text-cyan-400" />
              Contractor Bidding Monopoly Risk Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">NLP Collusion Scanner</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase">
                <tr>
                  <th className="p-2.5">Contractor</th>
                  <th className="p-2.5">Tenders Won</th>
                  <th className="p-2.5">Shell Links</th>
                  <th className="p-2.5">Risk Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {monopolyData.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-slate-200">{c.name}</td>
                    <td className="p-2.5 font-mono text-cyan-400">{c.contractsWon} Awards</td>
                    <td className="p-2.5 font-mono text-amber-400">{c.shellConnections} Entities</td>
                    <td className="p-2.5">
                      <span className={`font-mono font-bold ${c.riskIndex > 80 ? "text-red-400" : "text-emerald-400"}`}>
                        {c.riskIndex}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget vs CNN Actual Progress Visual Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Icon name="bar-chart-3" size={18} className="text-cyan-400" />
              Project Progress Discrepancy Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-mono">Disbursed vs Actual %</span>
          </div>

          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-slate-200">{p.name}</span>
                  <span className={p.discrepancyDelta < -20 ? "text-red-400 font-bold" : "text-slate-400"}>
                    Claimed {p.reportedProgress}% vs CNN {p.actualProgress}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${p.actualProgress}%` }} className="bg-cyan-400 h-full"></div>
                  <div style={{ width: `${Math.max(0, p.reportedProgress - p.actualProgress)}%` }} className="bg-red-500 h-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Render Root
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
