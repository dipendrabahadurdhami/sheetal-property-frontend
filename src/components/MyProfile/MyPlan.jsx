import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import { FaSpinner, FaCrown, FaArrowUp, FaClock, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const PLAN_COLORS = {
  "Agent: Bronze":   { bg: "#FEF5EC", icon: "🥉" },
  "Agent: Silver":   { bg: "#F1F3F5", icon: "🥈" },
  "Agent: Gold":     { bg: "#FEF9E7", icon: "🥇" },
  "Agent: Platinum": { bg: "#F5EEF8", icon: "💎" },
};

const BOOST_LABELS = ["None", "Low", "High", "Top"];

const styles = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    color: "#0F172A",
    background: "#F5F6F8",
    padding: "24px",
  },
  lbl: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  lblLine: { width: 22, height: 1, background: "#e02424" },
  lblTxt: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#e02424",
  },
  planCard: {
    background: "#fff",
    border: "0.5px solid #E9EAEC",
    borderRadius: 4,
    padding: 24,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  planCardAccent: {
    position: "absolute",
    left: 0, top: 0,
    width: 2, height: "100%",
    background: "#e02424",
  },
  planHead: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
  planIcon: {
    width: 44, height: 44,
    background: "rgba(224,36,36,0.06)",
    borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20,
  },
  planName: { fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.4px", margin: 0 },
  planSub: {
    fontSize: 11, fontWeight: 600,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#e02424", margin: 0, opacity: 0.85,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginBottom: 18,
  },
  sb: {
    padding: "16px 12px",
    border: "0.5px solid #E9EAEC",
    background: "rgba(224,36,36,0.06)",
    borderRadius: 4,
    textAlign: "center",
    transition: "background 0.3s, border-color 0.3s",
    cursor: "default",
  },
  sbVal: { fontSize: 20, fontWeight: 900, color: "#0F172A", lineHeight: 1 },
  sbLbl: {
    fontSize: 10, fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#0F172A", opacity: 0.45, marginTop: 4,
  },
  usageRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 11, fontWeight: 600,
    letterSpacing: "0.06em", textTransform: "uppercase",
    opacity: 0.5, marginBottom: 6,
  },
  barTrack: { background: "#E9EAEC", borderRadius: 2, height: 5, overflow: "hidden" },
  sectionHead: {
    display: "flex", alignItems: "center", gap: 10,
    fontSize: 9, fontWeight: 800,
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#e02424", marginBottom: 16,
  },
  freeNotice: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(224,36,36,0.06)",
    border: "0.5px solid rgba(224,36,36,0.14)",
    borderRadius: 4, padding: "12px 14px",
    fontSize: 12, fontWeight: 600,
    color: "#0F172A", marginBottom: 16, opacity: 0.85,
  },
  upCard: (selected) => ({
    background: "#fff",
    border: `0.5px solid ${selected ? "#e02424" : "#E9EAEC"}`,
    borderRadius: 4,
    padding: "16px 18px",
    marginBottom: 8,
    display: "flex", alignItems: "center", gap: 14,
    cursor: "pointer",
    position: "relative", overflow: "hidden",
    boxShadow: selected ? "0 8px 24px rgba(224,36,36,0.06)" : "none",
    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  }),
  upCardBar: (selected) => ({
    position: "absolute", top: 0, left: 0,
    height: 2,
    width: selected ? "100%" : 0,
    background: "#e02424",
    transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
  }),
  radio: (on) => ({
    width: 17, height: 17, borderRadius: "50%",
    border: `1.5px solid ${on ? "#e02424" : "#E9EAEC"}`,
    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    transition: "border-color 0.2s",
  }),
  radioDot: { width: 8, height: 8, borderRadius: "50%", background: "#e02424" },
  upInfo: { flex: 1 },
  upName: { fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" },
  upDetail: { fontSize: 11, color: "#0F172A", opacity: 0.45, margin: 0 },
  upPrice: { fontSize: 14, fontWeight: 800, color: "#0F172A", whiteSpace: "nowrap" },
  btnP: (active) => ({
    background: active ? "#e02424" : "#E9EAEC",
    color: active ? "#F5F6F8" : "#aaa",
    border: "none",
    padding: "12px 28px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: 12,
    letterSpacing: "0.06em", textTransform: "uppercase",
    cursor: active ? "pointer" : "not-allowed",
    borderRadius: 4, width: "100%",
    marginTop: 14,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
  }),
  hint: {
    fontSize: 11, textAlign: "center",
    color: "#0F172A", opacity: 0.4,
    marginTop: 8, fontWeight: 500, letterSpacing: "0.03em",
  },
  pending: {
    background: "#fff",
    border: "0.5px solid #E9EAEC",
    borderRadius: 4, padding: "32px 24px",
    textAlign: "center",
    position: "relative", overflow: "hidden",
  },
  pendingIcon: {
    width: 48, height: 48,
    background: "rgba(224,36,36,0.06)",
    borderRadius: 4,
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 14px", fontSize: 22,
  },
  pendingTitle: { fontSize: 16, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.3px", margin: "0 0 6px" },
  pendingSub: { fontSize: 13, color: "#0F172A", opacity: 0.5, margin: 0 },
};

const MyPlan = () => {
  const user = useSelector((state) => state.user);
  const userData = user?.data;
  const currentPlan = userData?.subscription_tier;
  const planMeta = PLAN_COLORS[currentPlan] || { bg: "#F5F6F8", icon: "👤" };

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pendingUpgrade, setPendingUpgrade] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient.get("subscription-plans");
        setPlans(res.data?.data || res.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleUpgradeRequest = async () => {
    if (!selectedPlan) { toast.error("Please select a plan."); return; }
    setUpgradeLoading(true);
    try {
      await apiClient.post("request-upgrade", { requested_plan: selectedPlan });
      setPendingUpgrade(true);
      toast.success("Upgrade request submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit upgrade request.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const usedPct = userData?.plan_listings_limit > 0
    ? Math.min(100, ((userData?.listings_used_month ?? 0) / userData?.plan_listings_limit) * 100)
    : 0;

  const stats = [
    { val: userData?.plan_listings_limit === -1 ? "∞" : (userData?.plan_listings_limit ?? 0), lbl: "Listings / mo" },
    { val: userData?.listings_used_month ?? 0, lbl: "Used" },
    { val: userData?.plan_featured_limit === -1 ? "∞" : (userData?.plan_featured_limit ?? 0), lbl: "Featured" },
    { val: BOOST_LABELS[userData?.plan_search_boost ?? 0], lbl: "Boost" },
  ];

  return (
    <div style={styles.root}>

      {/* ── Current Plan Card ── */}
      <div style={styles.planCard}>
        <div style={styles.planCardAccent} />
        <div style={styles.planHead}>
          <div style={{ ...styles.planIcon, background: planMeta.bg }}>
            {planMeta.icon}
          </div>
          <div>
            <p style={styles.planSub}>Current plan</p>
            <p style={styles.planName}>{currentPlan || "No Plan"}</p>
          </div>
        </div>

        <div style={styles.statGrid}>
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                ...styles.sb,
                background: hoveredStat === i ? "rgba(224,36,36,0.14)" : "rgba(224,36,36,0.06)",
                borderColor: hoveredStat === i ? "#e02424" : "#E9EAEC",
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={styles.sbVal}>{s.val}</div>
              <div style={styles.sbLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {userData?.plan_listings_limit > 0 && (
          <>
            <div style={styles.usageRow}>
              <span>Monthly usage</span>
              <span>{userData?.listings_used_month} / {userData?.plan_listings_limit}</span>
            </div>
            <div style={styles.barTrack}>
              <div style={{ height: "100%", borderRadius: 2, background: "#e02424", width: `${usedPct}%`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </>
        )}
      </div>

      {/* ── Upgrade Section ── */}
      {pendingUpgrade ? (
        <div style={styles.pending}>
          <div style={styles.planCardAccent} />
          <div style={styles.pendingIcon}><FaClock style={{ color: "#e02424" }} /></div>
          <p style={styles.pendingTitle}>Upgrade request submitted</p>
          <p style={styles.pendingSub}>Admin will contact you with payment details within 24 hours.</p>
        </div>
      ) : (
        <>
          <div style={styles.sectionHead}>
            <div style={styles.lblLine} />
            Upgrade plan
          </div>

          {currentPlan === "Agent: Bronze" && (
            <div style={styles.freeNotice}>
              <FaInfoCircle style={{ color: "#e02424", flexShrink: 0 }} />
              You're on the free Bronze plan — upgrade to unlock more listings &amp; features.
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <FaSpinner style={{ fontSize: 22, color: "#e02424", animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            plans
              .filter(p => p.role_name !== currentPlan && p.role_name !== "Agent: Bronze")
              .map(plan => {
                const meta = PLAN_COLORS[plan.role_name] || { bg: "#F5F6F8", icon: "👤" };
                const isSelected = selectedPlan === plan.role_name;
                const isHovered = hoveredCard === plan.role_name;
                return (
                  <div
                    key={plan.role_name}
                    style={{
                      ...styles.upCard(isSelected),
                      borderColor: isSelected || isHovered ? "#e02424" : "#E9EAEC",
                      transform: isHovered ? "translateY(-2px)" : "none",
                      boxShadow: isHovered || isSelected ? "0 12px 32px rgba(224,36,36,0.06)" : "none",
                    }}
                    onClick={() => setSelectedPlan(plan.role_name)}
                    onMouseEnter={() => setHoveredCard(plan.role_name)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={styles.upCardBar(isSelected || isHovered)} />
                    <div style={styles.radio(isSelected)}>
                      {isSelected && <div style={styles.radioDot} />}
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: 4, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div style={styles.upInfo}>
                      <p style={styles.upName}>{plan.name}</p>
                      <p style={styles.upDetail}>
                        {plan.max_listings_per_month === -1 ? "Unlimited" : plan.max_listings_per_month} listings
                        &nbsp;·&nbsp;{plan.max_featured === -1 ? "Unlimited" : plan.max_featured} featured
                        {plan.homepage_banner ? " · Homepage banner" : ""}
                      </p>
                    </div>
                    <div style={styles.upPrice}>
                      Rs. {Number(plan.price).toLocaleString()}
                      <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.5 }}>/mo</span>
                    </div>
                  </div>
                );
              })
          )}

          <button
            style={styles.btnP(!!selectedPlan && !upgradeLoading)}
            disabled={!selectedPlan || upgradeLoading}
            onClick={handleUpgradeRequest}
            onMouseEnter={e => { if (selectedPlan) { e.currentTarget.style.background = "#991b1b"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(224,36,36,0.28)"; }}}
            onMouseLeave={e => { e.currentTarget.style.background = selectedPlan ? "#e02424" : "#E9EAEC"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {upgradeLoading
              ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
              : <><FaArrowUp style={{ fontSize: 11 }} /> Request Upgrade</>
            }
          </button>
          <p style={styles.hint}>Our team will contact you with bank transfer details after submission.</p>
        </>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default MyPlan;