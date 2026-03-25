// Mock data sets

export const clients = [
  { id:1, name:"John Doe",         type:"1040",   step:3, steps:7, stepLabel:"Upload Documents",       blockedBy:"client", elStatus:"signed",  urgent:false, risk:"low",  company:null,           workspaces:["1040 — 2024"] },
  { id:2, name:"Umbrella Corp",    type:"Entity", step:2, steps:7, stepLabel:"Complete Request List",   blockedBy:"client", elStatus:"pending", urgent:true,  risk:"high", company:"Umbrella Group", workspaces:["1120S — 2024","1065 — 2024","State Filings"] },
  { id:3, name:"Tiffany Trust",    type:"1041",   step:5, steps:7, stepLabel:"Review Tax Return",       blockedBy:null,     elStatus:"signed",  urgent:false, risk:"low",  company:null,           workspaces:["1041 — 2024"] },
  { id:4, name:"XYZ Company",      type:"Entity", step:1, steps:7, stepLabel:"Sign Engagement Letter",  blockedBy:"client", elStatus:"sent",    urgent:true,  risk:"high", company:"Umbrella Group", workspaces:["1120 — 2024","Extensions"] },
  { id:5, name:"Drake Maye",       type:"1040",   step:4, steps:7, stepLabel:"Tax Organizer",           blockedBy:"client", elStatus:"signed",  urgent:false, risk:"med",  company:null,           workspaces:["1040 — 2024","State — CA"] },
  { id:6, name:"Sarah Connor",     type:"1040",   step:6, steps:7, stepLabel:"Sign Tax Return",         blockedBy:"client", elStatus:"signed",  urgent:false, risk:"med",  company:null,           workspaces:["1040 — 2024"] },
  { id:7, name:"Adam Andersen",    type:"1040",   step:3, steps:7, stepLabel:"Upload Documents",        blockedBy:"client", elStatus:"signed",  urgent:false, risk:"low",  company:null,           workspaces:["1040 — 2024"] },
  { id:8, name:"Chicago Bulls LLC",type:"Entity", step:3, steps:7, stepLabel:"Upload Documents",        blockedBy:"client", elStatus:"signed",  urgent:false, risk:"med",  company:null,           workspaces:["1065 — 2024"] },
  { id:9, name:"Jordan Corp",      type:"Entity", step:2, steps:7, stepLabel:"Complete Request List",   blockedBy:"client", elStatus:"signed",  urgent:true,  risk:"high", company:null,           workspaces:["1120 — 2024"] },
  { id:10,name:"Rivera Trust",     type:"1041",   step:4, steps:7, stepLabel:"Tax Organizer",           blockedBy:"client", elStatus:"signed",  urgent:false, risk:"med",  company:null,           workspaces:["1041 — 2024"] },
  { id:11,name:"Peterson Group",   type:"Entity", step:3, steps:7, stepLabel:"Upload Documents",        blockedBy:"client", elStatus:"signed",  urgent:false, risk:"low",  company:null,           workspaces:["1120S — 2024"] },
  { id:12,name:"Maria Santos",     type:"1040",   step:5, steps:7, stepLabel:"Review Tax Return",       blockedBy:null,     elStatus:"signed",  urgent:false, risk:"low",  company:null,           workspaces:["1040 — 2024"] },
];

export const signatures = [
  { id:1, client:"John Doe",      doc:"Tax Compliance Services EL",  type:"EL",   days:3 },
  { id:2, client:"Tiffany Trust", doc:"8879 e-file Authorization",   type:"8879", days:1 },
  { id:3, client:"Drake Maye",    doc:"Engagement Letter 2024",      type:"EL",   days:7 },
];

export const forms8879 = [
  { id:1, client:"John Doe",      status:"pending",  sent:"Dec 14", jurisdiction:"Federal + PA" },
  { id:2, client:"Sarah Connor",  status:"signed",   sent:"Dec 12", jurisdiction:"Federal" },
  { id:3, client:"Tiffany Trust", status:"pending",  sent:"Dec 15", jurisdiction:"Federal + NY + CA" },
  { id:4, client:"Drake Maye",    status:"failed",   sent:"Dec 10", jurisdiction:"Federal" },
];

export const extensions = [
  { id:1, client:"Umbrella Corp", jurisdiction:"Federal",  status:"filed",    deadline:"Apr 15" },
  { id:2, client:"Umbrella Corp", jurisdiction:"PA",       status:"filed",    deadline:"Apr 15" },
  { id:3, client:"XYZ Company",   jurisdiction:"Federal",  status:"pending",  deadline:"Apr 15" },
  { id:4, client:"XYZ Company",   jurisdiction:"NY",       status:"rejected", deadline:"Apr 15" },
  { id:5, client:"Drake Maye",    jurisdiction:"Federal",  status:"pending",  deadline:"Apr 15" },
];

