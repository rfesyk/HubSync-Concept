// Staffing derivation helpers

export const buildStaffingRows = (list) => {
  const workflowByStep = [
    "EL",
    "Request List",
    "Upload",
    "Organizer",
    "Review",
    "Sign Return",
    "Payments",
  ];
  const partners = ["Ken Yoder", "Sarah Kleinfelter", "Alex Reed", "Maya Patel"];
  const offices = ["Chicago", "Detroit", "Denver", "Charlotte"];
  const regions = { Chicago:"Midwest", Detroit:"Midwest", Denver:"West", Charlotte:"Southeast" };
  const workflowColors = ["#f59e0b", "#84cc16", "#0ea5e9", "#14b8a6", "#ef4444", "#6366f1", "#06b6d4"];

  return list.map((c, idx) => {
    const office = offices[(idx + 1) % offices.length];
    const status = c.blockedBy === "client"
      ? "Awaiting Client Info"
      : c.step >= 5
        ? "QC Review"
        : "Preparation";
    return {
      id: c.id,
      client: c.name,
      workflow: workflowByStep[Math.max(0, (c.step || 1) - 1)],
      workflowColor: workflowColors[Math.max(0, (c.step || 1) - 1)],
      partner: partners[idx % partners.length],
      office,
      region: regions[office] || "Midwest",
      taxYear: 2025,
      status,
    };
  });
};

export const STAFFING_WORKFLOW_ORDER = ["EL", "Request List", "Upload", "Organizer", "Review", "Sign Return", "Payments"];
export const STAFFING_WORKFLOW_COLORS = {
  EL: "#f59e0b",
  "Request List": "#84cc16",
  Upload: "#0ea5e9",
  Organizer: "#14b8a6",
  Review: "#ef4444",
  "Sign Return": "#6366f1",
  Payments: "#06b6d4",
};

export const buildStaffingSummary = (rows, list) => {
  const byId = new Map(list.map((c) => [c.id, c]));
  const total = rows.length;
  const awaiting = rows.filter((r) => r.status === "Awaiting Client Info").length;
  const review = rows.filter((r) => r.status === "QC Review").length;
  const prep = rows.filter((r) => r.status === "Preparation").length;
  const atRisk = rows.filter((r) => {
    const c = byId.get(r.id);
    return !!(c?.urgent || c?.risk === "high");
  }).length;
  const partners = [...new Set(rows.map((r) => r.partner))];
  const avgStep = total
    ? (rows.reduce((sum, r) => sum + (byId.get(r.id)?.step || 1), 0) / total).toFixed(1)
    : "0.0";

  const stages = STAFFING_WORKFLOW_ORDER
    .map((name) => ({
      name,
      count: rows.filter((r) => r.workflow === name).length,
      color: STAFFING_WORKFLOW_COLORS[name] || "#6b7280",
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxStage = Math.max(1, ...stages.map((s) => s.count));
  const actions = rows
    .map((r) => {
      const c = byId.get(r.id);
      const riskWeight = c?.risk === "high" ? 3 : c?.risk === "med" ? 2 : 1;
      const priority = (c?.urgent ? 4 : 0) + riskWeight + (r.status === "Awaiting Client Info" ? 3 : r.status === "QC Review" ? 2 : 1);
      let nextAction = "Reassign reviewer";
      if (r.status === "Awaiting Client Info") nextAction = "Ping client";
      else if (r.workflow === "EL") nextAction = "Send engagement letter";
      else if (r.workflow === "Request List") nextAction = "Review request list";
      else if (r.workflow === "Upload") nextAction = "Validate uploads";
      else if (r.workflow === "Organizer") nextAction = "Start organizer review";
      else if (r.workflow === "Review") nextAction = "Start quality review";
      else if (r.workflow === "Sign Return") nextAction = "Collect signature";
      else if (r.workflow === "Payments") nextAction = "Close payment step";
      return {
        id: r.id,
        client: r.client,
        partner: r.partner,
        workflow: r.workflow,
        status: r.status,
        step: c?.step || 1,
        steps: c?.steps || 7,
        nextAction,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority || a.step - b.step || a.client.localeCompare(b.client));

  return {
    total,
    awaiting,
    review,
    prep,
    atRisk,
    partners: partners.length,
    avgStep,
    stages,
    maxStage,
    actions,
  };
};
