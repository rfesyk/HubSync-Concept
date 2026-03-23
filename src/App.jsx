import { useState, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────
const S = {
  HOME: "home",
  CLIENTS: "clients",
  CLIENT_DETAIL: "client_detail",
  MESSAGING: "messaging",
  CHAT_TOPICS: "chat_topics",
  CHAT: "chat",
  DOCUMENTS: "dms",
  DMS_FILE: "dms_file",
  METRICS: "metrics",
  // Feature screens
  EL_STATUS: "el_status",
  EL_WIZARD: "el_wizard",
  SETTINGS: "settings",
  MY_SIGNATURES: "my_signatures",
  SIGN_DOC: "sign_doc",
  FORM_8879: "form_8879",
  BATCH_EXT: "batch_ext",
  BATCH_EXT_STATUS: "batch_ext_status",
  AUDIT_LOG: "audit_log",
};

const TAB = { HOME: "home", CLIENTS: "clients", MESSAGING: "messaging", DOCUMENTS: "dms" };

// ─── Mock Data ────────────────────────────────────────────────────
const clients = [
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

const signatures = [
  { id:1, client:"John Doe",      doc:"Tax Compliance Services EL",  type:"EL",   days:3 },
  { id:2, client:"Tiffany Trust", doc:"8879 e-file Authorization",   type:"8879", days:1 },
  { id:3, client:"Drake Maye",    doc:"Engagement Letter 2024",      type:"EL",   days:7 },
];

const forms8879 = [
  { id:1, client:"John Doe",      status:"pending",  sent:"Dec 14", jurisdiction:"Federal + PA" },
  { id:2, client:"Sarah Connor",  status:"signed",   sent:"Dec 12", jurisdiction:"Federal" },
  { id:3, client:"Tiffany Trust", status:"pending",  sent:"Dec 15", jurisdiction:"Federal + NY + CA" },
  { id:4, client:"Drake Maye",    status:"failed",   sent:"Dec 10", jurisdiction:"Federal" },
];

const extensions = [
  { id:1, client:"Umbrella Corp", jurisdiction:"Federal",  status:"filed",    deadline:"Apr 15" },
  { id:2, client:"Umbrella Corp", jurisdiction:"PA",       status:"filed",    deadline:"Apr 15" },
  { id:3, client:"XYZ Company",   jurisdiction:"Federal",  status:"pending",  deadline:"Apr 15" },
  { id:4, client:"XYZ Company",   jurisdiction:"NY",       status:"rejected", deadline:"Apr 15" },
  { id:5, client:"Drake Maye",    jurisdiction:"Federal",  status:"pending",  deadline:"Apr 15" },
];

const chats = [
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
  { id:4, name:"Partnership Mgmt", type:"Internal", online:true, unread:3, last:"Q4 targets review needed", time:"9:00",
    topics:[
      { id:"t1", label:"General", icon:"💬", unread:3, lastMsg:"Q4 targets review needed", time:"9:00",
        msgs:[{ id:1, from:"cpa", text:"Team, Q4 targets review needed before EOD", time:"9:00" }]},
    ]},
];

const docs = [
  { id:1, name:"Tax Compliance Services — John Doe.pdf",        client:"John Doe",      type:"EL",     size:"2.4 MB", date:"Dec 18", status:"signed",  ext:"pdf"  },
  { id:2, name:"8879 e-file Authorization — Tiffany Trust.pdf", client:"Tiffany Trust", type:"8879",   size:"0.8 MB", date:"Dec 17", status:"pending", ext:"pdf"  },
  { id:3, name:"W-2 Workbook Testing Company.pdf",              client:"John Doe",      type:"Doc",    size:"1.1 MB", date:"Dec 17", status:null,      ext:"pdf"  },
  { id:4, name:"2024 1040 Tax Return — Sarah Connor.pdf",       client:"Sarah Connor",  type:"Return", size:"5.2 MB", date:"Dec 16", status:null,      ext:"pdf"  },
  { id:5, name:"Engagement Letter — XYZ Company.docx",          client:"XYZ Company",   type:"EL",     size:"0.3 MB", date:"Dec 15", status:"sent",    ext:"docx" },
  { id:6, name:"Balance Sheet — Umbrella Corp.xlsx",            client:"Umbrella Corp", type:"PBC",    size:"1.8 MB", date:"Dec 13", status:null,      ext:"xlsx" },
];

const stepLabels = ["Sign EL","Request List","Upload Docs","Tax Organizer","Review Return","Sign Return","Payments"];

const auditLog = [
  { id:1, action:"Document uploaded", detail:"W-2 Workbook.pdf", who:"Client", time:"10:24 today" },
  { id:2, action:"Reminder sent",     detail:"Upload documents reminder", who:"CPA", time:"9:00 today" },
  { id:3, action:"Step advanced",     detail:"Step 2 → Step 3", who:"System", time:"Dec 17" },
  { id:4, action:"EL signed",         detail:"Engagement Letter 2024", who:"Client", time:"Dec 15" },
  { id:5, action:"8879 sent",         detail:"Federal + PA", who:"CPA", time:"Dec 14" },
];

// ─── Helpers ──────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = { "1040":["#555555","#e8e8e8"], "1041":["#555555","#ebebeb"], Entity:["#4a4a4a","#e8e8e8"], Internal:["#777777","#f2f2f2"] };
  const [c, bg] = map[type] || ["#777777","#f2f2f2"];
  return <span style={{ fontSize:9, fontWeight:700, color:c, background:bg, borderRadius:4, padding:"2px 6px", letterSpacing:0.3 }}>{type}</span>;
};

const RiskDot = ({ risk }) => {
  const c = { high:"#555555", med:"#666666", low:"#8a8a8a" }[risk] || "#999999";
  return <div style={{ width:8, height:8, borderRadius:99, background:c, flexShrink:0 }} title={risk} />;
};

const StepBar = ({ step, total }) => (
  <div style={{ display:"flex", gap:2 }}>
    {Array.from({length:total}).map((_,i) => (
      <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i < step ? "#2d2d2d" : "#d8d8d8" }} />
    ))}
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    signed:   { bg:"#e8e8e8", c:"#4a4a4a", label:"Signed"   },
    pending:  { bg:"#ebebeb", c:"#555555", label:"Pending"  },
    sent:     { bg:"#e8e8e8", c:"#555555", label:"Sent"     },
    filed:    { bg:"#e8e8e8", c:"#4a4a4a", label:"Filed"    },
    rejected: { bg:"#ebebeb", c:"#444444", label:"Rejected" },
    failed:   { bg:"#ebebeb", c:"#444444", label:"Failed"   },
  };
  const s = map[status]; if (!s) return null;
  return <span style={{ fontSize:10, fontWeight:700, background:s.bg, color:s.c, borderRadius:4, padding:"2px 7px" }}>{s.label}</span>;
};

const Btn = ({ label, color="#2d2d2d", textColor="#fff", outline, onClick, full, small }) => (
  <button onClick={onClick} style={{
    border: outline ? `1.5px solid ${color}` : "none",
    background: outline ? "transparent" : color,
    color: outline ? color : textColor,
    borderRadius:10, padding: small ? "6px 12px" : "11px 16px",
    fontWeight:700, fontSize: small ? 11 : 13,
    cursor:"pointer", width: full ? "100%" : "auto",
    whiteSpace:"nowrap",
  }}>{label}</button>
);

// ─── Header ───────────────────────────────────────────────────────
const Header = ({ title, sub, back, onBack, right, search, onSearch, searchPh }) => (
  <div style={{ background:"#2d2d2d", flexShrink:0 }}>
    <div style={{ padding:"12px 18px 10px", display:"flex", alignItems:"center", gap:10 }}>
      {back && (
        <button onClick={onBack} style={{ border:"none", background:"rgba(255,255,255,0.15)", width:30, height:30, borderRadius:99, cursor:"pointer", color:"#fff", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
      )}
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:17, color:"#fff", lineHeight:1.2 }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:"#b0b0b0", marginTop:1 }}>{sub}</div>}
      </div>
      {right}
    </div>
    {search !== undefined && (
      <div style={{ margin:"0 18px 14px", background:"rgba(255,255,255,0.12)", borderRadius:9, display:"flex", alignItems:"center", padding:"7px 12px", gap:7 }}>
        <span style={{ color:"#b0b0b0", fontSize:12 }}>🔍</span>
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={searchPh||"Search..."} style={{ background:"none", border:"none", outline:"none", color:"#fff", fontSize:13, flex:1 }} />
      </div>
    )}
  </div>
);