export const chats = [
  { id:1, name:"John Doe", type:"1040", online:true, unread:2, last:"I uploaded the W-2 forms", time:"10:24",
    topics:[
      { id:"t1", label:"General", icon:"💬", unread:2, lastMsg:"I uploaded the W-2 forms", time:"10:24",
        msgs:[
          { id:1, from:"client", text:"Hi! I have a question about my deductions", time:"9:10" },
          { id:2, from:"cpa",    text:"Sure, what would you like to know?", time:"9:12" },
          { id:3, from:"client", text:"Can I deduct my home office?", time:"9:13" },
          { id:4, from:"cpa",    text:"Yes if used exclusively for work. Need square footage.", time:"9:15" },
          { id:5, from:"event",  event:"upload", label:"Client uploaded 1 document", meta:"W-2 Workbook Testing Company.pdf · 1.1 MB", time:"10:23", docId:3 },
          { id:6, from:"client", text:"I uploaded the W-2 forms", time:"10:24" },
        ]},
      { id:"t2", label:"Tax Return 1040", icon:"📋", unread:0, lastMsg:"Return is in progress", time:"Dec 17",
        msgs:[
          { id:1, from:"cpa",    text:"Your 1040 is now in preparation", time:"Dec 17" },
          { id:2, from:"client", text:"Return is in progress", time:"Dec 17" },
        ]},
      { id:"t3", label:"8879 Signature", icon:"✍️", unread:0, lastMsg:"Please sign at your earliest convenience", time:"Dec 14",
        msgs:[
          { id:1, from:"cpa",    text:"Your 8879 is ready for e-file authorization", time:"Dec 14" },
          { id:2, from:"cpa",    text:"Please sign at your earliest convenience", time:"Dec 14" },
        ]},
    ]},
  { id:2, name:"Umbrella Corp", type:"Entity", online:false, unread:1, last:"When is the deadline?", time:"Yesterday",
    topics:[
      { id:"t1", label:"General", icon:"💬", unread:1, lastMsg:"When is the deadline?", time:"Yesterday",
        msgs:[
          { id:1, from:"client", text:"Hello, need clarification on the PBC list", time:"14:00" },
          { id:2, from:"cpa",    text:"Of course! Which items?", time:"14:05" },
          { id:3, from:"event",  event:"step", label:"Client completed Step 1", meta:"Sign Engagement Letter → Request List", time:"14:06" },
          { id:4, from:"client", text:"When is the deadline for the request list?", time:"14:08" },
        ]},
      { id:"t2", label:"1120S Filing", icon:"📋", unread:0, lastMsg:"PBC list sent", time:"Dec 15",
        msgs:[
          { id:1, from:"cpa",    text:"PBC list sent, please complete by Jan 10", time:"Dec 15" },
          { id:2, from:"client", text:"PBC list sent", time:"Dec 15" },
        ]},
      { id:"t3", label:"Engagement Letter", icon:"📝", unread:0, lastMsg:"Please sign the EL to proceed", time:"Dec 12",
        msgs:[
          { id:1, from:"cpa",    text:"Please sign the EL to proceed", time:"Dec 12" },
        ]},
    ]},
  { id:3, name:"Sarah Connor",  type:"1040", online:true, unread:0, last:"Ready to sign", time:"Mon",
    topics:[
      { id:"t1", label:"General", icon:"💬", unread:0, lastMsg:"Looks correct, ready to sign", time:"Mon",
        msgs:[
          { id:1, from:"cpa",    text:"Your return is ready for review", time:"11:00" },
          { id:2, from:"event",  event:"sign", label:"Client signed a document", meta:"8879 e-file Authorization · Federal · KBA verified", time:"11:42", docId:2 },
          { id:3, from:"client", text:"Looks correct, ready to sign", time:"15:30" },
        ]},
      { id:"t2", label:"8879 Signature", icon:"✍️", unread:0, lastMsg:"All done!", time:"Mon",
        msgs:[
          { id:1, from:"cpa",    text:"Please sign your 8879 for e-file", time:"Sun" },
          { id:2, from:"client", text:"All done!", time:"Mon" },
        ]},
    ]},
  { id:4, name:"Hubsync AI", type:"AI", online:true, unread:1, last:"I can help prioritize today's queue", time:"9:00",
    topics:[
      { id:"t1", label:"Assistant", icon:"✨", unread:1, lastMsg:"I can help prioritize today's queue", time:"9:00",
        msgs:[
          { id:1, from:"ai", text:"Hi, I'm Hubsync AI. Ask me about blockers, signatures, staffing load, or who to prioritize today.", time:"8:58" },
          { id:2, from:"cpa", text:"What should I focus on first this morning?", time:"8:59" },
          { id:3, from:"ai", text:"Start with critical blockers first, then clear oldest signatures pending over 3 days.", time:"9:00" },
        ]},
    ]},
];

