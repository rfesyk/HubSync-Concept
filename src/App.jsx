import { useEffect, useRef, useState } from "react";
import { S, TAB, UI } from "./constants/appConstants";
import { auditLog, chats, clients, docs, extensions, forms8879, signatures } from "./data/mockData";
import { BottomNav } from "./components/sharedUI";
import {
  AuditLogScreen,
  BatchExtScreen,
  BatchExtStatusScreen,
  ChatScreen,
  ChatTopicsScreen,
  ClientDetailScreen,
  ClientsScreen,
  DMSScreen,
  DMSFileScreen,
  ELStatusScreen,
  ELWizardScreen,
  Form8879Screen,
  GlobalSearchScreen,
  HomeScreen,
  HomeSearchScreen,
  MessagingScreen,
  MetricsScreen,
  MySignaturesScreen,
  SettingsScreen,
  SignDocScreen,
} from "./screens/appScreens";

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
  const scrollRef = useRef(null);
  const pullStartYRef = useRef(null);
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [homeSearch, setHomeSearch] = useState("");
  const [homeScrollTop, setHomeScrollTop] = useState(0);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const mousePullActiveRef = useRef(false);
  const PULL_REFRESH_THRESHOLD = 90;

  const totalUnread = Object.values(chatUnread).reduce((a,b) => a+b, 0);

  const go = (s, data={}) => {
    const nextScreen = s === S.STAFFING ? S.CLIENTS : s;
    setCtx(data);
    setScreen(nextScreen);
    const screenToTab = {
      [S.HOME]: TAB.HOME,
      [S.CLIENTS]: TAB.CLIENTS,
      [S.MESSAGING]: TAB.MESSAGING,
      [S.DOCUMENTS]: TAB.DOCUMENTS,
    };
    if (screenToTab[nextScreen]) setTab(screenToTab[nextScreen]);
  };
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
  const nowTime = () => new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  const aiReplyFor = (text) => {
    const q = text.toLowerCase();
    if (q.includes("blocker") || q.includes("critical") || q.includes("risk")) {
      return "Top risk right now: XYZ Company (critical blocker) and Umbrella Corp (critical blocker). Clear those first to protect SLA.";
    }
    if (q.includes("sign") || q.includes("signature") || q.includes("8879")) {
      return "Signature queue: 5 pending. Prioritize Tiffany Trust (8879, 1d waiting), then Drake Maye (EL, 3d waiting).";
    }
    if (q.includes("staff") || q.includes("capacity") || q.includes("partner")) {
      return "Staff load is currently optimal at 3.0 per partner. No rebalance needed today; keep focus on client blockers.";
    }
    if (q.includes("priorit") || q.includes("focus") || q.includes("today")) {
      return "Recommended order: 1) critical blockers, 2) signatures over 3 days, 3) upload bottlenecks in Info Received.";
    }
    if (q.includes("remind") || q.includes("follow")) {
      return "I can draft reminders in one batch. Suggested set: John Doe, Umbrella Corp, and XYZ Company.";
    }
    return "I can help with prioritization, blockers, signatures, staffing load, or client-level next actions. What do you want to optimize first?";
  };
  const sendMsg = (key, text, chat) => {
    const msg = { id:Date.now(), from:"cpa", text, time: nowTime() };
    setChatMsgs(p => ({ ...p, [key]: [...(p[key]||[]), msg] }));
    if (chat?.type === "AI") {
      const aiMsg = { id:Date.now() + 1, from:"ai", text: aiReplyFor(text), time: nowTime() };
      setTimeout(() => {
        setChatMsgs(p => ({ ...p, [key]: [...(p[key]||[]), aiMsg] }));
      }, 420);
    }
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
  const isHomePullEnabled = screen === S.HOME && !overlayOpen;
  const isInteractiveTarget = (target) => !!target?.closest?.("button,input,textarea,select,a,label");
  const handleScroll = (e) => {
    if (screen !== S.HOME) return;
    setHomeScrollTop(e.currentTarget.scrollTop || 0);
  };

  const handlePullStart = (e) => {
    if (!isHomePullEnabled || pullRefreshing) return;
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollTop > 0) return;
    pullStartYRef.current = e.touches[0].clientY;
    pullDistanceRef.current = 0;
  };

  const handlePullMove = (e) => {
    if (pullStartYRef.current == null || !isHomePullEnabled || pullRefreshing) return;
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollTop > 0) return;
    const dy = e.touches[0].clientY - pullStartYRef.current;
    if (dy <= 0) {
      pullDistanceRef.current = 0;
      setPullDistance(0);
      return;
    }
    const nextDistance = Math.min(140, dy * 0.55);
    pullDistanceRef.current = nextDistance;
    setPullDistance(nextDistance);
    if (nextDistance > 0) e.preventDefault();
  };

  const handlePullEnd = () => {
    if (pullStartYRef.current == null) return;
    pullStartYRef.current = null;
    const distance = pullDistanceRef.current;
    pullDistanceRef.current = 0;
    if (distance >= PULL_REFRESH_THRESHOLD && !pullRefreshing) {
      setPullRefreshing(true);
      setTimeout(() => {
        setPullRefreshing(false);
        showToast("Home refreshed ✓");
      }, 900);
    }
    setPullDistance(0);
  };

  const handleMousePullStart = (e) => {
    if (e.button !== 0 || !isHomePullEnabled || pullRefreshing) return;
    if (isInteractiveTarget(e.target)) return;
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollTop > 0) return;
    pullStartYRef.current = e.clientY;
    pullDistanceRef.current = 0;
    mousePullActiveRef.current = true;
  };

  const handleMousePullMove = (e) => {
    if (!mousePullActiveRef.current || pullStartYRef.current == null || !isHomePullEnabled || pullRefreshing) return;
    const scroller = scrollRef.current;
    if (!scroller || scroller.scrollTop > 0) return;
    const dy = e.clientY - pullStartYRef.current;
    if (dy <= 0) {
      pullDistanceRef.current = 0;
      setPullDistance(0);
      return;
    }
    const nextDistance = Math.min(140, dy * 0.55);
    pullDistanceRef.current = nextDistance;
    setPullDistance(nextDistance);
    if (nextDistance > 0) e.preventDefault();
  };

  const handleMousePullEnd = () => {
    if (!mousePullActiveRef.current && pullStartYRef.current == null) return;
    mousePullActiveRef.current = false;
    handlePullEnd();
  };

  useEffect(() => {
    if (screen !== S.HOME) {
      pullStartYRef.current = null;
      pullDistanceRef.current = 0;
      mousePullActiveRef.current = false;
      setPullDistance(0);
      setHomeScrollTop(0);
    }
  }, [screen]);

  const screenProps = { go, goTab, clients, signatures, forms8879, extensions, chats, docs, auditLog, signed, reminded, remind, undoRemind, sign, chatMsgs, chatUnread, openChat, openTopic, sendMsg, ctx, pendingResolve, resolveOnReturn, clearPendingResolve, showToast, hideToast, setOverlayOpen, homeSearch, setHomeSearch };
  const showTabChrome = [S.HOME, S.CLIENTS, S.MESSAGING, S.DOCUMENTS].includes(screen);

  return (
    <div style={{ minHeight:"100vh", background:"#c0c0c0", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ width:375, height:780, background:UI.surface, borderRadius:40, boxShadow:"0 32px 80px rgba(0,0,0,0.25)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes signLand{0%{transform:translateY(-8px) scale(0.96);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}@keyframes metricPop{0%{transform:scale(1.08);opacity:.6}100%{transform:scale(1);opacity:1}}`}</style>

        {/* Status bar */}
        <div style={{ background:UI.brand, padding:"10px 22px 6px", display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>9:41</span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <span style={{ color:"#b0b0b0", fontSize:10 }}>●●●</span>
            <div style={{ width:16, height:8, border:"1.5px solid #fff", borderRadius:2, position:"relative", marginLeft:4 }}>
              <div style={{ position:"absolute", left:1, top:1, bottom:1, width:"70%", background:"#fff", borderRadius:1 }} />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handlePullStart}
          onTouchMove={handlePullMove}
          onTouchEnd={handlePullEnd}
          onTouchCancel={handlePullEnd}
          onMouseDown={handleMousePullStart}
          onMouseMove={handleMousePullMove}
          onMouseUp={handleMousePullEnd}
          onMouseLeave={handleMousePullEnd}
          style={{
            flex:1,
            overflowY:"auto",
            display:"flex",
            flexDirection:"column",
            paddingBottom: showTabChrome ? 80 : 0,
            userSelect: pullDistance > 0 ? "none" : "auto",
            cursor: isHomePullEnabled ? "grab" : "auto",
            transform: screen === S.HOME ? `translateY(${Math.min(pullDistance * 0.85, 56)}px)` : "translateY(0)",
            transition: pullDistance === 0 ? "transform 0.18s ease" : "none",
          }}
        >
          {screen === S.HOME              && <HomeScreen        {...screenProps} showScrollSearch={homeScrollTop > 12} />}
          {screen === S.HOME_SEARCH       && <HomeSearchScreen  {...screenProps} />}
          {screen === S.GLOBAL_SEARCH     && <GlobalSearchScreen {...screenProps} />}
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

        {screen === S.HOME && !overlayOpen && (pullDistance > 0 || pullRefreshing) && (
          <div
            style={{
              position:"absolute",
              top:42,
              left:0,
              right:0,
              display:"flex",
              justifyContent:"center",
              pointerEvents:"none",
              zIndex:95,
              transform:`translateY(${Math.min(pullDistance * 0.6, 40)}px)`,
            }}
          >
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(7,33,79,0.86)", color:"#d8e5ff", border:"1px solid rgba(151,177,255,0.34)", borderRadius:999, padding:"5px 10px", fontSize:10.5, fontWeight:600 }}>
              {pullRefreshing && (
                <span style={{ width:10, height:10, borderRadius:99, border:"1.7px solid rgba(216,229,255,0.35)", borderTopColor:"#d8e5ff", display:"inline-block", animation:"spin 1s linear infinite" }} />
              )}
              <span>
                {pullRefreshing
                  ? "Refreshing..."
                  : pullDistance >= PULL_REFRESH_THRESHOLD
                    ? "Release to refresh"
                    : "Pull down to refresh"}
              </span>
            </div>
          </div>
        )}

        {showTabChrome && !overlayOpen && (
          <button
            onClick={() => go(S.EL_WIZARD)}
            aria-label="Add"
            style={{
              position:"absolute",
              right:18,
              bottom:88,
              width:52,
              height:52,
              borderRadius:99,
              border:"none",
              background:"#0065FF",
              color:"#fff",
              boxShadow:"0 10px 24px rgba(0,101,255,0.35)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
              zIndex:90,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}

        {/* Nav — only on top-level tab screens */}
        {showTabChrome && !overlayOpen && (
          <BottomNav tab={tab} setTab={goTab} totalUnread={totalUnread} />
        )}
      </div>
    </div>
  );
}