// ─── Bottom Nav ───────────────────────────────────────────────────
const BottomNav = ({ tab, setTab, totalUnread }) => {
  const tabs = [
    { id:TAB.HOME,      icon:"home", label:"Home"      },
    { id:TAB.CLIENTS,   icon:"clients", label:"Clients"   },
    { id:TAB.MESSAGING, icon:"messages", label:"Messages", badge: totalUnread },
    { id:TAB.DOCUMENTS, icon:"documents", label:"Documents" },
  ];
  const NavIcon = ({ name, active }) => {
    const color = active ? "#1a1a1a" : "#888888";
    const common = { width:18, height:18, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:1.8, strokeLinecap:"round", strokeLinejoin:"round" };
    if (name === "home") {
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    }
    if (name === "clients") {
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c0-3.3 3.2-5.2 5.5-5.2s5.5 1.9 5.5 5.2" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M14.5 19c.2-2 1.8-3.4 3.8-3.4 1 0 2 .4 2.7 1.1" />
        </svg>
      );
    }
    if (name === "messages") {
      return (
        <svg {...common}>
          <path d="M4 5h16a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4v-4H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />
        </svg>
      );
    }
    return (
      <svg {...common}>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v4h4" />
        <path d="M8.5 12h7" />
        <path d="M8.5 16h7" />
      </svg>
    );
  };
  return (
    <div style={{
      position:"absolute", bottom:16, left:17, right:17,
      display:"flex",
      gap:0,
      background:"rgba(255,255,255,0.45)",
      backdropFilter:"blur(20px)",
      WebkitBackdropFilter:"blur(20px)",
      borderRadius:20,
      border:"1px solid rgba(255,255,255,0.7)",
      boxShadow:"0 8px 32px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset",
      padding:"2px 0",
      zIndex:50,
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, border:"none", background:"none", cursor:"pointer",
            padding:"9px 0 7px", display:"flex", flexDirection:"column",
            alignItems:"center", gap:3, position:"relative", borderRadius:20,
          }}>
            {/* Active pill bg */}
            {active && (
              <div style={{
                position:"absolute", inset:"2px 6px",
                background:"rgba(255,255,255,0.7)",
                borderRadius:16,
                boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                border:"1px solid rgba(255,255,255,0.9)",
              }} />
            )}
            <span style={{ position:"relative", zIndex:1, lineHeight:1 }}><NavIcon name={t.icon} active={active} /></span>
            <span style={{ fontSize:10, fontWeight: active ? 700 : 400, color: active ? "#1a1a1a" : "#888888", position:"relative", zIndex:1 }}>{t.label}</span>
            {t.badge > 0 && (
              <div style={{
                position:"absolute", top:2, right:"50%", transform:"translateX(12px)",
                background:"#3a3a3a", color:"#fff", borderRadius:99,
                fontSize:9, fontWeight:700, minWidth:15, height:15,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 3px", zIndex:2,
                boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
              }}>{t.badge}</div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]   = useState(TAB.HOME);
  const [screen, setScreen] = useState(S.HOME);
  const [ctx, setCtx]   = useState({});
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [signed, setSigned]     = useState([]);
  const [reminded, setReminded] = useState([]);
  const [chatMsgs, setChatMsgs] = useState(() => {
    const map = {};
    chats.forEach(c => c.topics.forEach(t => { map[`${c.id}_${t.id}`] = t.msgs; }));
    return map;
  });
  const [chatUnread, setChatUnread] = useState(Object.fromEntries(chats.map(c => [c.id, c.unread])));
  const [toast, setToast] = useState(null);

  const [pendingResolve, setPendingResolve] = useState([]);

  const totalUnread = Object.values(chatUnread).reduce((a,b) => a+b, 0);

  const go = (s, data={}) => { setCtx(data); setScreen(s); };
  const goTab = (t) => {
    setTab(t);
    const map = { [TAB.HOME]:S.HOME, [TAB.CLIENTS]:S.CLIENTS, [TAB.MESSAGING]:S.MESSAGING, [TAB.DOCUMENTS]:S.DOCUMENTS };
    setScreen(map[t]);
  };

  // Called from HomeScreen when CPA taps a CTA — marks item as "resolved when returning"
  const resolveOnReturn = (itemId, navFn) => {
    setPendingResolve(p => [...p, itemId]);
    navFn();
  };
  const clearPendingResolve = (ids) => {
    setPendingResolve(p => p.filter(x => !ids.includes(x)));
  };

  const remind = (id, toastCfg) => {
    setReminded(p => (p.includes(id) ? p : [...p, id]));
    if (toastCfg === null) return;
    if (toastCfg) showToast(toastCfg);
    else showToast("Reminder sent ✓");
  };
  const undoRemind = (id) => setReminded(p => p.filter(x => x !== id));
  const sign   = (id) => { setSigned(p => [...p, id]);   showToast("Document signed ✓"); };
  const showToast = (input) => {
    if (!input) { setToast(null); return; }
    const t = typeof input === "string" ? { msg: input, auto: true } : input;
    setToast(t);
    if (t.auto !== false && !t.actions?.length) {
      setTimeout(() => setToast(null), 2000);
    }
  };
  const hideToast = () => setToast(null);
  const sendMsg = (key, text) => {
    const msg = { id:Date.now(), from:"cpa", text, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    setChatMsgs(p => ({ ...p, [key]: [...(p[key]||[]), msg] }));
  };
  const openChat = (chat) => {
    if (chat.topics && chat.topics.length > 1) {
      go(S.CHAT_TOPICS, { chat });
    } else {
      const topic = chat.topics?.[0];
      go(S.CHAT, { chat, topic });
    }
    setChatUnread(p => ({ ...p, [chat.id]: 0 }));
  };
  const openTopic = (chat, topic) => { go(S.CHAT, { chat, topic }); };

  const screenProps = { go, goTab, clients, signatures, forms8879, extensions, chats, docs, auditLog, signed, reminded, remind, undoRemind, sign, chatMsgs, chatUnread, openChat, openTopic, sendMsg, ctx, pendingResolve, resolveOnReturn, clearPendingResolve, showToast, hideToast, setOverlayOpen };

  return (
    <div style={{ minHeight:"100vh", background:"#c0c0c0", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width:375, height:780, background:"#f0f0f0", borderRadius:40, boxShadow:"0 32px 80px rgba(0,0,0,0.25)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes signLand{0%{transform:translateY(-8px) scale(0.96);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}@keyframes metricPop{0%{transform:scale(1.08);opacity:.6}100%{transform:scale(1);opacity:1}}`}</style>

        {/* Status bar */}
        <div style={{ background:"#2d2d2d", padding:"10px 22px 6px", display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>9:41</span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <span style={{ color:"#b0b0b0", fontSize:10 }}>●●●</span>
            <div style={{ width:16, height:8, border:"1.5px solid #fff", borderRadius:2, position:"relative", marginLeft:4 }}>
              <div style={{ position:"absolute", left:1, top:1, bottom:1, width:"70%", background:"#fff", borderRadius:1 }} />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", paddingBottom: [S.HOME, S.CLIENTS, S.MESSAGING, S.DOCUMENTS].includes(screen) ? 80 : 0 }}>
          {screen === S.HOME              && <HomeScreen        {...screenProps} />}
          {screen === S.CLIENTS           && <ClientsScreen     {...screenProps} />}
          {screen === S.CLIENT_DETAIL     && <ClientDetailScreen {...screenProps} chats={chats} />}
          {screen === S.MESSAGING         && <MessagingScreen   {...screenProps} />}
          {screen === S.CHAT_TOPICS       && <ChatTopicsScreen  {...screenProps} />}
          {screen === S.CHAT              && <ChatScreen        {...screenProps} />}
          {screen === S.DOCUMENTS               && <DMSScreen         {...screenProps} />}
          {screen === S.DMS_FILE          && <DMSFileScreen     {...screenProps} />}
          {screen === S.EL_STATUS         && <ELStatusScreen    {...screenProps} />}
          {screen === S.EL_WIZARD         && <ELWizardScreen    {...screenProps} />}
          {screen === S.MY_SIGNATURES     && <MySignaturesScreen {...screenProps} />}
          {screen === S.SIGN_DOC          && <SignDocScreen     {...screenProps} />}
          {screen === S.FORM_8879         && <Form8879Screen    {...screenProps} />}
          {screen === S.BATCH_EXT         && <BatchExtScreen    {...screenProps} />}
          {screen === S.BATCH_EXT_STATUS  && <BatchExtStatusScreen {...screenProps} />}
          {screen === S.METRICS            && <MetricsScreen      {...screenProps} />}
          {screen === S.SETTINGS           && <SettingsScreen     {...screenProps} />}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position:"absolute", bottom:80, left:20, right:20, background:"#4a4a4a", color:"#fff", borderRadius:12, padding:"11px 16px", fontSize:13, fontWeight:600, textAlign:"center", boxShadow:"0 4px 20px rgba(5,150,105,0.4)", zIndex:100 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <span>{typeof toast === "string" ? toast : toast.msg}</span>
              {toast.actions?.length > 0 && (
                <div style={{ display:"flex", gap:6 }}>
                  {toast.actions.map((a,i) => (
                    <button
                      key={i}
                      onClick={a.onClick}
                      style={{
                        border:"1px solid rgba(255,255,255,0.35)",
                        background:"rgba(255,255,255,0.08)",
                        color:"#fff",
                        borderRadius:8,
                        padding:"3px 8px",
                        fontSize:11,
                        fontWeight:600,
                        cursor:"pointer",
                      }}
                    >{a.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nav — only on top-level tab screens */}
        {[S.HOME, S.CLIENTS, S.MESSAGING, S.DOCUMENTS].includes(screen) && !overlayOpen && (
          <BottomNav tab={tab} setTab={goTab} totalUnread={totalUnread} />
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════════════════════════════
function HomeScreen({ go, clients, signatures, forms8879, extensions, reminded, remind, undoRemind, showToast, hideToast, setOverlayOpen, signed }) {
  const [workScope, setWorkScope] = useState("my"); // "my" | "all" | "favorites"
  const [workScopeSheetOpen, setWorkScopeSheetOpen] = useState(false);
  const [cardExiting, setCardExiting] = useState(false);
  const [exitDir, setExitDir]       = useState(null); // "skip" | "action"
  const [remindSheet, setRemindSheet] = useState(null);
  const [remindReason, setRemindReason] = useState("Missing documents");
  const [remindCustom, setRemindCustom] = useState("");
  const [refileSheet, setRefileSheet] = useState(null);
  const [refileFileSheet, setRefileFileSheet] = useState(false);
  const [refileSubmitting, setRefileSubmitting] = useState(false);
  const [eSignSheet, setESignSheet] = useState(null);
  const [eSignSubmitting, setESignSubmitting] = useState(false);
  const [eSignDocOpen, setESignDocOpen] = useState(false);
  const [eSignStep, setESignStep] = useState(1);
  const [eSignSigned, setESignSigned] = useState({ first:false, second:false });
  const [awaitingCount, setAwaitingCount] = useState(0);
  const [queueKeys, setQueueKeys] = useState([]);
  const [queueInitialized, setQueueInitialized] = useState(false);
  const eSignSecondRef = useRef(null);

  const buildFocusCards = () => {
    const allCards = [];
    clients
      .filter(c => c.blockedBy === "client")
      .map(c => {
        const sig  = signatures.find(s => s.client === c.name);
        const f8   = forms8879.find(f => f.client === c.name && f.status === "pending");
        const isEL = c.elStatus !== "signed";
        const what = isEL ? "EL not signed"
                   : f8  ? "8879 awaiting client"
                   : sig ? "Signature pending"
                   : c.stepLabel;
        const context = isEL
          ? "Engagement letter hasn't been signed. Tax prep can't start until the client completes this."
          : f8  ? "Client hasn't signed the 8879 e-file authorization. E-file is on hold until they do."
          : sig ? "Client signature is pending on a document. The return can't move forward until resolved."
          : `Client action needed at the "${c.stepLabel}" step. Return is blocked.`;
        const days = sig ? sig.days : f8 ? 3 : 2;
        const critical = days >= 7;
        return {
          key: `c-${c.id}`, client: c.name, clientObj: c,
          what, context, days, tag: "CLIENT", urgent: critical, critical,
        cta:   isEL ? "Send EL"  : "Send reminder",
          ctaFn: isEL ? () => go(S.EL_WIZARD, { preClient:c }) : () => go(S.CLIENT_DETAIL, { client:c, from:S.HOME }),
        };
      })
      .sort((a,b) => b.days - a.days)
      .forEach(r => allCards.push(r));

    forms8879.filter(f => f.status === "failed").forEach(f => {
      const cl = clients.find(c => c.name === f.client);
      allCards.push({
        key: `kba-${f.id}`, client: f.client, clientObj: cl,
        what: "E‑signature needed",
        context: `Client must sign Form 8879 to authorize IRS e‑file for ${f.jurisdiction}. Send the e‑signature to continue.`,
        days: null, tag: "IRS", urgent: true, critical: true, form: f,
        cta: "Sign", ctaFn: () => cl ? go(S.CLIENT_DETAIL, { client: cl, from:S.HOME }) : go(S.FORM_8879),
      });
    });
    extensions.filter(e => e.status === "rejected").forEach(e => {
      const cl = clients.find(c => c.name === e.client);
      allCards.push({
        key: `ext-${e.id}`, client: e.client, clientObj: cl,
        what: "Extension rejected",
        context: `Extension was rejected by IRS for ${e.jurisdiction}. Must be refiled before the ${e.deadline} deadline.`,
        days: null, tag: "IRS", urgent: true, critical: true, ext: e,
        cta: "Refile", ctaFn: () => cl ? go(S.CLIENT_DETAIL, { client: cl, from:S.HOME }) : go(S.BATCH_EXT_STATUS),
      });
    });

    allCards.sort((a,b) => {
      if (a.critical && !b.critical) return -1;
      if (!a.critical && b.critical) return 1;
      return (b.days||99) - (a.days||99);
    });

    return allCards;
  };

  const advanceCard = (dir, fn, markResolved=false) => {
    if (markResolved) setAwaitingCount(a => a + 1);
    setExitDir(dir);
    setCardExiting(true);
    if (fn) fn();
    setTimeout(() => {
      setCardExiting(false);
      setExitDir(null);
      setQueueKeys(q => {
        if (q.length === 0) return q;
        if (markResolved) return q.slice(1);
        if (q.length === 1) return q;
        return [...q.slice(1), q[0]];
      });
    }, 260);
  };

  const buildRemindReasons = (card, client) => {
    const what = (card?.what || "").toLowerCase();
    const step = (client?.stepLabel || "").toLowerCase();
    if (what.includes("signature") || step.includes("sign")) {
      return ["Signature pending", "Please sign today", "Consent needed to proceed", "Custom"];
    }
    if (what.includes("organizer") || step.includes("organizer")) {
      return ["Organizer incomplete", "Missing organizer details", "Need clarification", "Custom"];
    }
    if (what.includes("upload") || what.includes("document") || step.includes("upload") || step.includes("doc")) {
      return ["Missing documents", "Upload requested docs", "Need W‑2/1099", "Custom"];
    }
    if (what.includes("payment")) {
      return ["Payment pending", "Invoice due", "Payment confirmation needed", "Custom"];
    }
    return ["Waiting on client", "Confirmation needed", "Action required", "Custom"];
  };

  const getRejectInfo = (ext) => {
    if (!ext) return { code:"EXT-400", reason:"Validation error" };
    const map = {
      Federal: { code:"IND-901", reason:"Name/ID mismatch" },
      NY:      { code:"NY-108",  reason:"State ID mismatch" },
      PA:      { code:"PA-204",  reason:"Duplicate filing" },
    };
    return map[ext.jurisdiction] || { code:"EXT-400", reason:"Validation error" };
  };

  const getRefileDoc = (ext, client) => {
    if (!ext || !client) return null;
    return {
      name: `Extension_${client.name.replace(/\s+/g,"_")}_${ext.jurisdiction}.pdf`,
      size: "128 KB",
      date: "Today",
    };
  };

  const openRemindSheet = (card, client) => {
    const opts = buildRemindReasons(card, client);
    setRemindReason(opts[0]);
    setRemindCustom("");
    setRemindSheet({ card, client });
    setOverlayOpen(true);
  };

  const openRefileSheet = (card, client) => {
    setRefileSheet({ card, client, ext: card.ext });
    setRefileSubmitting(false);
    setRefileFileSheet(false);
    setOverlayOpen(true);
  };

  const openESignSheet = (card, client) => {
    setESignSubmitting(false);
    setESignDocOpen(false);
    setESignStep(1);
    setESignSigned({ first:false, second:false });
    setESignSheet({ card, client, form: card.form });
    setOverlayOpen(true);
  };

  const handleRefileAction = (label, toastMsg) => {
    setRefileSheet(null);
    setOverlayOpen(false);
    advanceCard("skip", () => {
      showToast({
        msg: toastMsg,
        auto: false,
        actions: [
          { label:"Cancel", onClick: () => showToast("Action canceled") },
          { label:"Close", onClick: hideToast },
        ],
      });
    });
  };

  const openESignDoc = () => {
    setESignStep(1);
    setESignSigned({ first:false, second:false });
    setESignDocOpen(true);
  };

  const handleESignFirst = () => {
    if (eSignStep !== 1) return;
    setESignSigned(p => ({ ...p, first:true }));
    setESignStep(2);
    setTimeout(() => {
      eSignSecondRef.current?.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 100);
  };

  const handleESignSecond = () => {
    if (eSignStep < 2) return;
    setESignSigned(p => ({ ...p, second:true }));
    setESignStep(3);
    // finish -> return to sheet with loader
    setTimeout(() => {
      setESignDocOpen(false);
      setESignSubmitting(true);
      setTimeout(() => {
        setESignSubmitting(false);
        setESignSheet(null);
        setOverlayOpen(false);
        advanceCard("action", () => showToast("E‑signature completed"), true);
      }, 2000);
    }, 400);
  };

  const openRefileFileSheet = () => {
    setRefileFileSheet(true);
    setOverlayOpen(true);
  };

  const handleRefileFileSelect = () => {
    setRefileFileSheet(false);
    setRefileSubmitting(true);
    setTimeout(() => {
      setRefileSubmitting(false);
      setRefileSheet(null);
      setOverlayOpen(false);
      advanceCard("skip", () => showToast("Extension resubmitted"), true);
    }, 2000);
  };

  const sendReminder = () => {
    if (!remindSheet?.client) return;
    const c = remindSheet.client;
    const reasonText = remindReason === "Custom" ? (remindCustom.trim() || "Custom") : remindReason;
    setRemindSheet(null);
    setOverlayOpen(false);
    advanceCard("skip", () => {
      remind(c.id, {
        msg: `Reminder sent · ${reasonText}`,
        auto: false,
        actions: [
          {
            label: "Cancel",
            onClick: () => {
              undoRemind(c.id);
              showToast("Reminder canceled");
            },
          },
          { label: "Close", onClick: hideToast },
        ],
      });
    }, true);
  };

  const openWorkScopeSheet = () => {
    setWorkScopeSheetOpen(true);
    setOverlayOpen(true);
  };

  const closeWorkScopeSheet = () => {
    setWorkScopeSheetOpen(false);
    setOverlayOpen(false);
  };

  const allCards = buildFocusCards();
  const cardMap = Object.fromEntries(allCards.map(c => [c.key, c]));
  useEffect(() => {
    if (!queueInitialized && allCards.length > 0) {
      setQueueKeys(allCards.map(c => c.key));
      setQueueInitialized(true);
    }
  }, [allCards.length, queueInitialized]);
  const remainingCards = queueKeys.map(k => cardMap[k]).filter(Boolean);
  const blockersCount = remainingCards.length;
  const criticalCount = remainingCards.filter(c => c.critical).length;

  const [metricHide, setMetricHide] = useState({ blockers:blockersCount===0, critical:criticalCount===0 });
  const [metricClosing, setMetricClosing] = useState({ blockers:false, critical:false });

  useEffect(() => {
    if (blockersCount === 0 && !metricHide.blockers && !metricClosing.blockers) {
      setMetricClosing(v => ({ ...v, blockers:true }));
      setTimeout(() => {
        setMetricHide(v => ({ ...v, blockers:true }));
        setMetricClosing(v => ({ ...v, blockers:false }));
      }, 220);
    } else if (blockersCount > 0 && metricHide.blockers) {
      setMetricHide(v => ({ ...v, blockers:false }));
    }
  }, [blockersCount, metricHide.blockers, metricClosing.blockers]);

  useEffect(() => {
    if (criticalCount === 0 && !metricHide.critical && !metricClosing.critical) {
      setMetricClosing(v => ({ ...v, critical:true }));
      setTimeout(() => {
        setMetricHide(v => ({ ...v, critical:true }));
        setMetricClosing(v => ({ ...v, critical:false }));
      }, 220);
    } else if (criticalCount > 0 && metricHide.critical) {
      setMetricHide(v => ({ ...v, critical:false }));
    }
  }, [criticalCount, metricHide.critical, metricClosing.critical]);

  return (
    <div style={{ flex:1 }}>
      {/* Dark header — title + metrics */}
      <div style={{ background:"#2d2d2d", padding:"10px 18px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button
            onClick={openWorkScopeSheet}
            style={{
              border:"none",
              background:"transparent",
              color:"#fff",
              fontSize:20,
              fontWeight:700,
              display:"inline-flex",
              alignItems:"center",
              gap:7,
              padding:0,
              cursor:"pointer",
            }}
          >
            {workScope === "my" ? "My work" : workScope === "all" ? "All work" : "Favorites"}
            <span style={{ fontSize:13, color:"#cfcfcf", lineHeight:1 }}>▾</span>
          </button>
          <button onClick={() => go(S.SETTINGS)} style={{ border:"none", background:"transparent", width:32, height:32, borderRadius:99, cursor:"pointer", color:"#d0d0d0", fontSize:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>⚙</button>
        </div>

        <div style={{ padding:"0 0 0" }}>
          {/* ── FOCUS QUEUE — card-by-card attention mechanic ── */}
          {(() => {
            const remaining = remainingCards;
            const tagStyle = {
              Blocker: { bg:"#fff4d6", c:"#b8860b" },
              Critical: { bg:"#fdecea", c:"#b05a54" },
            };

            return (
              <div style={{ marginTop:14 }}>
                {/* Slim metrics tags */}
                {(() => {
                  const items = [
                    { id:"awaiting", label:"Awaiting", value:awaitingCount, bg:"rgba(255,255,255,0.08)", c:"#ffffff", static:true },
                    { id:"blockers", label:"Blockers", value:blockersCount, bg:"rgba(255,215,102,0.18)", c:"#ffe38b" },
                    { id:"critical", label:"Critical", value:criticalCount, bg:"rgba(255,105,97,0.18)", c:"#ffb9b4" },
                  ].filter(m => m.static || !metricHide[m.id] || metricClosing[m.id]);

                  if (items.length === 0) return null;

                  return (
                    <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                      {items.map(m => {
                        const collapsing = !m.static && metricClosing[m.id] && m.value === 0;
                        return (
                          <div
                            key={m.id}
                            style={{
                              flex: collapsing ? "0 0 0" : "1 1 0",
                              maxWidth: collapsing ? 0 : "100%",
                              opacity: collapsing ? 0 : 1,
                              transform: collapsing ? "scale(0.92)" : "scale(1)",
                              padding: collapsing ? "0" : "6px 10px",
                              borderRadius:999,
                              background: collapsing ? "transparent" : m.bg,
                              border: collapsing ? "0" : "1px solid rgba(255,255,255,0.08)",
                              display:"inline-flex",
                              alignItems:"center",
                              justifyContent:"center",
                              gap:6,
                              overflow:"hidden",
                              transition:"all 0.25s ease",
                            }}
                          >
                            <span key={`${m.id}-${m.value}`} style={{ fontSize:13, fontWeight:700, color: m.value > 0 ? m.c : "rgba(255,255,255,0.35)", lineHeight:1, animation:"metricPop 0.25s ease" }}>{m.value}</span>
                            <span style={{ fontSize:9, letterSpacing:0.6, textTransform:"uppercase", color:"rgba(255,255,255,0.65)", lineHeight:1 }}>{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              {remaining.length === 0 ? (
                /* Empty state */
                <div style={{ background:"#fff", border:"1px solid #e8e8e8", borderRadius:18, padding:"32px 20px", textAlign:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:99, background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", fontSize:20 }}>✓</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:5 }}>You're all caught up</div>
                  <div style={{ fontSize:12, color:"#aaaaaa", lineHeight:1.5 }}>No items need attention right now</div>
                </div>
              ) : (() => {
                const card  = remaining[0];
                const c     = card.clientObj;
                const peek1 = remaining[1];
                const peek2 = remaining[2];
                const exitTransform = cardExiting
                  ? exitDir === "action"
                    ? "translateX(108%) rotate(7deg)"
                    : "translateX(-108%) rotate(-7deg)"
                  : "none";

                return (
                  <div style={{ position:"relative", paddingTop:12 }}>

                    {/* Peek card 3 — furthest back */}
                    {peek2 && (
                      <div style={{
                        position:"absolute", left:18, right:18, top:4,
                        height:24, background:"#d4d4d4", borderRadius:18, zIndex:1,
                      }} />
                    )}

                    {/* Peek card 2 */}
                    {peek1 && (
                      <div style={{
                        position:"absolute", left:9, right:9, top:0,
                        height:28, background:"#e4e4e4", borderRadius:18, zIndex:2,
                      }} />
                    )}

                    {/* Main card */}
                    <div style={{
                      position:"relative", zIndex:3,
                      background:"#fff",
                      border:"1px solid #e0e0e0",
                      borderRadius:18,
                      boxShadow:"0 4px 24px rgba(0,0,0,0.09)",
                      overflow:"hidden",
                      transform: exitTransform,
                      transition: cardExiting ? "transform 0.26s cubic-bezier(0.4,0,1,1), opacity 0.26s" : "none",
                      opacity: cardExiting ? 0 : 1,
                      willChange: "transform",
                    }}>

                      {/* Task + client header */}
                      <div style={{ padding:"14px 16px 12px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                          <div style={{ fontSize:15, fontWeight:700, color:"#1a1a1a", lineHeight:1.2 }}>{card.what}</div>
                          {(() => {
                            const tagLabel = card.critical ? "Critical" : "Blocker";
                            const ts = tagStyle[tagLabel];
                            return (
                              <span style={{ fontSize:9, fontWeight:700, background:ts.bg, color:ts.c, borderRadius:6, padding:"3px 9px", letterSpacing:0.5, flexShrink:0 }}>
                                {tagLabel}
                              </span>
                            );
                          })()}
                        </div>
                        <div style={{ fontSize:12, color:"#777777", lineHeight:1.6 }}>{card.context}</div>
                      </div>

                      {/* Workflow progress */}
                      {c && (
                        <div style={{ padding:"10px 16px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:11, color:"#777777" }}>{c.stepLabel}</span>
                            <span style={{ fontSize:11, color:"#bbbbbb" }}>Step {c.step} of {c.steps}</span>
                          </div>
                          <StepBar step={c.step} total={c.steps} />
                          <div style={{ height:1, background:"#f0f0f0", marginTop:10 }} />
                          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
                            <div style={{ width:36, height:36, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:15, flexShrink:0 }}>
                              {card.client[0]}
                            </div>
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", lineHeight:1.2 }}>{card.client}</div>
                              <div style={{ fontSize:11, color:"#888888", marginTop:3 }}>{c.stepLabel}</div>
                              <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:3 }}>
                                {c && <TypeBadge type={c.type} />}
                                {c && <RiskDot risk={c.risk} />}
                              </div>
                            </div>
                          </div>
                          {card.days != null && (
                            <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6, background: card.days>=7 ? "#fff3f3" : "#fffbf0", borderRadius:8, padding:"5px 10px" }}>
                              <div style={{ width:6, height:6, borderRadius:99, background: card.days>=7 ? "#b05a54" : "#c8a200", flexShrink:0 }} />
                              <span style={{ fontSize:11, fontWeight:600, color: card.days>=7 ? "#b05a54" : "#c8a200" }}>
                                Waiting {card.days} day{card.days !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ padding:"0 14px 14px", display:"flex", gap:8 }}>
                        <button
                          onClick={() => advanceCard("skip")}
                          style={{ flex:1, border:"1.5px solid #e0e0e0", borderRadius:12, padding:"12px 0", background:"#fff", color:"#1a1a1a", fontWeight:600, fontSize:13, cursor:"pointer" }}
                        >Remind later</button>
                        <button
                          onClick={() => (
                            card.cta === "Send reminder" ? openRemindSheet(card, c)
                            : card.cta === "Refile" ? openRefileSheet(card, c)
                            : card.cta === "Sign" ? openESignSheet(card, c)
                            : advanceCard("action", card.ctaFn, true)
                          )}
                          style={{ flex:1, border:"none", borderRadius:12, padding:"12px 0", background:"#2d2d2d", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}
                        >{card.cta}</button>
                      </div>

                    </div>
                  </div>
                );
              })()}
              </div>
            );
          })()}
        </div>
      </div>

      <div style={{ padding:"8px 18px 20px" }}>

        {(() => {
          const stageCounts = stepLabels.map((label, i) =>
            clients.filter(c => c.step === i + 1).length
          );
          const maxCount = Math.max(...stageCounts, 1);
          const shortLabels = ["Sign EL","Req List","Upload","Organizer","Review","Sign Ret.","Payments"];
          const seasonStart = new Date(new Date().getFullYear(), 0, 1);
          const taxDeadline = new Date(new Date().getFullYear(), 3, 15);
          const now = new Date();
          const seasonProgress = Math.max(0, Math.min(1, (now - seasonStart) / Math.max(taxDeadline - seasonStart, 1)));
          const targetStep = Math.max(1, Math.min(stepLabels.length, Math.floor(seasonProgress * stepLabels.length) + 1));
          const currentAvgStep = clients.length
            ? clients.reduce((sum, c) => sum + c.step, 0) / clients.length
            : 1;
          const onTrack = currentAvgStep >= (targetStep - 0.5);
          return (
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#666666", letterSpacing:0.4, marginBottom:8 }}>Return Pipeline</div>
              <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:14, padding:"14px 12px 14px" }}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:15, fontWeight:800, color: onTrack ? "#2f6f3e" : "#8f3b3b", marginBottom:5 }}>
                    {onTrack ? "You're on track" : "You're slightly behind"}
                  </div>
                  <div style={{ fontSize:10.5, color:"#7f7f7f" }}>
                    Target step now: <strong style={{ color:"#555555", fontWeight:700 }}>{shortLabels[targetStep - 1]}</strong> · Clients currently average at step {currentAvgStep.toFixed(1)}
                  </div>
                </div>
                <div style={{ display:"flex", gap:0, alignItems:"flex-end", height:114 }}>
                  {stageCounts.map((count, i) => {
                    const h = count === 0 ? 36 : Math.max(36, Math.round((count / maxCount) * 100));
                    const isTarget = i + 1 === targetStep;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"0 3px" }}>
                        <div
                          style={{
                            width:"100%",
                            borderRadius:9,
                            background: isTarget ? "#e8f0ff" : (count>0?"#e8e8e8":"#f4f4f4"),
                            border: isTarget ? "1.5px solid #b9d1ff" : "1.5px solid transparent",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            height:h,
                            position:"relative",
                            transition:"height 0.3s",
                          }}
                        >
                          {isTarget && (
                            <span style={{ position:"absolute", top:-24, left:"50%", transform:"translateX(-50%)", fontSize:8, fontWeight:700, color:"#3b68b0", letterSpacing:0.3 }}>
                              Target
                            </span>
                          )}
                          <span style={{ fontSize: count>9?12:14, fontWeight:700, color: count>0?"#1a1a1a":"#d0d0d0" }}>{count}</span>
                        </div>
                        <span style={{ fontSize:8.5, color:"#777777", textAlign:"center", lineHeight:1.2, fontWeight:500, whiteSpace:"nowrap" }}>{shortLabels[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => go(S.CLIENTS)}
                  style={{ width:"100%", marginTop:14, border:"1.5px solid #d8d8d8", background:"#fff", color:"#555555", fontSize:13, fontWeight:700, padding:"12px 0", borderRadius:12, cursor:"pointer" }}
                >
                  {`Review clients (${clients.filter(c => c.step >= 3 && c.step < 7).length})`}
                </button>
              </div>
            </div>
          );
        })()}

        {/* SIGNATURES WIDGET */}
        {(() => {
          const pendingSignatures = signatures.filter(s => !signed.includes(s.id));
          const sigCompleted = signatures.filter(s => signed.includes(s.id)).length;
          const formPending = forms8879.filter(f => f.status === "pending").length;
          const formCompleted = forms8879.filter(f => f.status === "signed").length;
          const formFailed = forms8879.filter(f => f.status === "failed").length;
          const signingInProcess = pendingSignatures.length + formPending;
          const completed = sigCompleted + formCompleted;
          const cancelled = 0;
          const expired = 0;
          const declined = 0;
          const authFailed = formFailed;
          const allTotal = Math.max(signingInProcess + completed + cancelled + expired + declined + authFailed, 1);
          const totalToSign = signingInProcess + authFailed;
          const resolveCount = pendingSignatures.length;
          const metricDefs = [
            { key:"signing", label:"Signing in Process", value: signingInProcess, color:"#ec4899" },
            { key:"completed", label:"Completed", value: completed, color:"#9333ea" },
            { key:"cancelled", label:"Cancelled", value: cancelled, color:"#f4a257" },
            { key:"expired", label:"Expired", value: expired, color:"#b71c1c" },
            { key:"declined", label:"Declined", value: declined, color:"#f4a7b9" },
            { key:"auth", label:"Signer Authentication Failed", value: authFailed, color:"#10b981" },
          ];
          const pct = (v) => Math.max(0, Math.min(100, (v / allTotal) * 100));
          const primaryDefs = [
            metricDefs.find(m => m.key === "signing"),
            metricDefs.find(m => m.key === "completed"),
            metricDefs.find(m => m.key === "auth"),
          ].filter(Boolean);
          return (
            <div style={{ marginTop:22 }}>
              <div
                onClick={() => go(S.MY_SIGNATURES)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, cursor:"pointer" }}
              >
                <span style={{ fontSize:14, fontWeight:700, color:"#666666", letterSpacing:0.4 }}>My Signatures</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#666666" }}>
                  Open all
                  <span style={{ fontSize:13, lineHeight:1 }}>›</span>
                </span>
              </div>
              <div onClick={() => go(S.MY_SIGNATURES)} style={{ marginTop:6, background:"#fff", border:"1px solid #e4e4e4", borderRadius:14, padding:"14px 12px 12px", cursor:"pointer" }}>
                <div style={{ padding:"2px 2px 0", marginBottom:10 }}>
                  <div style={{ fontSize:11, color:"#8f8f8f", marginBottom:1 }}>Total signatures to sign</div>
                  <div style={{ fontSize:24, lineHeight:1.15, fontWeight:700, color:"#1f1f1f", marginBottom:10 }}>
                    {totalToSign}
                  </div>

                  <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                    {primaryDefs.map((m) => (
                      <div
                        key={`primary-${m.key}`}
                        style={{
                          width:`${pct(m.value)}%`,
                          minWidth:m.value > 0 ? 42 : 18,
                          height:20,
                          borderRadius:8,
                          background:m.color,
                          boxShadow:`0 0 0 1px ${m.color}33 inset, 0 4px 12px ${m.color}66`,
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #f2edf9", paddingBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:8, height:8, borderRadius:99, background:"#6b7280" }} />
                        <span style={{ fontSize:11, color:"#2f2f2f", fontWeight:600 }}>All</span>
                      </div>
                      <span style={{ fontSize:14, color:"#111827", fontWeight:700 }}>{allTotal}</span>
                    </div>
                    {metricDefs.map(m => (
                      <div key={m.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                          <div style={{ width:8, height:8, borderRadius:99, background:m.color, flexShrink:0 }} />
                          <span style={{ fontSize:11, color:"#3b3b3b", fontWeight:600 }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize:14, color:"#111827", fontWeight:700, marginLeft:8 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:8, marginTop:2 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(S.MY_SIGNATURES); }}
                    style={{
                      flex:1,
                      border:"1.5px solid #d8d8d8",
                      borderRadius:12,
                      padding:"13px 0",
                      background:"#fff",
                      color:"#555555",
                      fontWeight:700,
                      fontSize:15,
                      cursor:"pointer",
                    }}
                  >
                    {`Sign (${signingInProcess})`}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(S.MY_SIGNATURES); }}
                    style={{
                      flex:1,
                      border:"1.5px solid #d8d8d8",
                      borderRadius:12,
                      padding:"13px 0",
                      background:"#fff",
                      color:"#555555",
                      fontWeight:700,
                      fontSize:15,
                      cursor:"pointer",
                    }}
                  >
                    {`Resolve (${resolveCount})`}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── WIDGET 4 (was E-file) — merged into Needs Attention above ── */}

        {/* ENGAGEMENT LETTER WIDGET */}
        {(() => {
          const elSigned = clients.filter(c=>c.elStatus==="signed").length;
          const elTotal = clients.length;
          const myActions = clients.filter(c=>c.elStatus==="pending").length; // CPA needs to prepare/send
          const clientActions = clients.filter(c=>c.elStatus==="sent").length; // client needs to sign
          const pendingLetters = myActions + clientActions;
          const lettersToSend = 23;
          const allTotal = Math.max(elTotal, 1);
          const defs = [
            { key:"mine", label:"My actions", value:myActions, color:"#f2c94c" },
            { key:"client", label:"Client actions", value:clientActions, color:"#4fc3f7" },
            { key:"completed", label:"Completed", value:elSigned, color:"#4caf50" },
          ];
          const pct = (v) => Math.max(0, Math.min(100, (v / allTotal) * 100));
          return (
            <div style={{ marginTop:22 }}>
              <div
                onClick={() => go(S.EL_STATUS)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, cursor:"pointer" }}
              >
                <span style={{ fontSize:14, fontWeight:700, color:"#666666", letterSpacing:0.4 }}>Engagement Letter</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#666666" }}>
                  Open all
                  <span style={{ fontSize:13, lineHeight:1 }}>›</span>
                </span>
              </div>

              <div onClick={() => go(S.EL_STATUS)} style={{ marginTop:6, background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"14px 12px 12px", cursor:"pointer" }}>
                <div style={{ padding:"2px 2px 0", marginBottom:10 }}>
                  <div style={{ fontSize:11, color:"#8f8f8f", marginBottom:1 }}>Total pending letters</div>
                  <div style={{ fontSize:24, lineHeight:1.15, fontWeight:700, color:"#1f1f1f", marginBottom:10 }}>
                    {pendingLetters}
                  </div>

                  <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                    {defs.map((m) => (
                      <div
                        key={`el-${m.key}`}
                        style={{
                          width:`${pct(m.value)}%`,
                          minWidth:m.value > 0 ? 42 : 18,
                          height:20,
                          borderRadius:8,
                          background:m.color,
                          boxShadow:`0 0 0 1px ${m.color}33 inset, 0 4px 12px ${m.color}55`,
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #efefef", paddingBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:8, height:8, borderRadius:99, background:"#6b7280" }} />
                        <span style={{ fontSize:11, color:"#2f2f2f", fontWeight:600 }}>All</span>
                      </div>
                      <span style={{ fontSize:14, color:"#111827", fontWeight:700 }}>{elTotal}</span>
                    </div>
                    {defs.map(m => (
                      <div key={m.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                          <div style={{ width:8, height:8, borderRadius:99, background:m.color, flexShrink:0 }} />
                          <span style={{ fontSize:11, color:"#3b3b3b", fontWeight:600 }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize:14, color:"#111827", fontWeight:700, marginLeft:8 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:8, marginTop:2 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(S.EL_WIZARD); }}
                    style={{ flex:1, border:"none", background:"#2d2d2d", color:"#fff", fontSize:13, fontWeight:700, padding:"13px 0", borderRadius:12, cursor:"pointer" }}
                  >
                    {`Send letters (${lettersToSend})`}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); go(S.EL_STATUS); }}
                    style={{ flex:1, border:"1.5px solid #d8d8d8", background:"#fff", color:"#555555", fontSize:13, fontWeight:700, padding:"13px 0", borderRadius:12, cursor:"pointer" }}
                  >
                    {`Resolve (${clientActions})`}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* METRICS WIDGETS */}
        <div style={{ marginTop:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#666666", letterSpacing:0.4 }}>Metrics</div>
            <span onClick={() => go(S.METRICS)} style={{ fontSize:11, color:"#555555", fontWeight:600, cursor:"pointer" }}>See all →</span>
          </div>

          {/* Organizer Review widget */}
          {(() => {
            const MiniDonut = ({ segs, size=76, stroke=9, centerLabel, centerSub }) => {
              const r=(size-stroke)/2, circ=2*Math.PI*r;
              const total=segs.reduce((a,s)=>a+s.v,0)||1;
              let off=0;
              return (
                <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
                  <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute" }}>
                    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke} />
                    {segs.map((s,i)=>{
                      const dash=Math.max((s.v/total)*circ-1,0), gap=circ-dash;
                      const el=<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.c} strokeWidth={stroke} strokeDasharray={`${dash} ${gap+1}`} strokeDashoffset={-off} strokeLinecap="round"/>;
                      off+=(s.v/total)*circ; return el;
                    })}
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", lineHeight:1 }}>{centerLabel}</span>
                    {centerSub && <span style={{ fontSize:8, color:"#999999", marginTop:1 }}>{centerSub}</span>}
                  </div>
                </div>
              );
            };
            const orgSent = clients.filter(c=>c.step>=4).length;
            const orgNot  = clients.length - orgSent;
            return (
              <div style={{ marginBottom:10 }}>
                <div style={{ width:"100%", background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"12px 10px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#555555", marginBottom:4 }}>Organizer Review</div>
                  <div style={{ fontSize:11, color:"#888888", marginBottom:24 }}>Based on current intake, organizer returns are expected to peak soon—plan reviewer bandwidth accordingly.</div>
                  <div style={{ display:"flex", alignItems:"center", gap:20, paddingLeft:32, paddingRight:32, marginTop:6 }}>
                    <MiniDonut centerLabel={`${orgSent}`} centerSub="sent"
                      segs={[{v:orgNot,c:"#7c6fcd"},{v:orgSent,c:"#4fc3f7"}]} />
                    <div style={{ flex:1 }}>
                      {[{l:"Not Sent",c:"#7c6fcd",v:orgNot},{l:"Sent to Review",c:"#4fc3f7",v:orgSent}].map(s=>(
                        <div key={s.l} style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                          <div style={{ width:7, height:7, borderRadius:99, background:s.c, flexShrink:0 }} />
                          <span style={{ fontSize:9, color:"#666666", flex:1 }}>{s.l}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:"#1a1a1a" }}>{Math.round((s.v/clients.length)*100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button style={{ width:"100%", marginTop:12, border:"1.5px solid #e0e0e0", background:"#fff", color:"#555555", fontSize:12, fontWeight:700, padding:"10px 0", borderRadius:10, cursor:"pointer" }}>Check blockers</button>
                </div>
              </div>
            );
          })()}

          {/* E-file by Type — horizontal stacked bars */}
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"12px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#555555", marginBottom:4 }}>E-Filing by Type</div>
            <div style={{ fontSize:11, color:"#888888", marginBottom:24 }}>Predictive mix shows 1040s driving volume; queue capacity may need a small lift mid‑week.</div>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              {[{t:"1040",c:"#7c6fcd"},{t:"1041",c:"#26a69a"},{t:"1120",c:"#ef5350"}].map(x=>(
                <div key={x.t} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:7, height:7, borderRadius:99, background:x.c }} />
                  <span style={{ fontSize:9, color:"#777777" }}>{x.t}</span>
                </div>
              ))}
            </div>
            {[
              { status:"Accepted",  bars:[{v:55,c:"#7c6fcd"},{v:25,c:"#ef5350"},{v:10,c:"#26a69a"}] },
              { status:"At IRS",    bars:[{v:3, c:"#7c6fcd"}] },
              { status:"Initiated", bars:[{v:2, c:"#7c6fcd"},{v:1,c:"#ef5350"}] },
              { status:"Rejected",  bars:[{v:1, c:"#ef5350"}] },
              { status:"Qualified", bars:[{v:2, c:"#26a69a"}] },
            ].map((row, i, arr) => {
              const total = row.bars.reduce((a,b)=>a+b.v,0);
              return (
                <div key={row.status} style={{ marginBottom:i<arr.length-1?8:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:10, color:"#555555" }}>{row.status}</span>
                    <span style={{ fontSize:10, fontWeight:600, color:"#1a1a1a" }}>{total}</span>
                  </div>
                  <div style={{ display:"flex", height:7, borderRadius:99, overflow:"hidden", background:"#f0f0f0" }}>
                    {row.bars.map((b,j)=>(
                      <div key={j} style={{ width:`${(b.v/90)*100}%`, background:b.c, minWidth:b.v>0?3:0 }} />
                    ))}
                  </div>
                </div>
              );
            })}
            <button style={{ width:"100%", marginTop:12, border:"1.5px solid #e0e0e0", background:"#fff", color:"#555555", fontSize:12, fontWeight:700, padding:"10px 0", borderRadius:10, cursor:"pointer" }}>Fix and resubmit</button>
          </div>

        </div>


      {/* Work scope sheet */}
      {workScopeSheetOpen && (
        <div style={{ position:"absolute", inset:0, zIndex:50 }}>
          <div onClick={closeWorkScopeSheet} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position:"absolute",
              left:0,
              right:0,
              bottom:0,
              background:"#fff",
              borderRadius:"16px 16px 0 0",
              padding:"14px 16px 18px",
              boxShadow:"0 -12px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>Select work view</div>
              <button onClick={closeWorkScopeSheet} style={{ border:"none", background:"#f2f2f2", width:28, height:28, borderRadius:99, cursor:"pointer", color:"#555" }}>✕</button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { id:"my", label:"My work", desc:"Only tasks assigned to me" },
                { id:"all", label:"All work", desc:"Team-wide queue and workload" },
                { id:"favorites", label:"Favorites", desc:"Pinned clients and priority items" },
              ].map((opt) => {
                const active = workScope === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { setWorkScope(opt.id); closeWorkScopeSheet(); }}
                    style={{
                      width:"100%",
                      border: active ? "1.5px solid #2d2d2d" : "1.5px solid #e0e0e0",
                      background: active ? "#f7f7f7" : "#fff",
                      borderRadius:12,
                      padding:"10px 12px",
                      textAlign:"left",
                      cursor:"pointer",
                    }}
                  >
                    <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{opt.label}</div>
                    <div style={{ fontSize:11, color:"#888888", marginTop:2 }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Remind sheet */}
      {remindSheet && (
        <div style={{ position:"absolute", inset:0, zIndex:50 }}>
          <div onClick={() => { setRemindSheet(null); setOverlayOpen(false); }} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position:"absolute",
              left:0,
              right:0,
              bottom:0,
              background:"#fff",
              borderRadius:"16px 16px 0 0",
              padding:"14px 16px 18px",
              boxShadow:"0 -12px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>Send Reminder</div>
              <button onClick={() => { setRemindSheet(null); setOverlayOpen(false); }} style={{ border:"none", background:"#f2f2f2", width:28, height:28, borderRadius:99, cursor:"pointer", color:"#555" }}>✕</button>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>{remindSheet.client?.name?.[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{remindSheet.client?.name}</div>
                <div style={{ fontSize:11, color:"#888888", marginTop:2 }}>
                  {remindSheet.client ? `${remindSheet.client.stepLabel} · Step ${remindSheet.client.step} of ${remindSheet.client.steps}` : "Stage unknown"}
                </div>
              </div>
            </div>

            <div style={{ background:"#f7f7f7", border:"1px solid #eeeeee", borderRadius:10, padding:"8px 10px", marginBottom:10 }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#999999", letterSpacing:1.2, marginBottom:4 }}>TRIGGER</div>
              <div style={{ fontSize:12, color:"#555555" }}>{remindSheet.card?.what || "Action needed"}</div>
            </div>

            <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.2, marginBottom:6 }}>REASON</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:48 }}>
              {buildRemindReasons(remindSheet.card, remindSheet.client).map(r => {
                const active = remindReason === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRemindReason(r)}
                    style={{
                      border: active ? "1.5px solid #2d2d2d" : "1.5px solid #e0e0e0",
                      background: active ? "#2d2d2d" : "#fff",
                      color: active ? "#fff" : "#555555",
                      borderRadius:999,
                      padding:"7px 12px",
                      fontSize:11,
                      fontWeight:600,
                      cursor:"pointer",
                    }}
                  >{r}</button>
                );
              })}
            </div>

            {remindReason === "Custom" && (
              <input
                value={remindCustom}
                onChange={(e) => setRemindCustom(e.target.value)}
                placeholder="Custom reason..."
                style={{ width:"100%", border:"1.5px solid #e0e0e0", borderRadius:10, padding:"8px 10px", fontSize:12, marginBottom:16, outline:"none" }}
              />
            )}

            <div style={{ display:"flex", gap:8, marginTop:6 }}>
              <button onClick={() => { setRemindSheet(null); setOverlayOpen(false); }} style={{ flex:1, border:"1.5px solid #d8d8d8", borderRadius:12, padding:"12px 0", background:"#fff", color:"#555555", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
              <button
                onClick={sendReminder}
                disabled={remindReason === "Custom" && !remindCustom.trim()}
                style={{
                  flex:2,
                  border:"none",
                  borderRadius:12,
                  padding:"12px 0",
                  background: remindReason === "Custom" && !remindCustom.trim() ? "#d8d8d8" : "#2d2d2d",
                  color: remindReason === "Custom" && !remindCustom.trim() ? "#888888" : "#fff",
                  fontWeight:700,
                  fontSize:13,
                  cursor: remindReason === "Custom" && !remindCustom.trim() ? "default" : "pointer",
                }}
              >Send Reminder</button>
            </div>
          </div>
        </div>
      )}

      {/* Refile sheet */}
      {refileSheet && !refileFileSheet && (() => {
        const info = getRejectInfo(refileSheet.ext);
        return (
          <div style={{ position:"absolute", inset:0, zIndex:50 }}>
            <div onClick={() => { setRefileSheet(null); setOverlayOpen(false); }} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position:"absolute",
                left:0,
                right:0,
                bottom:0,
                background:"#fff",
                borderRadius:"16px 16px 0 0",
                padding:"14px 16px 18px",
                boxShadow:"0 -12px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>Refile Extension</div>
                <button onClick={() => { setRefileSheet(null); setOverlayOpen(false); }} style={{ border:"none", background:"#f2f2f2", width:28, height:28, borderRadius:99, cursor:"pointer", color:"#555" }}>✕</button>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>{refileSheet.client?.name?.[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{refileSheet.client?.name}</div>
                  <div style={{ fontSize:11, color:"#888888", marginTop:2 }}>
                    {refileSheet.ext ? `${refileSheet.ext.jurisdiction} · Deadline ${refileSheet.ext.deadline}` : "Extension rejected"}
                  </div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, background:"#fdecea", color:"#b05a54", borderRadius:6, padding:"3px 8px", letterSpacing:0.3 }}>REJECTED</span>
              </div>

              <div style={{ background:"#f7f7f7", border:"1px solid #eeeeee", borderRadius:10, padding:"8px 10px", marginBottom:10 }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#999999", letterSpacing:1.2, marginBottom:4 }}>REJECTION</div>
                <div style={{ fontSize:12, color:"#555555" }}>{info.reason}</div>
                <div style={{ fontSize:10, color:"#999999", marginTop:4 }}>Code: {info.code}</div>

                {/* Rejected file */}
                {(() => {
                  const doc = getRefileDoc(refileSheet.ext, refileSheet.client);
                  if (!doc) return null;
                  return (
                    <div style={{ marginTop:10, borderTop:"1px solid #ededed", paddingTop:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:8, background:"#f2f2f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a" }}>{doc.name}</div>
                          <div style={{ fontSize:10, color:"#999999", marginTop:2 }}>{doc.size} · {doc.date}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast({ msg:"Opening file…", auto:true })}
                        style={{ border:"1px solid #d8d8d8", borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}
                      >Open</button>
                    </div>
                  );
                })()}
              </div>

              <div style={{ border:"1px solid #eeeeee", borderRadius:10, padding:"8px 10px", marginBottom:12, background:"#fff" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.2, marginBottom:6 }}>POTENTIAL SOLUTION</div>
                <div style={{ fontSize:12, color:"#666666", lineHeight:1.5 }}>
                  Verify taxpayer identifiers and submission metadata. Correct the mismatch, regenerate the extension, and resubmit before the deadline.
                </div>
              </div>

              <div style={{ marginBottom:48 }} />

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { setRefileSheet(null); setOverlayOpen(false); }} style={{ flex:1, border:"1.5px solid #d8d8d8", borderRadius:12, padding:"12px 0", background:"#fff", color:"#555555", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
                <button
                  onClick={() => !refileSubmitting && openRefileFileSheet()}
                  style={{
                    flex:2,
                    border:"none",
                    borderRadius:12,
                    padding:"12px 0",
                    background: refileSubmitting ? "#555555" : "#2d2d2d",
                    color:"#fff",
                    fontWeight:700,
                    fontSize:13,
                    cursor: refileSubmitting ? "default" : "pointer",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    gap:8,
                  }}
                >
                  {refileSubmitting ? (
                    <span style={{ width:14, height:14, borderRadius:99, border:"2px solid rgba(255,255,255,0.35)", borderTopColor:"#fff", display:"inline-block", animation:"spin 1s linear infinite" }} />
                  ) : (
                    "Resubmit file"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Refile file select */}
      {refileSheet && refileFileSheet && (
        <div style={{ position:"absolute", inset:0, zIndex:55 }}>
          <div onClick={() => { setRefileFileSheet(false); setOverlayOpen(false); }} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position:"absolute",
              left:0,
              right:0,
              bottom:0,
              background:"#fff",
              borderRadius:"16px 16px 0 0",
              padding:"14px 16px 18px",
              boxShadow:"0 -12px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>Select file</div>
              <button onClick={() => { setRefileFileSheet(false); setOverlayOpen(false); }} style={{ border:"none", background:"#f2f2f2", width:28, height:28, borderRadius:99, cursor:"pointer", color:"#555" }}>✕</button>
            </div>

            <div
              onClick={handleRefileFileSelect}
              style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"12px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:"#f2f2f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a" }}>Extension resubmission.pdf</div>
                  <div style={{ fontSize:10, color:"#999999", marginTop:2 }}>128 KB · Today</div>
                </div>
              </div>
              <button style={{ border:"1px solid #d8d8d8", borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}>Choose</button>
            </div>
          </div>
        </div>
      )}

      {/* E‑sign sheet */}
      {eSignSheet && !eSignDocOpen && (() => {
        const f = eSignSheet.form;
        const docName = f ? `Form 8879 — ${f.jurisdiction}` : "Form 8879 Authorization";
        return (
          <div style={{ position:"absolute", inset:0, zIndex:50 }}>
            <div onClick={() => { setESignSheet(null); setOverlayOpen(false); }} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)" }} />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position:"absolute",
                left:0,
                right:0,
                bottom:0,
                background:"#fff",
                borderRadius:"16px 16px 0 0",
                padding:"14px 16px 18px",
                boxShadow:"0 -12px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>Sign on Phone</div>
                <button onClick={() => { setESignSheet(null); setOverlayOpen(false); }} style={{ border:"none", background:"#f2f2f2", width:28, height:28, borderRadius:99, cursor:"pointer", color:"#555" }}>✕</button>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>{eSignSheet.client?.name?.[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{eSignSheet.client?.name}</div>
                  <div style={{ fontSize:11, color:"#888888", marginTop:2 }}>{eSignSheet.form ? `E‑file authorization · ${eSignSheet.form.jurisdiction}` : "E‑file authorization"}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:700, background:"#e8f0ff", color:"#3b5bcc", borderRadius:6, padding:"3px 8px", letterSpacing:0.3 }}>MOBILE</span>
              </div>

              <div style={{ background:"#f7f7f7", border:"1px solid #eeeeee", borderRadius:10, padding:"8px 10px", marginBottom:10 }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#999999", letterSpacing:1.2, marginBottom:4 }}>PURPOSE</div>
                <div style={{ fontSize:12, color:"#555555" }}>Client signs Form 8879 on their phone to authorize IRS e‑file.</div>
              </div>

              <div style={{ border:"1px solid #e8e8e8", borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:48, background:"#fff" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:"#f2f2f2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a" }}>{docName}</div>
                    <div style={{ fontSize:10, color:"#999999", marginTop:2 }}>Ready for mobile signing · 1 signer</div>
                  </div>
                </div>
                <button
                  onClick={() => showToast({ msg:"Opening document…", auto:true })}
                  style={{ border:"1px solid #d8d8d8", borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}
                >Preview</button>
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { setESignSheet(null); setOverlayOpen(false); }} style={{ flex:1, border:"1.5px solid #d8d8d8", borderRadius:12, padding:"12px 0", background:"#fff", color:"#555555", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
                <button
                  onClick={() => !eSignSubmitting && openESignDoc()}
                  style={{
                    flex:2,
                    border:"none",
                    borderRadius:12,
                    padding:"12px 0",
                    background: eSignSubmitting ? "#555555" : "#2d2d2d",
                    color:"#fff",
                    fontWeight:700,
                    fontSize:13,
                    cursor: eSignSubmitting ? "default" : "pointer",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    gap:8,
                  }}
                >
                  {eSignSubmitting ? (
                    <>
                      <span style={{ width:14, height:14, borderRadius:99, border:"2px solid rgba(255,255,255,0.35)", borderTopColor:"#fff", display:"inline-block", animation:"spin 1s linear infinite" }} />
                      Waiting for signature…
                    </>
                  ) : (
                    "Start mobile signing"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* E‑sign document full screen */}
      {eSignSheet && eSignDocOpen && (() => {
        const f = eSignSheet.form;
        const docName = f ? `Form 8879 — ${f.jurisdiction}` : "Form 8879 Authorization";
        const signsLeft = 2 - (eSignSigned.first?1:0) - (eSignSigned.second?1:0);
        const pageImg = "/assets/lease-agreement.svg";
        const SignatureMark = ({}) => (
          <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 28 C16 10, 30 36, 42 18 S66 20, 80 12 S98 16, 114 8" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round"/>
            <path d="M18 30 C30 34, 52 34, 70 28" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
        return (
          <div style={{ position:"absolute", inset:0, zIndex:60, background:"#f4f4f4", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"#2d2d2d", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", color:"#fff", flexShrink:0 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{docName}</div>
              <button onClick={() => setESignDocOpen(false)} style={{ border:"none", background:"rgba(255,255,255,0.15)", width:30, height:30, borderRadius:99, cursor:"pointer", color:"#fff", fontSize:16 }}>✕</button>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 140px" }}>
              {[1,2].map((p,i)=>(
                <div key={p} ref={i===1 ? eSignSecondRef : null} style={{ position:"relative", background:"#fff", border:"1px solid #e6e6e6", borderRadius:12, padding:"10px", marginBottom:16 }}>
                  <img src={pageImg} alt="Document page" style={{ width:"100%", height:"auto", display:"block", borderRadius:8 }} />
                  {i===0 && eSignSigned.first && (
                    <div style={{ position:"absolute", right:56, bottom:72, animation:"signLand 0.35s ease-out" }}>
                      <SignatureMark />
                    </div>
                  )}
                  {i===1 && eSignSigned.second && (
                    <div style={{ position:"absolute", right:56, bottom:72, animation:"signLand 0.35s ease-out" }}>
                      <SignatureMark />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ position:"absolute", left:0, right:0, bottom:0, background:"#fff", padding:"10px 16px 16px", boxShadow:"0 -6px 20px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize:11, color:"#777777", marginBottom:8 }}>{signsLeft} signature{signsLeft>1?"s":""} left</div>
              <button
                onClick={eSignSigned.first ? handleESignSecond : handleESignFirst}
                style={{ width:"100%", border:"none", borderRadius:12, padding:"12px 0", background:"#2d2d2d", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}
              >
                Sign
              </button>
            </div>
          </div>
        );
      })()}

      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════
function ClientsScreen({ go, clients, reminded, remind }) {
  const [q, setQ]       = useState("");
  const [f, setF]       = useState("All");
  const [view, setView] = useState("client"); // "client" | "workspace"

  const filtered = clients.filter(c => {
    const ms = c.name.toLowerCase().includes(q.toLowerCase()) ||
               (c.company||"").toLowerCase().includes(q.toLowerCase()) ||
               c.workspaces.some(w => w.toLowerCase().includes(q.toLowerCase()));
    const mf = f==="All" ? true : f==="Favorites" ? [1,3,6].includes(c.id) : c.urgent;
    return ms && mf;
  });

  // Group by company for workspace view
  const companies = [...new Set(clients.map(c => c.company).filter(Boolean))];
  const standalone = filtered.filter(c => !c.company);
  const grouped    = companies.map(co => ({ company:co, clients: filtered.filter(c => c.company===co) })).filter(g => g.clients.length);

  const WorkspaceTag = ({ label }) => (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:"#f6f6f6", border:"1px solid #e8e8e8", borderRadius:7, cursor:"pointer" }}>
      <span style={{ fontSize:11, color:"#555555", fontWeight:500 }}>{label}</span>
      <span style={{ fontSize:10, color:"#c0c0c0" }}>›</span>
    </div>
  );

  const ClientCardClient = ({ c }) => (
    <div onClick={() => go(S.CLIENT_DETAIL, { client:c })} style={{ background:"#fff", border:`1px solid ${c.urgent?"#c8c8c8":"#d8d8d8"}`, borderRadius:14, padding:13, marginBottom:10, cursor:"pointer" }}>
      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", gap:9, alignItems:"center" }}>
          <div style={{ width:34, height:34, borderRadius:99, background:"#f0f0f0", color:"#2d2d2d", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 }}>{c.name[0]}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{c.name}</div>
            <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:1 }}><TypeBadge type={c.type} /></div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}><RiskDot risk={c.risk} /><span style={{ color:"#c0c0c0", fontSize:13 }}>›</span></div>
      </div>
      {/* Progress */}
      <div style={{ marginBottom: c.workspaces.length ? 8 : 0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
          <span style={{ fontSize:11, color:"#777777" }}>{c.stepLabel}</span>
          <span style={{ fontSize:11, color:"#777777" }}>{c.step}/{c.steps}</span>
        </div>
        <StepBar step={c.step} total={c.steps} />
      </div>
      {/* Workspaces */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {c.workspaces.map(w => <WorkspaceTag key={w} label={w} />)}
      </div>
      {c.blockedBy === "client" && (
        <div style={{ marginTop:9, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#666666", fontWeight:600 }}>⚠ Waiting on client</span>
          <button onClick={e => { e.stopPropagation(); remind(c.id); }} style={{ border:"none", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer", background: reminded.includes(c.id)?"#e8e8e8":"#2d2d2d", color: reminded.includes(c.id)?"#4a4a4a":"#fff" }}>
            {reminded.includes(c.id) ? "✓ Sent" : "Send Reminder"}
          </button>
        </div>
      )}
    </div>
  );

  const CompanyGroup = ({ company, groupClients }) => {
    const allWorkspaces = groupClients.flatMap(c => c.workspaces.map(w => ({ w, client:c })));
    return (
      <div style={{ marginBottom:14 }}>
        {/* Company card */}
        <div style={{ background:"#2d2d2d", borderRadius:"14px 14px 0 0", padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"rgba(255,255,255,0.15)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 }}>{company[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"#fff" }}>{company}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:1 }}>{groupClients.length} client{groupClients.length>1?"s":""} · {allWorkspaces.length} workspace{allWorkspaces.length>1?"s":""}</div>
          </div>
        </div>

        {/* Client cards nested */}
        <div style={{ background:"#fff", border:"1px solid #d8d8d8", borderTop:"none", borderRadius:"0 0 14px 14px", overflow:"hidden" }}>
          {groupClients.map((c, ci) => (
            <div key={c.id} style={{ borderBottom: ci < groupClients.length-1 ? "1px solid #f0f0f0" : "none" }}>
              {/* Client row */}
              <div onClick={() => go(S.CLIENT_DETAIL, { client:c })} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px 6px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:99, background:"#f0f0f0", color:"#2d2d2d", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, flexShrink:0 }}>{c.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#1a1a1a" }}>{c.name}</div>
                    <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:1 }}>
                      <TypeBadge type={c.type} />
                      {c.blockedBy==="client" && <span style={{ fontSize:9, color:"#888888", fontWeight:600 }}>⚠ waiting</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}><RiskDot risk={c.risk} /><span style={{ color:"#c0c0c0", fontSize:13 }}>›</span></div>
              </div>
              {/* Workspace chips */}
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", padding:"2px 14px 10px 50px" }}>
                {c.workspaces.map(w => <WorkspaceTag key={w} label={w} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StandaloneCard = ({ c }) => (
    <div style={{ background:"#fff", border:"1px solid #d8d8d8", borderRadius:14, overflow:"hidden", marginBottom:10 }}>
      <div onClick={() => go(S.CLIENT_DETAIL, { client:c })} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px 8px", cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:34, height:34, borderRadius:99, background:"#f0f0f0", color:"#2d2d2d", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{c.name[0]}</div>
          <div>
            <div style={{ fontWeight:600, fontSize:13, color:"#1a1a1a" }}>{c.name}</div>
            <div style={{ display:"flex", gap:5, alignItems:"center", marginTop:1 }}>
              <TypeBadge type={c.type} />
              {c.blockedBy==="client" && <span style={{ fontSize:9, color:"#888888", fontWeight:600 }}>⚠ waiting</span>}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}><RiskDot risk={c.risk} /><span style={{ color:"#c0c0c0", fontSize:13 }}>›</span></div>
      </div>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", padding:"2px 14px 10px" }}>
        {c.workspaces.map(w => <WorkspaceTag key={w} label={w} />)}
      </div>
    </div>
  );

  return (
    <div style={{ flex:1 }}>
      <Header title="Clients" sub={`${clients.length} active`} search={q} onSearch={setQ} searchPh="Search clients or workspaces..." />

      {/* Controls row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 18px 4px" }}>
        {/* Filters */}
        <div style={{ display:"flex", gap:6 }}>
          {["All","Favorites","Urgent"].map(x => (
            <button key={x} onClick={() => setF(x)} style={{ border:"none", borderRadius:99, padding:"5px 11px", fontSize:11, fontWeight:600, cursor:"pointer", background: f===x?"#2d2d2d":"#f2f2f2", color: f===x?"#fff":"#777777" }}>{x}</button>
          ))}
        </div>
        {/* View switcher */}
        <div style={{ display:"flex", background:"#f2f2f2", borderRadius:8, padding:2, gap:1 }}>
          {[{id:"client",label:"Client"},{id:"workspace",label:"Workspace"}].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:600, cursor:"pointer", background: view===v.id?"#fff":"transparent", color: view===v.id?"#1a1a1a":"#999999", boxShadow: view===v.id?"0 1px 3px rgba(0,0,0,0.1)":"none", transition:"all 0.15s" }}>{v.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"8px 18px 20px" }}>
        {view === "client" ? (
          filtered.map(c => <ClientCardClient key={c.id} c={c} />)
        ) : (
          <>
            {grouped.map(g => <CompanyGroup key={g.company} company={g.company} groupClients={g.clients} />)}
            {standalone.length > 0 && (
              <>
                {grouped.length > 0 && <div style={{ fontSize:10, fontWeight:700, color:"#c0c0c0", letterSpacing:1.3, marginBottom:8, marginTop:4 }}>INDIVIDUAL</div>}
                {standalone.map(c => <StandaloneCard key={c.id} c={c} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CLIENT DETAIL
// ══════════════════════════════════════════════════════════════════
function ClientDetailScreen({ go, ctx, reminded, remind, docs, chats }) {
  const c = ctx.client; if (!c) return null;
  const backTarget = ctx?.from === S.HOME ? S.HOME : S.CLIENTS;
  const clientDocs = docs.filter(d => d.client === c.name);
  return (
    <div style={{ flex:1 }}>
      <Header title={c.name} sub={c.type} back onBack={() => go(backTarget)} />
      <div style={{ padding:"12px 18px 20px" }}>

        {/* Info card */}
        <div style={{ background:"#fff", borderRadius:14, padding:"14px 16px", marginBottom:12, border:"1px solid #d8d8d8" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:44, height:44, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:17 }}>{c.name[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{c.name}</div>
              <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}><TypeBadge type={c.type} /><RiskDot risk={c.risk} /></div>
            </div>
          </div>

          {/* Primary action buttons */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:14 }}>
            <button onClick={() => {
              const chat = chats.find(ch => ch.name === c.name);
              if (chat) go(S.CHAT, { chat });
              else go(S.MESSAGING);
            }} style={{ border:"none", borderRadius:10, padding:"10px 8px", fontWeight:600, fontSize:12, cursor:"pointer", background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span>✉</span> Send Message
            </button>
            <button onClick={() => go(S.DOCUMENTS, {})} style={{ border:"none", borderRadius:10, padding:"10px 8px", fontWeight:600, fontSize:12, cursor:"pointer", background:"#f0f0f0", color:"#555555", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span>📁</span> Documents
            </button>
            {c.blockedBy === "client" && (
              <button onClick={() => remind(c.id)} style={{ border:"none", borderRadius:10, padding:"10px 8px", fontWeight:600, fontSize:12, cursor:"pointer", background: reminded.includes(c.id) ? "#e8e8e8" : "#ebebeb", color: reminded.includes(c.id) ? "#4a4a4a" : "#555555", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>🔔</span> {reminded.includes(c.id) ? "✓ Reminded" : "Send Reminder"}
              </button>
            )}
            {c.elStatus !== "signed" && (
              <button onClick={() => go(S.EL_WIZARD, { preClient: c })} style={{ border:"none", borderRadius:10, padding:"10px 8px", fontWeight:600, fontSize:12, cursor:"pointer", background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>📝</span> Send EL
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div style={{ background:"#fff", borderRadius:14, padding:"12px 14px", marginBottom:12, border:"1px solid #d8d8d8" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, marginBottom:10 }}>TAX RETURN PROGRESS</div>
          {stepLabels.map((label, i) => {
            const done = i < c.step - 1, cur = i === c.step - 1;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom: i<stepLabels.length-1 ? "1px solid #f6f6f6" : "none" }}>
                <div style={{ width:22, height:22, borderRadius:99, flexShrink:0, background: done?"#4a4a4a":cur?"#2d2d2d":"#d8d8d8", color: done||cur?"#fff":"#999999", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{done?"✓":i+1}</div>
                <span style={{ fontSize:12, fontWeight: cur?700:400, color: done?"#4a4a4a":cur?"#1a1a1a":"#999999", flex:1 }}>{label}</span>
                {cur && c.blockedBy && <span style={{ fontSize:10, color:"#666666", fontWeight:600 }}>Waiting</span>}
                {cur && !c.blockedBy && <span style={{ fontSize:10, color:"#555555", fontWeight:600 }}>Active</span>}
              </div>
            );
          })}
        </div>

        {/* Responsiveness */}
        {(() => {
          // Per-client mock data keyed by client id
          const respMap = { 1:[2,1,3,1,2], 2:[5,7,4,6,5], 3:[1,2,1,1,2], 4:[8,6,9,7,8], 5:[4,3,5,4,6], 6:[2,1,3,2,1] };
          const history = respMap[c.id] || [3,3,3,3,3];
          const avg = Math.round(history.reduce((a,b)=>a+b,0)/history.length);
          const trend = history[history.length-1] < history[0] ? "Improving" : history[history.length-1] > history[0] ? "Slowing" : "Stable";
          const trendColor = trend==="Improving"?"#2d2d2d":trend==="Slowing"?"#b05a54":"#c8a200";
          const maxH = Math.max(...history);
          return (
            <div style={{ background:"#fff", borderRadius:14, padding:"12px 14px", marginBottom:12, border:"1px solid #d8d8d8" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5 }}>RESPONSIVENESS</div>
                <span style={{ fontSize:10, fontWeight:700, color:trendColor, background:trendColor+"18", borderRadius:6, padding:"2px 7px" }}>{trend}</span>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:36, marginBottom:8 }}>
                {history.map((v, i) => (
                  <div key={i} style={{ flex:1, borderRadius:"3px 3px 0 0", background: i===history.length-1?"#2d2d2d": v>=6?"#b05a54":v>=4?"#c8a200":"#d0d0d0", height:`${Math.max((v/maxH)*36, 4)}px` }} />
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, color:"#999999" }}>Last 5 interactions</span>
                <span style={{ fontSize:11, fontWeight:700, color: avg>=6?"#b05a54":avg>=4?"#c8a200":"#2d2d2d" }}>Avg {avg}d response</span>
              </div>
            </div>
          );
        })()}

        {/* Documents */}
        {clientDocs.length > 0 && (
          <div style={{ background:"#fff", borderRadius:14, padding:"12px 14px", border:"1px solid #d8d8d8" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, marginBottom:10 }}>DOCUMENTS</div>
            {clientDocs.map((d,i) => (
              <div key={d.id} onClick={() => go(S.DMS_FILE, { file:d })} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom: i<clientDocs.length-1?"1px solid #f6f6f6":"none", cursor:"pointer" }}>
                <span style={{ fontSize:18 }}>{d.ext==="pdf"?"📄":d.ext==="xlsx"?"📊":"📝"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                  <div style={{ fontSize:10, color:"#999999" }}>{d.size} · {d.date}</div>
                </div>
                {d.status && <StatusPill status={d.status} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// EL STATUS SCREEN
// ══════════════════════════════════════════════════════════════════
function ELStatusScreen({ go, clients, reminded, remind, showToast }) {
  const [tab, setTab]         = useState("All");
  const [reminding, setReminding] = useState([]); // animating
  const [sent, setSent]       = useState([]);     // confirmed sent

  const filtered = clients.filter(c =>
    tab === "All"    ? true :
    tab === "Signed" ? c.elStatus === "signed" :
    tab === "Pending" ? (c.elStatus === "pending" || c.elStatus === "sent") :
    false
  );

  // Days outstanding mock per client
  const daysMap = { 1:0, 2:12, 3:0, 4:9, 5:0, 6:0, 7:2, 8:3, 9:7, 10:4, 11:2, 12:0 };

  const handleRemind = (clientId) => {
    setReminding(p => [...p, clientId]);
    setTimeout(() => {
      setSent(p => [...p, clientId]);
      setReminding(p => p.filter(x => x !== clientId));
      remind(clientId);
    }, 600);
  };

  const pendingCount = clients.filter(c => c.elStatus !== "signed").length;
  const signedCount  = clients.filter(c => c.elStatus === "signed").length;

  return (
    <div style={{ flex:1 }}>
      <Header title="Engagement Letters" sub={`${signedCount} signed · ${pendingCount} pending`} back onBack={() => go(S.HOME)} />

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, padding:"10px 18px 6px" }}>
        {["All","Pending","Signed"].map(x => (
          <button key={x} onClick={() => setTab(x)} style={{ border:"none", borderRadius:99, padding:"5px 12px", fontSize:11, fontWeight:600, cursor:"pointer", background: tab===x?"#2d2d2d":"#f2f2f2", color: tab===x?"#fff":"#777777" }}>{x}</button>
        ))}
      </div>

      {/* Create New EL — Desktop Bridge */}
      <div style={{ margin:"8px 18px 4px" }}>
        <div style={{ background:"#f6f6f6", border:"1px solid #e8e8e8", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a" }}>Create New Engagement Letter</div>
            <div style={{ fontSize:10, color:"#999999", marginTop:1 }}>Opens wizard on desktop</div>
          </div>
          <button
            onClick={() => go(S.EL_WIZARD, { preClient: null })}
            style={{ border:"none", borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:700, background:"#2d2d2d", color:"#fff", cursor:"pointer", flexShrink:0 }}
          >+ Create New EL</button>
        </div>
      </div>

      <div style={{ padding:"8px 18px 20px" }}>
        {filtered.map((c, i) => {
          const isPending = c.elStatus !== "signed";
          const days      = daysMap[c.id] || 0;
          const isReminding = reminding.includes(c.id);
          const isSent      = sent.includes(c.id) || reminded.includes(c.id);
          const isCritical  = days >= 7;

          return (
            <div key={c.id} style={{
              background: isCritical && isPending ? "#fffafa" : "#fff",
              borderRadius:14, padding:"12px 14px", marginBottom:10,
              border: isCritical && isPending ? "1px solid #f0d0d0" : "1px solid #d8d8d8",
              opacity: isReminding ? 0.6 : 1,
              transform: isReminding ? "scale(0.98)" : "scale(1)",
              transition:"opacity 0.3s, transform 0.3s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: isPending ? 10 : 0 }}>
                <div style={{ width:34, height:34, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{c.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{c.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                    <TypeBadge type={c.type} />
                    {days > 0 && <span style={{ fontSize:10, fontWeight:600, color: isCritical?"#b05a54":"#c8a200" }}>{days}d outstanding</span>}
                  </div>
                </div>
                <StatusPill status={c.elStatus} />
              </div>

              {isPending && (
                <div style={{ display:"flex", gap:8 }}>
                  {/* Remind button with animation */}
                  <button
                    onClick={() => !isSent && handleRemind(c.id)}
                    style={{
                      flex:1, border:"none", borderRadius:9, padding:"9px",
                      fontSize:12, fontWeight:700, cursor: isSent ? "default" : "pointer",
                      background: isSent ? "#f0f0f0" : isReminding ? "#555" : "#2d2d2d",
                      color: isSent ? "#4a4a4a" : "#fff",
                      transition:"background 0.3s",
                    }}
                  >{isSent ? "✓ Reminder sent" : isReminding ? "Sending..." : "Send Reminder"}</button>

                  <button
                    onClick={() => go(S.EL_WIZARD, { preClient: c })}
                    style={{ border:"1px solid #d8d8d8", borderRadius:9, padding:"9px 12px", fontSize:11, fontWeight:600, cursor:"pointer", background:"#fff", color:"#555555", flexShrink:0 }}
                  >Send EL</button>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// EL WIZARD SCREEN
// ══════════════════════════════════════════════════════════════════
function ELWizardScreen({ go, ctx, clients, showToast }) {
  const preClient = ctx?.preClient || null;

  const STEPS = ["Template", "Client", "General Info", "Fees", "Attachments", "Signatories"];

  const templates = [
    { id:1, name:"Tax Compliance Services",  desc:"Standard 1040/1041 annual engagement", tag:"Individual" },
    { id:2, name:"Business Entity Services", desc:"1120 / 1120S / 1065 entity returns",   tag:"Entity"     },
    { id:3, name:"Trust & Estate",           desc:"1041 fiduciary returns",                tag:"Trust"      },
    { id:4, name:"Multi-Year Agreement",     desc:"2-year engagement with auto-renewal",   tag:"Any"        },
  ];

  const [step,       setStep]       = useState(0);
  const [template,   setTemplate]   = useState(null);
  const [selClients, setSelClients] = useState(preClient ? [preClient.id] : []);
  const [director,   setDirector]   = useState("");
  const [contact,    setContact]    = useState(preClient?.name || "");
  const [feeEst,     setFeeEst]     = useState(false);
  const [feePct,     setFeePct]     = useState("6%");
  const [feeType,    setFeeType]    = useState("Fixed Fee Engagements");
  const [progBill,   setProgBill]   = useState(true);
  const [retainer,   setRetainer]   = useState(false);
  const [attachments,setAttachments]= useState(false);
  const [sending,    setSending]    = useState(false);
  const [done,       setDone]       = useState(false);

  const canNext = () => {
    if (step === 0) return template !== null;
    if (step === 1) return selClients.length > 0;
    if (step === 2) return director.trim().length > 0;
    return true;
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setDone(true); }, 1400);
  };

  const toggleClient = (id) => {
    setSelClients(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  };

  // Progress bar
  const Progress = () => (
    <div style={{ display:"flex", gap:3, padding:"10px 18px 0" }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i<=step?"#2d2d2d":"#e0e0e0", transition:"background 0.3s" }} />
      ))}
    </div>
  );

  const StepLabel = () => (
    <div style={{ padding:"6px 18px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:11, fontWeight:700, color:"#1a1a1a" }}>{STEPS[step]}</span>
      <span style={{ fontSize:10, color:"#999999" }}>Step {step+1} of {STEPS.length}</span>
    </div>
  );

  const NavButtons = ({ onNext, nextLabel="Next", disabled=false }) => (
    <div style={{ display:"flex", gap:8, padding:"14px 18px", flexShrink:0 }}>
      <button onClick={() => step===0 ? go(S.EL_STATUS) : setStep(s=>s-1)}
        style={{ flex:1, border:"1px solid #d8d8d8", borderRadius:10, padding:"11px", fontSize:13, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}>
        {step===0 ? "Cancel" : "← Back"}
      </button>
      <button onClick={onNext} disabled={disabled}
        style={{ flex:2, border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, background: disabled?"#e0e0e0":"#2d2d2d", color: disabled?"#999999":"#fff", cursor: disabled?"default":"pointer", transition:"background 0.2s" }}>
        {nextLabel}
      </button>
    </div>
  );

  // ── Done screen
  if (done) {
    const tpl = templates.find(t=>t.id===template);
    const clientNames = clients.filter(c=>selClients.includes(c.id)).map(c=>c.name);
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <Header title="Engagement Letter" sub="Sent for review" back onBack={() => go(S.EL_STATUS)} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 24px" }}>
          <div style={{ width:56, height:56, borderRadius:99, background:"#2d2d2d", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16 }}>✓</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a", marginBottom:6, textAlign:"center" }}>Sent to Review</div>
          <div style={{ fontSize:13, color:"#777777", textAlign:"center", lineHeight:1.6, marginBottom:24 }}>
            <strong>{tpl?.name}</strong> has been sent for partner review.<br />
            {clientNames.join(", ")} will receive it once approved.
          </div>
          <button onClick={() => go(S.EL_STATUS)} style={{ width:"100%", border:"none", borderRadius:12, padding:"13px", background:"#2d2d2d", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Back to Engagement Letters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <Header title="Create Letter" sub={templates.find(t=>t.id===template)?.name || "New EL"} back onBack={() => step===0 ? go(S.EL_STATUS) : setStep(s=>s-1)} />
      <Progress />
      <StepLabel />
      <div style={{ flex:1, minHeight:0, overflowY:"auto", padding:"12px 18px 0" }}>

        {/* ── STEP 0: Template Select ── */}
        {step === 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {templates.map(t => (
              <div key={t.id} onClick={() => setTemplate(t.id)} style={{
                background:"#fff", borderRadius:14, padding:"14px",
                border: template===t.id ? "2px solid #2d2d2d" : "1px solid #e0e0e0",
                cursor:"pointer", transition:"border 0.15s",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", flex:1 }}>{t.name}</div>
                  <span style={{ fontSize:9, fontWeight:700, background:"#f0f0f0", color:"#666666", borderRadius:5, padding:"2px 7px", marginLeft:8, flexShrink:0 }}>{t.tag}</span>
                </div>
                <div style={{ fontSize:11, color:"#999999" }}>{t.desc}</div>
                {template===t.id && (
                  <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:16, height:16, borderRadius:99, background:"#2d2d2d", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ color:"#fff", fontSize:10 }}>✓</span>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#2d2d2d" }}>Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Client Information ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize:12, color:"#777777", marginBottom:12 }}>Select clients to include in this engagement letter.</div>
            {preClient && (
              <div style={{ background:"#f6f6f6", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:11, color:"#555555" }}>
                Pre-filled from client page: <strong>{preClient.name}</strong>
              </div>
            )}
            {/* Selected chips */}
            {selClients.length > 0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                {clients.filter(c=>selClients.includes(c.id)).map(c => (
                  <div key={c.id} style={{ display:"flex", alignItems:"center", gap:5, background:"#2d2d2d", borderRadius:99, padding:"4px 10px 4px 8px" }}>
                    <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{c.name}</span>
                    <span onClick={() => toggleClient(c.id)} style={{ fontSize:12, color:"#aaaaaa", cursor:"pointer", lineHeight:1 }}>×</span>
                  </div>
                ))}
              </div>
            )}
            {/* Client list */}
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e0e0e0", overflow:"hidden" }}>
              {clients.map((c, i, arr) => {
                const sel = selClients.includes(c.id);
                return (
                  <div key={c.id} onClick={() => toggleClient(c.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderBottom: i<arr.length-1?"1px solid #f4f4f4":"none", cursor:"pointer", background: sel?"#f8f8f8":"#fff" }}>
                    <div style={{ width:20, height:20, borderRadius:4, border: sel?"none":"1.5px solid #c0c0c0", background: sel?"#2d2d2d":"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {sel && <span style={{ color:"#fff", fontSize:11 }}>✓</span>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{c.name}</div>
                      <div style={{ fontSize:10, color:"#999999" }}>{c.type}{c.company ? ` · ${c.company}` : ""}</div>
                    </div>
                    <TypeBadge type={c.type} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: General Info ── */}
        {step === 2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:"#fef9e7", borderRadius:10, padding:"10px 12px", fontSize:11, color:"#7a5c00" }}>
              Multi-Year Agreement — fields pulled from template
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#555555", marginBottom:5 }}>Director Name <span style={{ color:"#b05a54" }}>*</span></div>
              <input
                value={director}
                onChange={e => setDirector(e.target.value)}
                placeholder="Enter director name"
                style={{ width:"100%", border:"1.5px solid #d8d8d8", borderRadius:9, padding:"10px 12px", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#1a1a1a" }}
              />
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#555555", marginBottom:5 }}>Contact Name <span style={{ color:"#b05a54" }}>*</span></div>
              <input
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="Enter contact name"
                style={{ width:"100%", border:"1.5px solid #d8d8d8", borderRadius:9, padding:"10px 12px", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", color:"#1a1a1a" }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: Fees ── */}
        {step === 3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Estimates & Extensions */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#444444", marginBottom:8 }}>Estimates and Extensions</div>
              {["Fees DO NOT Include", "Fees Include"].map(opt => (
                <div key={opt} onClick={() => setFeeEst(opt==="Fees Include")} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 0", cursor:"pointer" }}>
                  <div style={{ width:18, height:18, borderRadius:99, border: (feeEst===(opt==="Fees Include"))?"5px solid #2d2d2d":"2px solid #c0c0c0", flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"#444444" }}>{opt} Estimates and Extensions</span>
                </div>
              ))}
            </div>
            {/* Fee % */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#444444", marginBottom:8 }}>Fees Percentage</div>
              <div style={{ display:"flex", gap:8 }}>
                {["5%","6%","7%"].map(p => (
                  <button key={p} onClick={() => setFeePct(p)} style={{ flex:1, border: feePct===p?"2px solid #2d2d2d":"1.5px solid #e0e0e0", borderRadius:9, padding:"9px", fontSize:13, fontWeight:700, background: feePct===p?"#2d2d2d":"#fff", color: feePct===p?"#fff":"#555555", cursor:"pointer" }}>{p}</button>
                ))}
              </div>
            </div>
            {/* Fee type */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#444444", marginBottom:8 }}>Fee Option</div>
              {["Estimated Fee Engagements","Fixed Fee Engagements","Hourly Rate Engagements"].map(opt => (
                <div key={opt} onClick={() => setFeeType(opt)} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", cursor:"pointer" }}>
                  <div style={{ width:18, height:18, borderRadius:99, border: feeType===opt?"5px solid #2d2d2d":"2px solid #c0c0c0", flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"#444444" }}>{opt}</span>
                </div>
              ))}
            </div>
            {/* Toggles */}
            {[
              { label:"Include Progress Billing paragraph", val:progBill, set:setProgBill },
              { label:"Include Retainer fee sentence",      val:retainer, set:setRetainer },
            ].map(t => (
              <div key={t.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#444444", flex:1 }}>{t.label}</span>
                <div onClick={() => t.set(v=>!v)} style={{ width:40, height:22, borderRadius:99, background: t.val?"#2d2d2d":"#d0d0d0", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:3, left: t.val?19:3, width:16, height:16, borderRadius:99, background:"#fff", transition:"left 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 4: Attachments ── */}
        {step === 4 && (
          <div>
            <div style={{ fontSize:12, color:"#777777", marginBottom:16 }}>Optionally attach supplementary documents to this engagement letter.</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fff", borderRadius:14, border:"1px solid #e0e0e0", padding:"14px" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Add Attachments</div>
                <div style={{ fontSize:11, color:"#999999", marginTop:2 }}>STC, supplemental docs, schedules</div>
              </div>
              <div onClick={() => setAttachments(v=>!v)} style={{ width:40, height:22, borderRadius:99, background: attachments?"#2d2d2d":"#d0d0d0", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                <div style={{ position:"absolute", top:3, left: attachments?19:3, width:16, height:16, borderRadius:99, background:"#fff", transition:"left 0.2s" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Client Signatories ── */}
        {step === 5 && (
          <div>
            <div style={{ fontSize:12, color:"#777777", marginBottom:12 }}>Review signatories. Partner will always be the reviewer.</div>
            <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.3, marginBottom:8 }}>REVIEWERS</div>
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e0e0e0", padding:"12px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12 }}>TR</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Tiffany Roussel</div>
                <div style={{ fontSize:11, color:"#999999" }}>Partner · troussel@hubsync.com</div>
              </div>
              <span style={{ fontSize:9, background:"#f0f0f0", color:"#666666", borderRadius:5, padding:"2px 7px", fontWeight:600 }}>Auto</span>
            </div>
            <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.3, marginBottom:8 }}>SIGNATORIES</div>
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e0e0e0", overflow:"hidden" }}>
              {clients.filter(c=>selClients.includes(c.id)).map((c, i, arr) => (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderBottom: i<arr.length-1?"1px solid #f4f4f4":"none" }}>
                  <div style={{ width:32, height:32, borderRadius:99, background:"#555555", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12 }}>{c.name[0]}{c.name.split(" ")[1]?.[0]||""}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:"#999999" }}>Client · {c.name.toLowerCase().replace(" ",".")}@email.com</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Nav */}
      {step < 5 ? (
        <NavButtons disabled={!canNext()} onNext={() => setStep(s=>s+1)} />
      ) : (
        <div style={{ display:"flex", gap:8, padding:"14px 18px", flexShrink:0 }}>
          <button onClick={() => setStep(s=>s-1)} style={{ flex:1, border:"1px solid #d8d8d8", borderRadius:10, padding:"11px", fontSize:13, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}>← Back</button>
          <button onClick={() => go(S.EL_STATUS)} style={{ flex:1, border:"1px solid #d8d8d8", borderRadius:10, padding:"11px", fontSize:13, fontWeight:600, background:"#fff", color:"#555555", cursor:"pointer" }}>Draft</button>
          <button onClick={handleSend} disabled={sending} style={{ flex:2, border:"none", borderRadius:10, padding:"11px", fontSize:13, fontWeight:700, background: sending?"#555":"#2d2d2d", color:"#fff", cursor: sending?"default":"pointer" }}>
            {sending ? "Sending..." : "Send to Review →"}
          </button>
        </div>
      )}

    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MY SIGNATURES SCREEN
// ══════════════════════════════════════════════════════════════════
function MySignaturesScreen({ go, signatures, forms8879, signed }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [expanded, setExpanded] = useState(null);

  const now = Date.now();
  const statusColors = {
    "Signing in Process": { dot:"#ec4899", bg:"#fde7f3", text:"#ad1457" },
    "Completed": { dot:"#22c55e", bg:"#e8f7ee", text:"#1f7a3f" },
    "Cancelled": { dot:"#f4a257", bg:"#fff3e8", text:"#b7611d" },
    "Expired": { dot:"#b71c1c", bg:"#fae8e8", text:"#8f1111" },
    "Declined": { dot:"#f4a7b9", bg:"#fff0f4", text:"#b85872" },
    "Signer Authentication Failed": { dot:"#10b981", bg:"#e7faf3", text:"#0f7a58" },
  };

  const sigRows = signatures.map((s, i) => {
    const isSigned = signed.includes(s.id);
    const status = isSigned ? "Completed" : "Signing in Process";
    const updatedAt = now - s.days * 86400000 - i * 600000;
    return {
      id: `sig-${s.id}`,
      signer: s.client,
      status,
      document: s.doc,
      routingMap: "Direct",
      expirationDate: isSigned ? "Completed" : `${Math.max(1, 10 - s.days)}d left`,
      signedDocument: isSigned ? `${s.client.split(" ")[0]}_${s.type}.pdf` : "Pending",
      cancelledBy: "-",
      cancelledDate: "-",
      envelopeId: `ENV-${100000 + s.id}`,
      history: isSigned ? "Signed by client" : `Waiting ${s.days} day${s.days > 1 ? "s" : ""}`,
      updatedAt,
      actionSig: { id: s.id, client: s.client, doc: s.doc, type: s.type, days: s.days },
    };
  });

  const formRows = forms8879.map((f, i) => {
    const localId = `form_${f.id}`;
    const localSigned = signed.includes(localId);
    const baseStatusMap = {
      pending: "Signing in Process",
      signed: "Completed",
      failed: "Signer Authentication Failed",
    };
    const status = localSigned ? "Completed" : (baseStatusMap[f.status] || "Signing in Process");
    const updatedAt = now - (i + 1) * 3600000;
    return {
      id: `f8879-${f.id}`,
      signer: f.client,
      status,
      document: `8879 e-file Authorization (${f.jurisdiction})`,
      routingMap: "Email + SMS",
      expirationDate: status === "Completed" ? "Completed" : "Awaiting signature",
      signedDocument: status === "Completed" ? `8879_${f.client.replace(/\s+/g, "_")}.pdf` : "Pending",
      cancelledBy: "-",
      cancelledDate: "-",
      envelopeId: `ENV-${300000 + f.id}`,
      history: `Sent ${f.sent}`,
      updatedAt,
      actionSig: { id: localId, client: f.client, doc: `8879 — ${f.jurisdiction}`, type: "8879", days: 0 },
    };
  });

  const rows = [...sigRows, ...formRows];

  const statuses = [
    "All",
    "Signing in Process",
    "Completed",
    "Cancelled",
    "Expired",
    "Declined",
    "Signer Authentication Failed",
  ];

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? rows.length : rows.filter(r => r.status === s).length;
    return acc;
  }, {});

  const q = query.trim().toLowerCase();
  let filtered = rows.filter(r => {
    const matchesStatus = statusFilter === "All" ? true : r.status === statusFilter;
    const matchesQuery = !q
      ? true
      : `${r.signer} ${r.document} ${r.envelopeId} ${r.status}`.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "Oldest") return a.updatedAt - b.updatedAt;
    if (sortBy === "Status") return a.status.localeCompare(b.status);
    return b.updatedAt - a.updatedAt; // Newest
  });

  return (
    <div style={{ flex:1 }}>
      <Header title="My Signatures" sub={`${counts["Signing in Process"]} in process`} back onBack={() => go(S.HOME)} />
      <div style={{ padding:"12px 14px 20px" }}>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:10 }}>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                border: statusFilter === s ? "1px solid #2d2d2d" : "1px solid #dddddd",
                background: statusFilter === s ? "#2d2d2d" : "#fff",
                color: statusFilter === s ? "#fff" : "#555555",
                borderRadius:99,
                padding:"7px 10px",
                fontSize:10,
                fontWeight:700,
                whiteSpace:"nowrap",
                cursor:"pointer",
              }}
            >
              {s} {counts[s]}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <div style={{ flex:1, background:"#fff", border:"1px solid #dddddd", borderRadius:10, padding:"8px 10px", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#999999", fontSize:12 }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search signer, document, envelope..."
              style={{ border:"none", outline:"none", width:"100%", fontSize:12, background:"transparent", color:"#333333" }}
            />
          </div>
          <button
            onClick={() => setSortBy((v) => v === "Newest" ? "Oldest" : v === "Oldest" ? "Status" : "Newest")}
            style={{ border:"1px solid #dddddd", background:"#fff", borderRadius:10, padding:"0 11px", fontSize:10, fontWeight:700, color:"#555555", cursor:"pointer", whiteSpace:"nowrap" }}
          >
            {sortBy}
          </button>
        </div>

        <div style={{ background:"#fff", border:"1px solid #dddddd", borderRadius:12, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.25fr 0.75fr 0.75fr", gap:8, padding:"8px 10px", background:"#f6f7fb", borderBottom:"1px solid #ececec" }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:0.7, color:"#888888" }}>SIGNER</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:0.7, color:"#888888" }}>STATUS</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:0.7, color:"#888888", textAlign:"right" }}>ACTION</span>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding:"18px 12px", textAlign:"center", color:"#777777", fontSize:12 }}>
              No signatures found for this filter.
            </div>
          )}

          {filtered.map((row, idx) => {
            const tone = statusColors[row.status] || statusColors["Signing in Process"];
            const isOpen = expanded === row.id;
            const needsSign = row.status === "Signing in Process" || row.status === "Signer Authentication Failed";
            return (
              <div key={row.id} style={{ borderTop: idx > 0 ? "1px solid #f0f0f0" : "none", padding:"10px 10px 11px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1.25fr 0.75fr 0.75fr", gap:8, alignItems:"center" }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#1f1f1f", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.signer}</div>
                    <div style={{ fontSize:10.5, color:"#666666", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.document}</div>
                  </div>
                  <div style={{ justifySelf:"start", display:"inline-flex", alignItems:"center", gap:6, background:tone.bg, color:tone.text, borderRadius:99, padding:"4px 8px", maxWidth:"100%" }}>
                    <span style={{ width:6, height:6, borderRadius:99, background:tone.dot, flexShrink:0 }} />
                    <span style={{ fontSize:9.5, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.status}</span>
                  </div>
                  <button
                    onClick={() => needsSign ? go(S.SIGN_DOC, { sig: row.actionSig }) : setExpanded(isOpen ? null : row.id)}
                    style={{ justifySelf:"end", border:"none", background:"#2563eb", color:"#fff", borderRadius:7, padding:"7px 12px", fontSize:10.5, fontWeight:700, cursor:"pointer" }}
                  >
                    {needsSign ? "Sign" : "View"}
                  </button>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
                  <div style={{ background:"#fafafa", border:"1px solid #efefef", borderRadius:8, padding:"7px 8px" }}>
                    <div style={{ fontSize:9, color:"#9a9a9a", marginBottom:2 }}>Expiration Date</div>
                    <div style={{ fontSize:10.5, color:"#333333", fontWeight:600 }}>{row.expirationDate}</div>
                  </div>
                  <div style={{ background:"#fafafa", border:"1px solid #efefef", borderRadius:8, padding:"7px 8px" }}>
                    <div style={{ fontSize:9, color:"#9a9a9a", marginBottom:2 }}>Envelope ID</div>
                    <div style={{ fontSize:10.5, color:"#333333", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.envelopeId}</div>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(isOpen ? null : row.id)}
                  style={{ marginTop:7, border:"none", background:"transparent", color:"#666666", fontSize:10.5, fontWeight:600, padding:0, cursor:"pointer" }}
                >
                  {isOpen ? "Hide details" : "Show details"}
                </button>

                {isOpen && (
                  <div style={{ marginTop:7, background:"#f8f8f8", border:"1px solid #ececec", borderRadius:8, padding:"8px 9px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <div>
                      <div style={{ fontSize:9, color:"#9a9a9a" }}>Routing Map</div>
                      <div style={{ fontSize:10.5, color:"#333333", fontWeight:600 }}>{row.routingMap}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:"#9a9a9a" }}>Signed Document</div>
                      <div style={{ fontSize:10.5, color:"#333333", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.signedDocument}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:"#9a9a9a" }}>Cancelled By</div>
                      <div style={{ fontSize:10.5, color:"#333333", fontWeight:600 }}>{row.cancelledBy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:9, color:"#9a9a9a" }}>Cancelled Date</div>
                      <div style={{ fontSize:10.5, color:"#333333", fontWeight:600 }}>{row.cancelledDate}</div>
                    </div>
                    <div style={{ gridColumn:"1 / -1" }}>
                      <div style={{ fontSize:9, color:"#9a9a9a" }}>History</div>
                      <div style={{ fontSize:10.5, color:"#333333", fontWeight:600 }}>{row.history}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SIGN DOC SCREEN
// ══════════════════════════════════════════════════════════════════
function SignDocScreen({ go, ctx, sign, signed }) {
  const s = ctx.sig; if (!s) return null;
  const isSigned = signed.includes(s.id);
  const handleSign = () => {
    sign(s.id);
    if (s.type === "EL") go(S.HOME);
  };
  return (
    <div style={{ flex:1 }}>
      <Header title="Review & Sign" sub={s.client} back onBack={() => go(S.MY_SIGNATURES)} />
      <div style={{ padding:"14px 18px 20px" }}>
        <div style={{ background:"#f6f6f6", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
          <div style={{ fontSize:11, color:"#999999" }}>Client</div>
          <div style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{s.client}</div>
          <div style={{ fontSize:11, color:"#999999", marginTop:6 }}>Document</div>
          <div style={{ fontWeight:600, fontSize:13, color:"#1a1a1a" }}>{s.doc}</div>
        </div>
        <div style={{ background:"#fff", border:"1px solid #d8d8d8", borderRadius:12, padding:18, marginBottom:14, minHeight:200 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:10 }}>Tax Compliance Services</div>
          {[100,100,80,100,65,90,70].map((w,i) => <div key={i} style={{ height:9, background:"#f2f2f2", borderRadius:4, marginBottom:7, width:`${w}%` }} />)}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:10, color:"#999999", marginBottom:5 }}>Signature required</div>
            <div style={{ border: isSigned?"2px solid #4a4a4a":"2px dashed #c0c0c0", borderRadius:8, padding:14, background: isSigned?"#f0f0f0":"#fafafa", display:"flex", alignItems:"center", justifyContent:"center", color: isSigned?"#4a4a4a":"#999999", fontWeight: isSigned?700:400, fontSize: isSigned?15:12 }}>
              {isSigned ? "✓ Signed" : "[ Signature field ]"}
            </div>
          </div>
        </div>
        {!isSigned
          ? <button onClick={handleSign} style={{ width:"100%", border:"none", borderRadius:12, padding:14, background:"#2d2d2d", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>Sign Document</button>
          : <button style={{ width:"100%", border:"none", borderRadius:12, padding:14, background:"#f0f0f0", color:"#4a4a4a", fontWeight:700, fontSize:14, cursor:"default" }}>✓ Signed</button>
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 8879 SCREEN
// ══════════════════════════════════════════════════════════════════
function Form8879Screen({ go, forms8879, reminded, remind, sign, signed }) {
  const [tab, setTab] = useState("All");
  const filtered = forms8879.filter(f => tab==="All" ? true : f.status === tab.toLowerCase());
  return (
    <div style={{ flex:1 }}>
      <Header title="8879 e-file" sub="Authorization status" back onBack={() => go(S.HOME)} />
      <div style={{ display:"flex", gap:6, padding:"10px 18px 4px" }}>
        {["All","Pending","Signed","Failed"].map(x => (
          <button key={x} onClick={() => setTab(x)} style={{ border:"none", borderRadius:99, padding:"5px 11px", fontSize:11, fontWeight:600, cursor:"pointer", background: tab===x?"#2d2d2d":"#f2f2f2", color: tab===x?"#fff":"#777777" }}>{x}</button>
        ))}
      </div>
      <div style={{ padding:"8px 18px 20px" }}>
        {filtered.map(f => (
          <div key={f.id} style={{ background:"#fff", borderRadius:14, padding:14, marginBottom:10, border: f.status==="failed"?"1px solid #c8c8c8":"1px solid #d8d8d8" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{f.client}</div>
                <div style={{ fontSize:11, color:"#999999", marginTop:2 }}>{f.jurisdiction}</div>
                <div style={{ fontSize:11, color:"#999999" }}>Sent {f.sent}</div>
              </div>
              <StatusPill status={f.status} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {f.status === "pending" && (
                <button onClick={() => remind(f.id)} style={{ flex:1, border:"none", borderRadius:9, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", background: reminded.includes(f.id)?"#e8e8e8":"#f2f2f2", color: reminded.includes(f.id)?"#4a4a4a":"#555555" }}>
                  {reminded.includes(f.id) ? "✓ Reminded" : "Send Reminder"}
                </button>
              )}
              {(f.status === "pending" || f.status === "signed") && !signed.includes(f.id) && (
                <button onClick={() => go(S.SIGN_DOC, { sig:{ id:f.id+"_cpa", client:f.client, doc:`8879 — ${f.jurisdiction}`, type:"8879", days:0 }})} style={{ flex:1, border:"none", borderRadius:9, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", background:"#2d2d2d", color:"#fff" }}>
                  My Signature
                </button>
              )}
              {f.status === "failed" && (
                <button style={{ flex:1, border:"none", borderRadius:9, padding:"8px", fontSize:12, fontWeight:600, cursor:"pointer", background:"#ebebeb", color:"#444444" }}>
                  View Error
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// BATCH EXTENSIONS
// ══════════════════════════════════════════════════════════════════
function BatchExtScreen({ go, extensions, clients }) {
  return (
    <div style={{ flex:1 }}>
      <Header title="Batch Extensions" sub="Filing status" back onBack={() => go(S.HOME)} />
      <div style={{ padding:"12px 18px 20px" }}>
        <div style={{ background:"#f4f4f4", border:"1px solid #d0d0d0", borderRadius:12, padding:"11px 14px", marginBottom:14, display:"flex", gap:10 }}>
          <span style={{ fontSize:16 }}>ℹ️</span>
          <div style={{ fontSize:12, color:"#555555" }}>Submitting batch extensions requires desktop. Here you can view status and handle issues.</div>
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, marginBottom:8 }}>BY CLIENT</div>
        {clients.filter(c => extensions.some(e => e.client === c.name)).map(c => {
          const exts = extensions.filter(e => e.client === c.name);
          const hasIssue = exts.some(e => e.status === "rejected");
          return (
            <div key={c.id} onClick={() => go(S.BATCH_EXT_STATUS, { client:c })} style={{ background:"#fff", border: hasIssue?"1px solid #c8c8c8":"1px solid #d8d8d8", borderRadius:14, padding:13, marginBottom:10, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{c.name}</div>
                {hasIssue && <span style={{ fontSize:10, fontWeight:700, background:"#ebebeb", color:"#444444", borderRadius:4, padding:"2px 7px" }}>Issue</span>}
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {exts.map(e => (
                  <div key={e.id} style={{ display:"flex", alignItems:"center", gap:4, background:"#f6f6f6", borderRadius:6, padding:"3px 8px" }}>
                    <div style={{ width:6, height:6, borderRadius:99, background: e.status==="filed"?"#8a8a8a":e.status==="rejected"?"#555555":"#666666" }} />
                    <span style={{ fontSize:11, color:"#555555" }}>{e.jurisdiction}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Batch Ext Status ──────────────────────────────────────────────
function BatchExtStatusScreen({ go, extensions, ctx, reminded, remind }) {
  const clientName = ctx.client?.name;
  const exts = clientName ? extensions.filter(e => e.client === clientName) : extensions;
  return (
    <div style={{ flex:1 }}>
      <Header title="Extension Status" sub={clientName || "All"} back onBack={() => go(S.BATCH_EXT)} />
      <div style={{ padding:"12px 18px 20px" }}>
        {exts.map(e => (
          <div key={e.id} style={{ background:"#fff", border: e.status==="rejected"?"1px solid #c8c8c8":"1px solid #d8d8d8", borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: e.status==="rejected"?8:0 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a" }}>{e.client}</div>
                <div style={{ fontSize:11, color:"#999999" }}>{e.jurisdiction} · Due {e.deadline}</div>
              </div>
              <StatusPill status={e.status} />
            </div>
            {e.status === "rejected" && (
              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button onClick={() => remind(e.id)} style={{ flex:1, border:"none", borderRadius:8, padding:"7px", fontSize:11, fontWeight:600, cursor:"pointer", background: reminded.includes(e.id)?"#e8e8e8":"#f2f2f2", color: reminded.includes(e.id)?"#4a4a4a":"#555555" }}>
                  {reminded.includes(e.id)?"✓ Notified":"Notify Client"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAX RETURN PROGRESS
// ── Audit Log ─────────────────────────────────────────────────────
function AuditLogScreen({ go, ctx, auditLog }) {
  const c = ctx.client;
  return (
    <div style={{ flex:1 }}>
      <Header title="Audit Log" sub={c?.name} back onBack={() => go(S.CLIENT_DETAIL, { client:c })} />
      <div style={{ padding:"12px 18px 20px" }}>
        {auditLog.map((entry, i) => (
          <div key={entry.id} style={{ display:"flex", gap:12, paddingBottom:14, borderLeft:"2px solid #d8d8d8", marginLeft:8, paddingLeft:14, position:"relative" }}>
            <div style={{ position:"absolute", left:-5, top:0, width:10, height:10, borderRadius:99, background: entry.who==="System"?"#999999":entry.who==="CPA"?"#2d2d2d":"#555555", border:"2px solid #f0f0f0" }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13, color:"#1a1a1a" }}>{entry.action}</div>
              <div style={{ fontSize:12, color:"#777777", marginTop:1 }}>{entry.detail}</div>
              <div style={{ fontSize:10, color:"#999999", marginTop:3 }}>{entry.who} · {entry.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CHAT TOPICS SCREEN (Telegram-style branches)
// ══════════════════════════════════════════════════════════════════
function ChatTopicsScreen({ go, ctx, chatMsgs, openTopic }) {
  const chat = ctx.chat; if (!chat) return null;
  const topics = chat.topics || [];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      {/* Header — same dark style as chat */}
      <div style={{ background:"#2d2d2d", padding:"12px 16px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:12 }}>
          <button onClick={() => go(S.MESSAGING)} style={{ border:"none", background:"none", cursor:"pointer", color:"#b0b0b0", fontSize:20, padding:0 }}>←</button>
          <div style={{ position:"relative" }}>
            <div style={{ width:40, height:40, borderRadius: chat.type==="Internal"?10:99, background:"rgba(255,255,255,0.18)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:15 }}>{chat.name[0]}</div>
            {chat.online && <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:99, background:"#8a8a8a", border:"2px solid #2d2d2d" }} />}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{chat.name}</div>
            <div style={{ color:"#b0b0b0", fontSize:10 }}>{topics.length} topics · {chat.type}</div>
          </div>
        </div>

        <div style={{ height:1, background:"rgba(255,255,255,0.08)", marginTop:2 }} />
      </div>

      {/* Topics list */}
      <div style={{ flex:1, overflowY:"auto", background:"#f0f0f0" }}>
        {topics.map((topic, i) => {
          const key = `${chat.id}_${topic.id}`;
          const msgs = chatMsgs[key] || topic.msgs || [];
          const last = msgs[msgs.length - 1];
          const lastText = last?.from === "event" ? `— ${last.label}` : (last?.from === "cpa" ? `You: ${last.text}` : last?.text);
          return (
            <div
              key={topic.id}
              onClick={() => openTopic(chat, topic)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"12px 16px",
                background:"#fff",
                borderBottom:"1px solid #f2f2f2",
                cursor:"pointer",
                marginTop: i === 0 ? 8 : 0,
                marginBottom: i === topics.length - 1 ? 8 : 0,
                borderRadius: i === 0 ? "12px 12px 0 0" : i === topics.length - 1 ? "0 0 12px 12px" : 0,
              }}
            >
              {/* Icon */}
              <div style={{ width:44, height:44, borderRadius:12, background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:"1px solid #e8e8e8" }}>
                {topic.icon}
              </div>
              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:2 }}>
                  <span style={{ fontWeight: topic.unread > 0 ? 700 : 600, fontSize:14, color:"#1a1a1a" }}>{topic.label}</span>
                  <span style={{ fontSize:11, color:"#b0b0b0", flexShrink:0, marginLeft:8 }}>{topic.time}</span>
                </div>
                <span style={{ fontSize:12, color:"#999999", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
                  {lastText || "No messages yet"}
                </span>
              </div>
              {/* Unread badge */}
              {topic.unread > 0
                ? <div style={{ background:"#2d2d2d", color:"#fff", borderRadius:99, minWidth:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, padding:"0 5px", flexShrink:0 }}>{topic.unread}</div>
                : <span style={{ color:"#d0d0d0", fontSize:16, flexShrink:0 }}>›</span>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MESSAGING SCREEN
// ══════════════════════════════════════════════════════════════════
function MessagingScreen({ go, chats, chatUnread, chatMsgs, openChat }) {
  const [q, setQ] = useState("");
  const filtered = chats.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));

  // Group: internal vs clients
  const internal = filtered.filter(c => c.type === "Internal");
  const clientChats = filtered.filter(c => c.type !== "Internal");

  const ChatRow = ({ chat }) => {
    const unread = chatUnread[chat.id] || 0;
    // Get last message from the most recently active topic
    const allMsgs = (chat.topics || []).flatMap(t => chatMsgs[`${chat.id}_${t.id}`] || t.msgs || []);
    const last = allMsgs[allMsgs.length - 1];
    const lastText = last?.from === "event" ? last.label : last?.text;
    const lastTime = last?.time || chat.time;
    return (
      <div onClick={() => openChat(chat)} style={{ display:"flex", alignItems:"center", gap:11, padding:"12px 18px", borderBottom:"1px solid #f2f2f2", cursor:"pointer", background:"#fff" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <div style={{ width:44, height:44, borderRadius: chat.type==="Internal"?12:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:16 }}>{chat.name[0]}</div>
          {chat.online && <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:99, background:"#8a8a8a", border:"2px solid #fff" }} />}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight: unread>0?700:600, fontSize:14, color:"#1a1a1a" }}>{chat.name}</span>
            <span style={{ fontSize:11, color: unread>0?"#555555":"#999999" }}>{lastTime}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:2 }}>
            <span style={{ fontSize:12, color: unread>0?"#555555":"#999999", fontWeight: unread>0?500:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>
              {last?.from==="cpa" ? `You: ${lastText}` : lastText}
            </span>
            {unread>0 && <div style={{ background:"#555555", color:"#fff", borderRadius:99, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, padding:"0 4px", flexShrink:0 }}>{unread}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex:1 }}>
      <Header title="Messages" sub={`${chats.length} conversations`} search={q} onSearch={setQ} searchPh="Search..." />

      <div style={{ paddingTop:12 }}>
        {internal.length > 0 && (
          <>
            <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, padding:"0 18px 4px" }}>TEAM</div>
            {internal.map(c => <ChatRow key={c.id} chat={c} />)}
          </>
        )}
        <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, padding: internal.length > 0 ? "10px 18px 4px" : "0 18px 4px" }}>CLIENTS</div>
        {clientChats.map(c => <ChatRow key={c.id} chat={c} />)}
      </div>
    </div>
  );
}

// ── Chat Screen ───────────────────────────────────────────────────
function ChatScreen({ go, ctx, chatMsgs, sendMsg }) {
  const [input, setInput] = useState("");
  const [expandedLog, setExpandedLog] = useState(null);
  const chat = ctx.chat; if (!chat) return null;
  const topic = ctx.topic || chat.topics?.[0];
  const key = topic ? `${chat.id}_${topic.id}` : chat.id;
  const msgs = chatMsgs[key] || topic?.msgs || [];
  const handle = () => { if (!input.trim()) return; sendMsg(key, input.trim()); setInput(""); };
  const quick = ["Documents received","Please upload missing docs","Return ready for review","Reminder: sign 8879"];
  const backScreen = chat.topics?.length > 1 ? S.CHAT_TOPICS : S.MESSAGING;

  const eventIcon  = { upload:"↑", sign:"✓", step:"→", payment:"$" };
  const eventColor = { upload:"#555555", sign:"#4a4a4a", step:"#666666", payment:"#4a4a4a" };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"#2d2d2d", padding:"12px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={() => go(backScreen, { chat })} style={{ border:"none", background:"none", cursor:"pointer", color:"#b0b0b0", fontSize:20, padding:0 }}>←</button>
        <div style={{ position:"relative" }}>
          <div style={{ width:36, height:36, borderRadius: chat.type==="Internal"?10:99, background:"rgba(255,255,255,0.2)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>{chat.name[0]}</div>
          {chat.online && <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:99, background:"#8a8a8a", border:"2px solid #2d2d2d" }} />}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{chat.name}</div>
          <div style={{ color:"#b0b0b0", fontSize:10 }}>{topic ? `${topic.icon} ${topic.label}` : (chat.online?"online":"last seen recently")}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"10px 14px", background:"#efefef", display:"flex", flexDirection:"column", gap:3 }}>
        <div style={{ textAlign:"center", fontSize:10, color:"#999999", background:"rgba(255,255,255,0.7)", borderRadius:99, padding:"2px 10px", alignSelf:"center", marginBottom:4 }}>Today</div>

        {msgs.map((m, i) => {
          // ── Event divider ──────────────────────────────────────
          if (m.from === "event") {
            const isExpanded = expandedLog === m.id;
            const icon = eventIcon[m.event] || "·";
            const col  = eventColor[m.event] || "#666666";
            return (
              <div key={m.id} style={{ margin:"10px 0", display:"flex", flexDirection:"column", alignItems:"stretch", gap:0 }}>
                {/* Divider line + pill */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1, height:1, background:"#d8d8d8" }} />
                  <div onClick={() => setExpandedLog(isExpanded ? null : m.id)} style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #d8d8d8", borderRadius:99, padding:"3px 10px 3px 7px", cursor:"pointer", flexShrink:0 }}>
                    <div style={{ width:16, height:16, borderRadius:99, background:col, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>{icon}</div>
                    <span style={{ fontSize:11, color:"#444444", fontWeight:600 }}>{m.label}</span>
                    <span style={{ fontSize:10, color:"#999999" }}>{m.time}</span>
                    <span style={{ fontSize:9, color:"#b0b0b0", marginLeft:1 }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  <div style={{ flex:1, height:1, background:"#d8d8d8" }} />
                </div>

                {/* Expanded log */}
                {isExpanded && (
                  <div style={{ margin:"6px 12px 0", background:"#fff", border:"1px solid #d8d8d8", borderRadius:10, padding:"10px 12px", display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#2d2d2d" }}>{m.label}</span>
                      <span style={{ fontSize:10, color:"#999999" }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize:11, color:"#777777" }}>{m.meta}</div>
                    {m.docId && (
                      <div onClick={() => go(S.DMS_FILE, { file: docs.find(d => d.id === m.docId) })}
                        style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"#f6f6f6", borderRadius:8, cursor:"pointer", border:"1px solid #e8e8e8" }}>
                        <span style={{ fontSize:14 }}>📄</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:11, fontWeight:600, color:"#2d2d2d" }}>{docs.find(d=>d.id===m.docId)?.name}</div>
                          <div style={{ fontSize:10, color:"#999999" }}>{docs.find(d=>d.id===m.docId)?.size}</div>
                        </div>
                        <span style={{ fontSize:11, color:"#555555", fontWeight:600 }}>Open →</span>
                      </div>
                    )}
                    <div style={{ fontSize:10, color:"#b0b0b0", borderTop:"1px solid #f2f2f2", paddingTop:6, marginTop:2 }}>
                      Logged automatically · visible in Audit Log
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // ── Regular bubble ─────────────────────────────────────
          const isCpa = m.from === "cpa";
          const prev  = i > 0 && msgs[i-1].from === m.from;
          return (
            <div key={m.id} style={{ display:"flex", justifyContent: isCpa?"flex-end":"flex-start", marginTop: prev?1:6 }}>
              {!isCpa && !prev && <div style={{ width:26, height:26, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, marginRight:5, flexShrink:0, alignSelf:"flex-end" }}>{chat.name[0]}</div>}
              {!isCpa && prev  && <div style={{ width:31 }} />}
              <div style={{ maxWidth:"72%", background: isCpa?"#2d2d2d":"#fff", color: isCpa?"#fff":"#1a1a1a", borderRadius: isCpa?(prev?"16px 4px 16px 16px":"16px 4px 4px 16px"):(prev?"4px 16px 16px 16px":"4px 16px 16px 4px"), padding:"7px 11px", boxShadow:"0 1px 2px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize:13, lineHeight:1.4 }}>{m.text}</div>
                <div style={{ fontSize:10, color: isCpa?"rgba(255,255,255,0.55)":"#999999", textAlign:"right", marginTop:2 }}>{m.time}{isCpa&&" ✓✓"}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Quick replies */}
      <div style={{ background:"#fff", borderTop:"1px solid #f2f2f2", padding:"7px 14px 0", display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", flexShrink:0 }}>
        {quick.map((q,i) => <button key={i} onClick={() => setInput(q)} style={{ border:"1.5px solid #d8d8d8", borderRadius:99, padding:"4px 10px", fontSize:10, fontWeight:500, color:"#555555", background:"#f6f6f6", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>{q}</button>)}
      </div>
      {/* Input */}
      <div style={{ background:"#fff", padding:"8px 12px 12px", display:"flex", alignItems:"flex-end", gap:8, flexShrink:0 }}>
        <div style={{ flex:1, background:"#f2f2f2", borderRadius:20, display:"flex", alignItems:"center", padding:"7px 12px", gap:6 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handle()} placeholder="Message..." style={{ flex:1, border:"none", background:"none", outline:"none", fontSize:13, color:"#1a1a1a" }} />
          <span style={{ color:"#999999", fontSize:14, cursor:"pointer" }}>📎</span>
        </div>
        <button onClick={handle} style={{ width:38, height:38, borderRadius:99, background: input.trim()?"#2d2d2d":"#d8d8d8", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ color: input.trim()?"#fff":"#999999", transform:"rotate(45deg)", display:"inline-block", fontSize:14 }}>➤</span>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DMS SCREEN
// ══════════════════════════════════════════════════════════════════
function DMSScreen({ go, docs }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const extColor = e => ({ pdf:"#555555", docx:"#555555", xlsx:"#4a4a4a" }[e]||"#777777");
  const extIcon  = e => ({ pdf:"📄", docx:"📝", xlsx:"📊" }[e]||"📄");
  const filtered = docs.filter(d => {
    const ms = d.name.toLowerCase().includes(q.toLowerCase()) || d.client.toLowerCase().includes(q.toLowerCase());
    const mf = f==="All" ? true : d.type===f;
    return ms && mf;
  });
  return (
    <div style={{ flex:1 }}>
      <Header title="Documents" sub={`${docs.length} files`} search={q} onSearch={setQ} searchPh="Search documents..."
        right={<button style={{ border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:600, cursor:"pointer" }}>+ Upload</button>}
      />
      {/* Type filters */}
      <div style={{ display:"flex", gap:6, padding:"8px 18px 4px", overflowX:"auto", scrollbarWidth:"none" }}>
        {["All","EL","8879","Return","PBC","Doc"].map(x => (
          <button key={x} onClick={() => setF(x)} style={{ border:"none", borderRadius:99, padding:"4px 11px", fontSize:11, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", background: f===x?"#2d2d2d":"#f2f2f2", color: f===x?"#fff":"#777777", flexShrink:0 }}>{x}</button>
        ))}
      </div>
      {/* Doc list */}
      <div style={{ padding:"4px 18px 20px" }}>
        {filtered.map((d,i) => (
          <div key={d.id} onClick={() => go(S.DMS_FILE, { file:d })} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i<filtered.length-1?"1px solid #f2f2f2":"none", cursor:"pointer" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:extColor(d.ext)+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{extIcon(d.ext)}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:"#999999" }}>{d.client}</span>
                <span style={{ color:"#c0c0c0" }}>·</span>
                <span style={{ fontSize:11, color:"#999999" }}>{d.size}</span>
                {d.status && <StatusPill status={d.status} />}
              </div>
            </div>
            <span style={{ color:"#999999", flexShrink:0 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DMS File ──────────────────────────────────────────────────────
function DMSFileScreen({ go, ctx }) {
  const f = ctx.file; if (!f) return null;
  return (
    <div style={{ flex:1 }}>
      <Header title={f.name.split("—")[0].trim()} sub={f.client} back onBack={() => go(S.DOCUMENTS)} />
      <div style={{ padding:"14px 18px 20px" }}>
        <div style={{ background:"#fff", border:"1px solid #d8d8d8", borderRadius:14, padding:18, marginBottom:14, display:"flex", flexDirection:"column", alignItems:"center", gap:9 }}>
          <span style={{ fontSize:40 }}>📄</span>
          <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", textAlign:"center" }}>{f.name}</div>
          <div style={{ display:"flex", gap:18 }}>
            {[{l:"Size",v:f.size},{l:"Type",v:f.type},{l:"Date",v:f.date}].map(m => (
              <div key={m.l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, color:"#999999" }}>{m.l}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#555555" }}>{m.v}</div>
              </div>
            ))}
          </div>
          {f.status && <StatusPill status={f.status} />}
        </div>
        {/* Preview */}
        <div style={{ background:"#fff", border:"1px solid #d8d8d8", borderRadius:12, padding:14, marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#999999", marginBottom:8 }}>PREVIEW</div>
          {[100,90,100,70,100,85].map((w,i) => <div key={i} style={{ height:9, background:"#f2f2f2", borderRadius:4, marginBottom:7, width:`${w}%` }} />)}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          <button style={{ width:"100%", border:"none", borderRadius:11, padding:12, background:"#2d2d2d", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>⬇ Download</button>
          <button style={{ width:"100%", border:"1.5px solid #d8d8d8", borderRadius:11, padding:12, background:"#fff", color:"#555555", fontWeight:600, fontSize:13, cursor:"pointer" }}>↗ Forward to Client / Bank</button>
        </div>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════
// METRICS SCREEN
// ══════════════════════════════════════════════════════════════════
function MetricsScreen({ go, clients }) {

  const Donut = ({ segments, size=100, stroke=12, centerLabel, centerSub }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const total = segments.reduce((a,s) => a + s.value, 0) || 1;
    let offset = 0;
    return (
      <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke} />
          {segments.map((seg, i) => {
            const dash = Math.max((seg.value / total) * circ - 1.5, 0);
            const gap  = circ - dash;
            const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap+1.5}`}
              strokeDashoffset={-offset} strokeLinecap="round" />;
            offset += (seg.value / total) * circ;
            return el;
          })}
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {centerLabel && <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", lineHeight:1 }}>{centerLabel}</div>}
          {centerSub   && <div style={{ fontSize:9,  color:"#999999", marginTop:2 }}>{centerSub}</div>}
        </div>
      </div>
    );
  };

  const Legend = ({ items }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:5, flex:1, minWidth:0 }}>
      {items.map(it => (
        <div key={it.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:99, background:it.color, flexShrink:0 }} />
          <span style={{ fontSize:9.5, color:"#555555", flex:1, lineHeight:1.3 }}>{it.label}</span>
          <span style={{ fontSize:9.5, fontWeight:700, color:"#1a1a1a" }}>{it.pct}%</span>
        </div>
      ))}
    </div>
  );

  // ── EL Status data (from clients mock)
  const elTotal = clients.length;
  const elCompleted = clients.filter(c => c.elStatus === "signed").length;
  const elStarted   = clients.filter(c => c.elStatus === "pending" || c.elStatus === "sent").length;
  const elCancelled = 0;
  const elDeclined  = 0;
  const elSegs = [
    { value:elCompleted, color:"#7c6fcd", label:"Completed",  pct: Math.round((elCompleted/elTotal)*100) },
    { value:elStarted,   color:"#4fc3f7", label:"Started",    pct: Math.round((elStarted/elTotal)*100)   },
    { value:1,           color:"#ef5350", label:"Cancelled",  pct: 8 },
    { value:1,           color:"#ffb300", label:"Declined",   pct: 8 },
  ];

  // ── Organizer data
  const orgTotal     = clients.length;
  const orgSentReview = clients.filter(c => c.step >= 4).length;
  const orgNotSent    = orgTotal - orgSentReview;
  const orgSegs = [
    { value:orgNotSent,    color:"#7c6fcd", label:"Not Sent To Review", pct: Math.round((orgNotSent/orgTotal)*100)    },
    { value:orgSentReview, color:"#4fc3f7", label:"Sent To Review",     pct: Math.round((orgSentReview/orgTotal)*100) },
  ];

  // ── E-file Federal data
  const efileSegs = [
    { value:85, color:"#26a69a", label:"Accepted",               pct:85 },
    { value:4,  color:"#42a5f5", label:"At IRS",                  pct:4  },
    { value:2,  color:"#7c6fcd", label:"Qualified",               pct:2  },
    { value:2,  color:"#ffb300", label:"Initiated",               pct:2  },
    { value:1,  color:"#ef5350", label:"Error – Not Submitted",   pct:1  },
    { value:1,  color:"#ab47bc", label:"Conditional Acceptance",  pct:1  },
  ];
  const efilePct = 85;

  // ── E-file by type (horizontal stacked bars)
  const efileByType = [
    { status:"Accepted",    bars:[{ type:"1040", v:55, c:"#7c6fcd" }, { type:"1120", v:25, c:"#ef5350" }, { type:"1041", v:10, c:"#26a69a" }] },
    { status:"At IRS",      bars:[{ type:"1040", v:3,  c:"#7c6fcd" }] },
    { status:"Initiated",   bars:[{ type:"1040", v:2,  c:"#7c6fcd" }, { type:"1120", v:1, c:"#ef5350"  }] },
    { status:"Rejected",    bars:[{ type:"1120", v:1,  c:"#ef5350" }] },
    { status:"Qualified",   bars:[{ type:"1041", v:2,  c:"#26a69a" }] },
  ];
  const maxBar = 90;

  return (
    <div style={{ flex:1, background:"#f0f0f0" }}>
      <div style={{ background:"#2d2d2d", padding:"12px 18px 14px" }}>
        <div style={{ color:"#fff", fontSize:22, fontWeight:700, marginBottom:2 }}>Metrics</div>
        <div style={{ color:"#b0b0b0", fontSize:11 }}>Tax season 2024</div>
      </div>

      <div style={{ padding:"12px 14px 24px", display:"flex", flexDirection:"column", gap:12 }}>

        {/* Row 1: EL Status + Organizer */}
        <div style={{ display:"flex", gap:10 }}>

          {/* EL Status donut */}
          <div style={{ flex:1, background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"12px 10px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#555555", marginBottom:10 }}>Engagement Letter</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
              <Donut size={90} stroke={11} segments={elSegs}
                centerLabel={`${elCompleted}`} centerSub="signed" />
            </div>
            <Legend items={elSegs.map(s=>({ label:s.label, color:s.color, pct:s.pct }))} />
          </div>

          {/* Organizer donut */}
          <div style={{ flex:1, background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"12px 10px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#555555", marginBottom:10 }}>Organizer Review</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
              <Donut size={90} stroke={11} segments={orgSegs}
                centerLabel={`${orgSentReview}`} centerSub="sent" />
            </div>
            <Legend items={orgSegs.map(s=>({ label:s.label, color:s.color, pct:s.pct }))} />
          </div>
        </div>

        {/* E-file Federal donut */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"14px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#555555", marginBottom:12 }}>Electronic Filing — Federal</div>
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <Donut size={100} stroke={12} segments={efileSegs}
              centerLabel={`${efilePct}%`} centerSub="accepted" />
            <Legend items={efileSegs.map(s=>({ label:s.label, color:s.color, pct:s.pct }))} />
          </div>
        </div>

        {/* E-file by Type — horizontal stacked bars */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e4e4e4", padding:"14px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#555555", marginBottom:4 }}>Electronic Filing — By Type</div>
          {/* Legend */}
          <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
            {[{t:"1040",c:"#7c6fcd"},{t:"1041",c:"#26a69a"},{t:"1120",c:"#ef5350"}].map(x=>(
              <div key={x.t} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:99, background:x.c }} />
                <span style={{ fontSize:9, color:"#777777" }}>{x.t}</span>
              </div>
            ))}
          </div>
          {efileByType.map((row, i) => {
            const total = row.bars.reduce((a,b)=>a+b.v,0);
            return (
              <div key={row.status} style={{ marginBottom: i<efileByType.length-1?10:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:10, color:"#555555" }}>{row.status}</span>
                  <span style={{ fontSize:10, fontWeight:600, color:"#1a1a1a" }}>{total}</span>
                </div>
                <div style={{ display:"flex", height:8, borderRadius:99, overflow:"hidden", background:"#f0f0f0" }}>
                  {row.bars.map((b,j)=>(
                    <div key={j} style={{ width:`${(b.v/maxBar)*100}%`, background:b.c, minWidth:b.v>0?4:0 }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SETTINGS SCREEN
// ══════════════════════════════════════════════════════════════════
function SettingsScreen({ go }) {
  const [notifications, setNotifications] = useState({ push:true, email:false, digest:true });
  const [digestTime, setDigestTime] = useState("8:00 AM");
  const [theme, setTheme]     = useState("system");
  const [compact, setCompact] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [autoLock, setAutoLock]   = useState("5min");

  const digestTimes = [
    "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM",
    "9:00 AM","9:30 AM","10:00 AM","12:00 PM","2:00 PM","5:00 PM","6:00 PM",
  ];

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(v=>!v)} style={{ width:40, height:22, borderRadius:99, background: val?"#2d2d2d":"#d0d0d0", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: val?19:3, width:16, height:16, borderRadius:99, background:"#fff", transition:"left 0.2s" }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:10, fontWeight:700, color:"#999999", letterSpacing:1.5, marginBottom:8 }}>{title}</div>
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e0e0e0", overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ label, sub, right, onTap, last }) => (
    <div onClick={onTap} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderBottom: last?"none":"1px solid #f4f4f4", cursor: onTap?"pointer":"default" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, color:"#1a1a1a" }}>{label}</div>
        {sub && <div style={{ fontSize:10, color:"#999999", marginTop:1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  return (
    <div style={{ flex:1 }}>
      <Header title="Settings" back onBack={() => go(S.HOME)} />
      <div style={{ padding:"14px 18px 24px" }}>

        {/* Profile */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e0e0e0", padding:"14px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:99, background:"#2d2d2d", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:18, flexShrink:0 }}>J</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>John Doe</div>
            <div style={{ fontSize:11, color:"#999999" }}>Partner · JWP·LLP</div>
            <div style={{ fontSize:11, color:"#999999" }}>john.doe@jwpllp.com</div>
          </div>
          <span style={{ color:"#d0d0d0", fontSize:16 }}>›</span>
        </div>

        {/* Notifications */}
        <Section title="NOTIFICATIONS">
          <Row label="Push Notifications" sub="Urgent alerts and reminders" right={<Toggle val={notifications.push} set={v => setNotifications(p=>({...p,push:v(p.push)}))} />} />
          {/* Daily Digest row + inline time selector */}
          <div style={{ borderBottom:"1px solid #f4f4f4" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"#1a1a1a" }}>Daily Digest</div>
                <div style={{ fontSize:10, color:"#999999", marginTop:1 }}>
                  {notifications.digest ? `Sent at ${digestTime}` : "Disabled"}
                </div>
              </div>
              <Toggle val={notifications.digest} set={v => setNotifications(p=>({...p,digest:v(p.digest)}))} />
            </div>
            {notifications.digest && (
              <div style={{ padding:"0 14px 12px" }}>
                <div style={{ fontSize:10, color:"#aaaaaa", marginBottom:6 }}>Delivery time</div>
                <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", paddingBottom:2 }}>
                  {digestTimes.map(t => (
                    <button key={t} onClick={() => setDigestTime(t)} style={{
                      border:"none", borderRadius:99, padding:"5px 11px", fontSize:11, fontWeight:600,
                      background: digestTime===t ? "#2d2d2d" : "#f2f2f2",
                      color: digestTime===t ? "#fff" : "#777777",
                      cursor:"pointer", flexShrink:0, whiteSpace:"nowrap",
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Row label="Instant Email" sub="Every notification by email" right={<Toggle val={notifications.email} set={v => setNotifications(p=>({...p,email:v(p.email)}))} />} last />
        </Section>

        {/* Appearance */}
        <Section title="APPEARANCE">
          <Row label="Theme" sub="System default" right={
            <div style={{ display:"flex", gap:4 }}>
              {["light","dark","system"].map(t=>(
                <button key={t} onClick={()=>setTheme(t)} style={{ border:"none", borderRadius:7, padding:"4px 9px", fontSize:10, fontWeight:600, background: theme===t?"#2d2d2d":"#f0f0f0", color: theme===t?"#fff":"#777777", cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
              ))}
            </div>
          } />
          <Row label="Compact View" sub="Denser lists and cards" right={<Toggle val={compact} set={setCompact} />} last />
        </Section>

        {/* Security */}
        <Section title="SECURITY">
          <Row label="Biometric Login" sub="Face ID / Touch ID" right={<Toggle val={biometric} set={setBiometric} />} />
          <Row label="Auto-lock" sub="Lock app after inactivity" right={
            <div style={{ display:"flex", gap:4 }}>
              {["1min","5min","15min"].map(t=>(
                <button key={t} onClick={()=>setAutoLock(t)} style={{ border:"none", borderRadius:7, padding:"4px 8px", fontSize:10, fontWeight:600, background: autoLock===t?"#2d2d2d":"#f0f0f0", color: autoLock===t?"#fff":"#777777", cursor:"pointer" }}>{t}</button>
              ))}
            </div>
          } last />
        </Section>

        {/* Firm */}
        <Section title="FIRM">
          <Row label="Tax Season" sub="Jan 1 — Apr 15, 2024" right={<span style={{ fontSize:11, color:"#999999" }}>›</span>} onTap={()=>{}} />
          <Row label="Team Members" sub="6 active" right={<span style={{ fontSize:11, color:"#999999" }}>›</span>} onTap={()=>{}} />
          <Row label="Connected Software" sub="CCH Axcess, UltraTax" right={<span style={{ fontSize:11, color:"#999999" }}>›</span>} onTap={()=>{}} last />
        </Section>

        {/* About */}
        <Section title="ABOUT">
          <Row label="TaxLivery Mobile" sub="Version 1.0.0 (prototype)" right={null} />
          <Row label="Privacy Policy" right={<span style={{ fontSize:11, color:"#999999" }}>›</span>} onTap={()=>{}} />
          <Row label="Sign Out" right={null} onTap={()=>{}} last />
        </Section>

      </div>
    </div>
  );
}