export const docs = [
  { id:1, name:"Tax Compliance Services — John Doe.pdf",        client:"John Doe",      type:"EL",     size:"2.4 MB", date:"Dec 18", status:"signed",  ext:"pdf"  },
  { id:2, name:"8879 e-file Authorization — Tiffany Trust.pdf", client:"Tiffany Trust", type:"8879",   size:"0.8 MB", date:"Dec 17", status:"pending", ext:"pdf"  },
  { id:3, name:"W-2 Workbook Testing Company.pdf",              client:"John Doe",      type:"Doc",    size:"1.1 MB", date:"Dec 17", status:null,      ext:"pdf"  },
  { id:4, name:"2024 1040 Tax Return — Sarah Connor.pdf",       client:"Sarah Connor",  type:"Return", size:"5.2 MB", date:"Dec 16", status:null,      ext:"pdf"  },
  { id:5, name:"Engagement Letter — XYZ Company.docx",          client:"XYZ Company",   type:"EL",     size:"0.3 MB", date:"Dec 15", status:"sent",    ext:"docx" },
  { id:6, name:"Balance Sheet — Umbrella Corp.xlsx",            client:"Umbrella Corp", type:"PBC",    size:"1.8 MB", date:"Dec 13", status:null,      ext:"xlsx" },
];

export const auditLog = [
  { id:1, action:"Document uploaded", detail:"W-2 Workbook.pdf", who:"Client", time:"10:24 today" },
  { id:2, action:"Reminder sent",     detail:"Upload documents reminder", who:"CPA", time:"9:00 today" },
  { id:3, action:"Step advanced",     detail:"Step 2 → Step 3", who:"System", time:"Dec 17" },
  { id:4, action:"EL signed",         detail:"Engagement Letter 2024", who:"Client", time:"Dec 15" },
  { id:5, action:"8879 sent",         detail:"Federal + PA", who:"CPA", time:"Dec 14" },
];

export const staffingReviewNotes = [
  {
    id: "rn1",
    source: "Workpaper",
    description: "Unadjusted cash balance looks overstated vs prior year.",
    latestResponse: "Bank rec pulled. Large post-close item attached.",
    latestMeta: "MJ · 02/03/2026",
    reference: "Unadj. Balance / 10000 - BOA Checking",
    status: "Open",
    createdBy: "SC",
    createdAt: "02/03/2026",
    assignedTo: "MJ",
    clientId: 1,
  },
  {
    id: "rn2",
    source: "Workpaper",
    description: "Intercompany elimination is off by $2,400.",
    latestResponse: "",
    latestMeta: "",
    reference: "Elimination Adj / 12001 - Investment",
    status: "Open",
    createdBy: "PP",
    createdAt: "02/04/2026",
    assignedTo: "",
    clientId: 2,
  },
  {
    id: "rn3",
    source: "Workpaper",
    description: "Depreciation entry missing Q4 fixed asset additions.",
    latestResponse: "Updated with $45,000 additions and refreshed schedule.",
    latestMeta: "DK · 02/03/2026",
    reference: "Book Adj / 17000 - Other assets",
    status: "Closed",
    createdBy: "MJ",
    createdAt: "02/02/2026",
    assignedTo: "DK",
    clientId: 4,
  },
  {
    id: "rn4",
    source: "Workpaper",
    description: "Management fee accrual month does not match support.",
    latestResponse: "Accrual month corrected in workpaper.",
    latestMeta: "PP · 02/05/2026",
    reference: "Temp. Adj / 11020 - Accounts receivable",
    status: "Open",
    createdBy: "SC",
    createdAt: "02/05/2026",
    assignedTo: "PP",
    clientId: 3,
  },
  {
    id: "rn5",
    source: "Workpaper",
    description: "EL dependency unresolved; return cannot move forward.",
    latestResponse: "",
    latestMeta: "",
    reference: "EL / 10004 - Sign engagement letter",
    status: "Open",
    createdBy: "SC",
    createdAt: "02/08/2026",
    assignedTo: "MJ",
    clientId: 4,
  },
  {
    id: "rn6",
    source: "Workpaper",
    description: "Entity ownership support is still missing.",
    latestResponse: "Client asked for extension to provide support.",
    latestMeta: "PP · 02/09/2026",
    reference: "Ownership / 1120 - Supporting docs",
    status: "Open",
    createdBy: "PP",
    createdAt: "02/08/2026",
    assignedTo: "DK",
    clientId: 4,
  },
];
