import { TAB, UI } from "../constants/appConstants";

// Shared presentational components

export const TypeBadge = ({ type }) => {
  const map = { "1040":["#555555","#e8e8e8"], "1041":["#555555","#ebebeb"], Entity:["#4a4a4a","#e8e8e8"], Internal:["#777777","#f2f2f2"], AI:["#1e66f5","#dbe8ff"] };
  const [c, bg] = map[type] || ["#777777","#f2f2f2"];
  return <span style={{ fontSize:9, fontWeight:700, color:c, background:bg, borderRadius:4, padding:"2px 6px", letterSpacing:0.3 }}>{type}</span>;
};

export const RiskDot = ({ risk }) => {
  const c = { high:"#555555", med:"#666666", low:"#8a8a8a" }[risk] || "#999999";
  return <div style={{ width:8, height:8, borderRadius:99, background:c, flexShrink:0 }} title={risk} />;
};

export const StepBar = ({ step, total }) => (
  <div style={{ display:"flex", gap:2 }}>
    {Array.from({length:total}).map((_,i) => (
      <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i < step ? UI.brand : "#d8d8d8" }} />
    ))}
  </div>
);

export const StatusPill = ({ status }) => {
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

export const Btn = ({ label, color=UI.brand, textColor="#fff", outline, onClick, full, small }) => (
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

export const CardChevron = () => (
  <span
    style={{
      width:20,
      height:20,
      display:"inline-flex",
      alignItems:"center",
      justifyContent:"center",
      color:"#9ca3af",
      fontSize:19,
      lineHeight:1,
      fontWeight:600,
      flexShrink:0,
    }}
  >
    ›
  </span>
);

export const IOSCard = ({ children, style, padding, overflow="visible" }) => (
  <div
    style={{
      background:"#fff",
      border:"1px solid #e3e6ee",
      borderRadius:16,
      boxShadow:"0 1px 2px rgba(15,23,42,0.06)",
      overflow,
      ...(padding !== undefined ? { padding } : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

export const IOSActionButton = ({ label, primary=false, onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      width:"100%",
      border: primary ? "none" : "1.5px solid #d3d7e0",
      borderRadius:13,
      padding:"12px 0",
      background: primary ? "#0065FF" : "#fff",
      color: primary ? "#fff" : "#525866",
      fontSize:13.5,
      fontWeight:700,
      letterSpacing:0.1,
      cursor:"pointer",
      ...style,
    }}
  >
    {label}
  </button>
);

// ─── Header ───────────────────────────────────────────────────────
export const HeaderBellIcon = ({ size=14, color="#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7.8 9.2a4.2 4.2 0 0 1 8.4 0V12c0 1.5.5 2.8 1.5 3.8l.6.6H5.7l.6-.6c1-1 1.5-2.3 1.5-3.8V9.2Z" />
    <path d="M10.2 18.2a2 2 0 0 0 3.6 0" />
  </svg>
);

export const HeaderUserIcon = ({ size=14, color="#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.2 19.2c0-3.4 3-5.6 6.8-5.6s6.8 2.2 6.8 5.6" />
  </svg>
);

export const HeaderIconButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      border:"none",
      background:"rgba(255,255,255,0.16)",
      width:28,
      height:28,
      borderRadius:99,
      cursor:"pointer",
      color:"#fff",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      padding:0,
    }}
  >
    {children}
  </button>
);

export const HeaderIcons = () => (
  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
    <HeaderIconButton><HeaderBellIcon /></HeaderIconButton>
    <HeaderIconButton><HeaderUserIcon /></HeaderIconButton>
  </div>
);

export const Header = ({ title, sub, back, onBack, right, search, onSearch, onSearchTap, searchPh }) => (
  <div style={{ background:UI.brand, flexShrink:0, paddingBottom: search !== undefined ? 14 : 0 }}>
    <div style={{ padding:"12px 18px 10px", display:"flex", alignItems:"center", gap:10 }}>
      {back && (
        <button onClick={onBack} style={{ border:"none", background:"rgba(255,255,255,0.18)", width:30, height:30, borderRadius:99, cursor:"pointer", color:"#fff", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
      )}
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"#fff", lineHeight:1.2 }}>{title}</div>
        {sub && <div style={{ fontSize:11, color: UI.brandSoft, marginTop:1 }}>{sub}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {right}
        <HeaderIcons />
      </div>
    </div>
    {search !== undefined && (
      onSearchTap ? (
        <button
          onClick={onSearchTap}
          style={{ width:"calc(100% - 36px)", margin:"0 18px", background:"#fff", borderRadius:10, border:"1px solid rgba(255,255,255,0.35)", display:"flex", alignItems:"center", padding:"8px 12px", gap:7, cursor:"pointer", textAlign:"left" }}
        >
          <span style={{ color: UI.muted, fontSize:12 }}>🔍</span>
          <span style={{ color: search ? UI.text : UI.muted, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{search || (searchPh||"Search...")}</span>
        </button>
      ) : (
        <div style={{ margin:"0 18px", background:"#fff", borderRadius:10, border:"1px solid rgba(255,255,255,0.35)", display:"flex", alignItems:"center", padding:"8px 12px", gap:7 }}>
          <span style={{ color: UI.muted, fontSize:12 }}>🔍</span>
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder={searchPh||"Search..."} style={{ background:"none", border:"none", outline:"none", color: UI.text, fontSize:13, flex:1 }} />
        </div>
      )
    )}
  </div>
);

// ─── Bottom Nav ───────────────────────────────────────────────────
export const BottomNav = ({ tab, setTab, totalUnread }) => {
  const tabs = [
    { id:TAB.HOME,      icon:"home", label:"Home"      },
    { id:TAB.CLIENTS,   icon:"clients", label:"Clients"   },
    { id:TAB.STAFFING,  icon:"staffing", label:"Staffing" },
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
    if (name === "staffing") {
      return (
        <svg {...common}>
          <rect x="4" y="11" width="3.5" height="9" rx="1.2" />
          <rect x="10.25" y="7" width="3.5" height="13" rx="1.2" />
          <rect x="16.5" y="4" width="3.5" height="16" rx="1.2" />
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
