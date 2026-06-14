import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeFavoriteList, setFavoritesList } from "../features/slices/favourites";
import Loader from "../components/Loader";
import headTag from "../headTag";
import fallBackSrc from "../assets/images/noUser.png";
import apiClient from "../utils/apiClient";
import {
  FaStar, FaSpinner, FaPaperPlane, FaCrown,
  FaHome, FaPhone, FaEnvelope,
  FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin,
  FaMapMarkerAlt, FaGlobe, FaWhatsapp, FaCheckCircle, FaBriefcase,
} from "react-icons/fa";
import {
  IoLocationOutline, IoPersonOutline,
  IoStarOutline, IoHomeOutline, IoDocumentTextOutline,
  IoHeartOutline, IoHeartSharp, IoShareSocialOutline,
  IoCalendarOutline, IoSearchOutline,
  IoChevronBackOutline, IoChevronForwardOutline,
} from "react-icons/io5";
import { Helmet } from "react-helmet";
import { MdVerified } from "react-icons/md";
import { SiTiktok } from "react-icons/si";
import { BiUserCircle } from "react-icons/bi";

const ITEMS = 12;

const TIER = {
  "Agent: Platinum": { icon: "💎", label: "Platinum", bg: "linear-gradient(135deg,#6c3483,#8e44ad)", accent: "#8e44ad", border: "rgba(142,68,173,0.3)" },
  "Agent: Gold": { icon: "🥇", label: "Gold", bg: "linear-gradient(135deg,#b7770d,#f39c12)", accent: "#d68910", border: "rgba(214,137,16,0.3)" },
  "Agent: Silver": { icon: "🥈", label: "Silver", bg: "linear-gradient(135deg,#5d6d7e,#85929e)", accent: "#5d6d7e", border: "rgba(93,109,126,0.3)" },
  "Agent: Bronze": { icon: "🥉", label: "Bronze", bg: "linear-gradient(135deg,#ca6f1e,#e67e22)", accent: "#ca6f1e", border: "rgba(202,111,30,0.3)" },
};

/* ─── helpers ─── */
const getName = (d) => {
  if (d?.first_name && d?.last_name) return `${d.first_name} ${d.last_name}`;
  return d?.first_name || d?.last_name || d?.user_name || "Sheetal Agent";
};

const fmtPrice = (v) => {
  if (!v || v === "N/A") return "Price on Request";
  const n = Number(v);
  if (isNaN(n) || n === 0) return "Price on Request";
  if (n >= 1_00_00_000) return `Rs. ${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `Rs. ${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`;
  return `Rs. ${n.toLocaleString()}`;
};

const fmtDate = (d) => {
  if (!d) return null;
  const p = new Date(d);
  if (isNaN(p.getTime()) || p.getFullYear() <= 0) return null;
  return p.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const purposeStyle = (p = "") => {
  const lc = (p || "").toLowerCase();
  if (lc === "rent" || lc === "lease") return { color: "#065f46", bg: "#d1fae5" };
  if (lc.includes("invest")) return { color: "#92400e", bg: "#fef3c7" };
  return { color: "#991b1b", bg: "#fee2e2" };
};

const statusInfo = (s) => {
  const u = (s || "").toUpperCase();
  if (u === "SOLD OUT") return { label: "Sold Out", color: "#991b1b", bg: "#fee2e2" };
  if (u === "RENTED OUT") return { label: "Rented", color: "#92400e", bg: "#fef3c7" };
  return { label: "Available", color: "#065f46", bg: "#d1fae5" };
};

const IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23F5F6F8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%23ccc'%3ENo image%3C/text%3E%3C/svg%3E";

/* ─── Share menu ─── */
const ShareMenu = ({ propertyId, onClose }) => {
  const url = `${window.location.origin}/property/${propertyId}`;
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  const share = (key) => {
    const enc = encodeURIComponent(url);
    if (key === "copy") { navigator.clipboard.writeText(url).then(() => toast.success("Copied!")); onClose(); return; }
    const map = { whatsapp: `https://wa.me/?text=${enc}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc}`, twitter: `https://twitter.com/intent/tweet?url=${enc}` };
    window.open(map[key], "_blank", "noopener,noreferrer"); onClose();
  };
  const items = [{ k: "whatsapp", l: "WhatsApp", d: "#25D366" }, { k: "facebook", l: "Facebook", d: "#1877F2" }, { k: "twitter", l: "Twitter", d: "#111" }, { k: "copy", l: "Copy Link", d: "#6b7280" }];
  return (
    <div ref={ref} onClick={(e) => e.stopPropagation()}
      style={{ background: "#fff", border: "0.5px solid #E9EAEC", borderRadius: 4, boxShadow: "0 8px 28px rgba(0,0,0,0.12)", padding: "8px 0", minWidth: 180, fontFamily: "'Outfit',sans-serif", zIndex: 400 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 14px 6px", margin: 0 }}>Share via</p>
      {items.map(({ k, l, d }) => (
        <button key={k} onClick={() => share(k)}
          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#0F172A", fontFamily: "'Outfit',sans-serif", textAlign: "left" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F5F6F8"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: d, display: "inline-block", flexShrink: 0 }} />
          {l}
        </button>
      ))}
    </div>
  );
};

/* ─── Favorites hook ─── */
const useFavorite = (propertyId) => {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.data);
  const user = useSelector((s) => s.user);
  const [, setQS] = useSearchParams();
  const token = localStorage.getItem("sheetal_token");
  const isInFav = !!favorites?.find((f) => f.property_id === propertyId);
  const [fav, setFav] = useState(isInFav);
  useEffect(() => setFav(isInFav), [isInFav]);
  useEffect(() => { if (!user.data) setFav(false); }, [user]);
  const toggle = useCallback(async (e) => {
    e.stopPropagation();
    if (!user.data && !token) { setQS("?login=1"); return; }
    const already = favorites?.find((f) => f.property_id === propertyId);
    if (already) {
      setFav(false); dispatch(removeFavoriteList(propertyId));
      try { await apiClient.post("/remove-from-favourite", { property_id: propertyId }); toast.success("Removed"); } catch { }
    } else {
      setFav(true); dispatch(setFavoritesList(propertyId));
      try { await apiClient.post("/add-to-favourite", { property_id: propertyId }); toast.success("Saved"); } catch { }
    }
  }, [dispatch, favorites, propertyId, token, user, setQS]);
  return { fav, toggle };
};

/* ─── Property card ─── */
const GridCard = ({ property }) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { fav, toggle } = useFavorite(property?.id);
  const ps = purposeStyle(property?.purpose || "");
  const image = !imgErr && property?.feature_image ? property.feature_image : IMG_FALLBACK;
  const price = fmtPrice(property?.total_price || property?.price);
  const title = property?.title || property?.name || "Property";
  const pid = property?.property_code ? `#${property.property_code}` : property?.id ? `#${property.id}` : null;
  const posted = fmtDate(property?.posted_date || property?.created_at);
  const go = () => navigate(`/property/${property.id}`);
  return (
    <article className="sa-card" onClick={go}>
      <div className="sa-img-wrap">
        <img src={image} alt="" onError={() => setImgErr(true)} className="sa-img" />
        <div className="sa-img-top">
          <span className="sa-ptag" style={{ color: ps.color, background: ps.bg }}>{property?.purpose || "Sale"}</span>
          <button className="sa-heart" onClick={toggle}>
            {fav ? <IoHeartSharp size={13} color="#e02424" /> : <IoHeartOutline size={13} color="rgba(255,255,255,0.9)" />}
          </button>
        </div>
        <div className="sa-price-bar"><span className="sa-price">{price}</span></div>
      </div>
      <div className="sa-body">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 2 }}>
          <p className="sa-title" title={title} style={{ margin: 0, flex: 1 }}>{title}</p>
          <span className="sa-ptag" style={{ color: statusInfo(property?.property_status).color, background: statusInfo(property?.property_status).bg, flexShrink: 0 }}>
            {statusInfo(property?.property_status).label}
          </span>
        </div>
        {property?.property_location && (
          <p className="sa-loc"><IoLocationOutline size={11} color="#e02424" /> {property.property_location}</p>
        )}
        <div className="sa-tags">
          {property?.property_category && <span className="sa-tag">{property.property_category}</span>}
          {property?.property_type && <span className="sa-tag">{property.property_type}</span>}
        </div>
      </div>
      <div className="sa-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", minWidth: 0, overflow: "hidden" }}>
          {pid && <span style={{ fontFamily: "monospace", fontSize: 10, color: "#9ca3af" }}>{pid}</span>}
          {posted && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#9ca3af" }}><IoCalendarOutline size={10} />{posted}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", flexShrink: 0, zIndex: 300 }}>
          <button className="sa-share" onClick={(e) => { e.stopPropagation(); setShareOpen((v) => !v); }}><IoShareSocialOutline size={13} /></button>
          <button className="sa-detail" onClick={(e) => { e.stopPropagation(); go(); }}>Details</button>
          {shareOpen && (
            <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, zIndex: 200 }}>
              <ShareMenu propertyId={property.id} onClose={() => setShareOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* ─── Stars ─── */
const Stars = ({ value, size = 13 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} style={{ fontSize: size, color: s <= Math.round(value || 0) ? "#e02424" : "#E9EAEC" }} />
    ))}
  </div>
);

const StarInput = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, transition: "transform .15s" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.25)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
        <FaStar style={{ fontSize: 22, color: s <= value ? "#e02424" : "#E9EAEC" }} />
      </button>
    ))}
  </div>
);

/* ─── Reviews ─── */
const AgentReviews = ({ agentId }) => {
  const user = useSelector((s) => s.user);
  const isLoggedIn = !!user?.data;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingErr, setRatingErr] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => { agentId && fetchR(); }, [agentId]);

  const fetchR = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`reviews-public?type=agent&agent_id=${agentId}`);
      const data = res.data?.data || [];
      setReviews(data);
      if (data.length) setAvgRating(Math.round(data.reduce((s, r) => s + r.rating, 0) / data.length * 10) / 10);
    } catch { setReviews([]); } finally { setLoading(false); }
  };

  const submit = async () => {
    if (!isLoggedIn) { toast.error("Please login."); return; }
    if (!comment.trim()) return;
    if (!rating) { setRatingErr(true); return; }
    setRatingErr(false); setSubmitting(true);
    try {
      await apiClient.post("reviews", { type: "agent", rating, comment: comment.trim(), agent_id: agentId });
      toast.success("Review posted!"); setComment(""); setRating(0); fetchR();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed.";
      if (err.response?.status === 403) toast.warning(msg);
      else if (err.response?.status === 422) toast.info(msg);
      else toast.error(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      {/* Rating summary */}
      {reviews.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 20px", background: "rgba(224,36,36,0.04)", borderRadius: 4, border: "0.5px solid #E9EAEC", marginBottom: 20 }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#e02424", lineHeight: 1 }}>{avgRating}</div>
            <Stars value={avgRating} size={15} />
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{reviews.length} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((n) => {
              const count = reviews.filter((r) => Math.round(r.rating) === n).length;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#9ca3af", width: 8 }}>{n}</span>
                  <FaStar style={{ fontSize: 10, color: "#e02424", flexShrink: 0 }} />
                  <div style={{ flex: 1, background: "#E9EAEC", borderRadius: 20, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${reviews.length ? count / reviews.length * 100 : 0}%`, background: "#e02424", height: "100%", borderRadius: 20 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#9ca3af", width: 16 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write review */}
      <div style={{ background: "#fff", borderRadius: 4, border: "0.5px solid #E9EAEC", padding: 20, marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A", marginBottom: 14, letterSpacing: "-0.2px" }}>
          {isLoggedIn ? "Write a Review" : "Login to leave a review"}
        </div>
        {isLoggedIn && (
          <>
            <textarea
              value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this agent…" rows={3}
              style={{ width: "100%", resize: "none", border: "1.5px solid #E9EAEC", borderRadius: 4, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box", marginBottom: 12, background: "#F5F6F8", transition: "border-color .2s" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--r,#e02424)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E9EAEC"; e.target.style.background = "#F5F6F8"; }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: ratingErr ? "#e02424" : "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
                  {ratingErr ? "⚠ Select a rating" : "Your Rating"}
                </div>
                <StarInput value={rating} onChange={(v) => { setRating(v); setRatingErr(false); }} />
              </div>
              <button onClick={submit} disabled={!comment.trim() || submitting}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", background: !comment.trim() || submitting ? "#E9EAEC" : "#e02424", color: !comment.trim() || submitting ? "#9ca3af" : "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 800, cursor: !comment.trim() || submitting ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: ".04em", textTransform: "uppercase", transition: "background .2s" }}>
                {submitting ? <FaSpinner style={{ fontSize: 12 }} /> : <FaPaperPlane style={{ fontSize: 12 }} />}
                {submitting ? "Posting…" : "Post Review"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Review list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <FaSpinner style={{ fontSize: 28, color: "#e02424" }} />
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px dashed #E9EAEC", borderRadius: 4, color: "#9ca3af", fontSize: 13 }}>
          No reviews yet. Be the first to review this agent.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reviews.map((r) => (
            <div key={r.id} style={{ background: "#fff", border: "0.5px solid #E9EAEC", borderRadius: 4, padding: 16, borderLeft: "3px solid #e02424" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 4, background: "#F5F6F8", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {r.reviewer?.photo
                    ? <img src={r.reviewer.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <BiUserCircle style={{ fontSize: 22, color: "#9ca3af" }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>
                    {r.reviewer?.first_name ? `${r.reviewer.first_name} ${r.reviewer.last_name || ""}`.trim() : r.reviewer?.user_name || "Anonymous"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <Stars value={r.rating} size={11} />
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
              {r.comment && <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Contact form ─── */
const ContactForm = ({ agentId, tierBg, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Fill required fields."); return; }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_LINK}/contact-agent`, {
        agent_id: agentId, name: form.name, email: form.email,
        contact_form: `Phone: ${form.phone} | Message: ${form.message}`, terms_agrement: "yes",
      });
      toast.success("Message sent!"); onClose();
    } catch { toast.error("Failed. Try again."); } finally { setLoading(false); }
  };

  const iStyle = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #E9EAEC", borderRadius: 4,
    fontSize: 14, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box",
    background: "#F5F6F8", transition: "border-color .2s, background .2s",
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { n: "name", t: "text", p: "Full Name *", r: true },
        { n: "email", t: "email", p: "Email Address *", r: true },
        { n: "phone", t: "text", p: "Phone Number", r: false },
      ].map((f) => (
        <input key={f.n} type={f.t} placeholder={f.p} required={f.r}
          value={form[f.n]} onChange={(e) => setForm({ ...form, [f.n]: e.target.value })}
          style={iStyle}
          onFocus={(e) => { e.target.style.borderColor = "#e02424"; e.target.style.background = "#fff"; }}
          onBlur={(e) => { e.target.style.borderColor = "#E9EAEC"; e.target.style.background = "#F5F6F8"; }} />
      ))}
      <textarea placeholder="Your message *" required rows={4}
        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        style={{ ...iStyle, resize: "none" }}
        onFocus={(e) => { e.target.style.borderColor = "#e02424"; e.target.style.background = "#fff"; }}
        onBlur={(e) => { e.target.style.borderColor = "#E9EAEC"; e.target.style.background = "#F5F6F8"; }} />
      <button type="submit" disabled={loading}
        style={{ width: "100%", background: loading ? "#E9EAEC" : "#e02424", color: loading ? "#9ca3af" : "#fff", border: "none", borderRadius: 4, padding: "13px 0", fontSize: 12, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif", transition: "background .2s" }}>
        {loading ? <FaSpinner style={{ fontSize: 12 }} /> : <FaPaperPlane style={{ fontSize: 12 }} />}
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
};

/* ══════════════════════════════
   MAIN
══════════════════════════════ */
const SingleAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [allProps, setAllProps] = useState([]);
  const [propLoad, setPropLoad] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [contactOpen, setContactOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_LINK}/agent-detail/${id}`)
      .then((res) => { if (res.status === 200) setData(res.data.data); })
      .catch(() => { }).finally(() => setLoading(false));
    setPropLoad(true);
    axios.get(`${process.env.REACT_APP_API_LINK}/agent-properties/${id}`)
      .then((res) => setAllProps(res.data?.data || []))
      .catch(() => { }).finally(() => setPropLoad(false));
  }, [id]);

  useEffect(() => { if (data) headTag({ title: getName(data), content: "" }); }, [data]);

  const filteredProps = allProps.filter((p) =>
    !search || [p.name, p.title, p.property_location, p.district, p.property_type]
      .filter(Boolean).some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredProps.length / ITEMS);
  const pagedProps = filteredProps.slice((page - 1) * ITEMS, page * ITEMS);

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );

  if (!data) return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Outfit',sans-serif" }}>
      <p style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>Agent not found!</p>
      <Link to="/agents" style={{ color: "#e02424", fontWeight: 700 }}>← View All Agents</Link>
    </div>
  );

  const t = TIER[data.tier] || TIER["Agent: Bronze"];
  const isPremium = data.is_premium;
  const name = getName(data);

  const tabs = [
    { id: "listings", label: `Listings (${allProps.length})`, icon: <IoHomeOutline size={12} /> },
    { id: "about", label: "About", icon: <IoPersonOutline size={12} /> },
    { id: "reviews", label: `Reviews (${data.review_count || 0})`, icon: <IoStarOutline size={12} /> },
    ...(data.has_requirement_form ? [{ id: "requirement", label: "Requirement", icon: <IoDocumentTextOutline size={12} /> }] : []),
  ];

  return (
    <div className="ab" style={{ background: "#F5F6F8", minHeight: "100vh", fontFamily: "'Outfit',sans-serif" }}>
      <Helmet>
        <title>{name}{data.city ? ` — Real Estate Agent in ${data.city}` : " — Real Estate Agent"} | Sheetal Property Nepal</title>
        <meta name="description" content={`${name} is a verified ${t.label} tier real estate agent${data.city ? ` in ${data.city}` : ""} at Sheetal Property Nepal with ${allProps.length} property listings.${data.avg_rating > 0 ? ` Rated ${data.avg_rating}/5 by ${data.review_count} clients.` : ""}`} />
        <meta name="keywords" content={`${name}, real estate agent Nepal${data.city ? `, property agent ${data.city}` : ""}, buy property Nepal, Sheetal Property agent`} />
        <link rel="canonical" href={`https://sheetalproperty.com/agent/${id}`} />
        <meta property="og:title" content={`${name} — Real Estate Agent | Sheetal Property Nepal`} />
        <meta property="og:description" content={`${name} is a verified ${t.label} agent at Sheetal Property Nepal with ${allProps.length} listings.`} />
        <meta property="og:image" content={data.photo || "https://sheetalproperty.com/shetallogo.png"} />
        <meta property="og:url" content={`https://sheetalproperty.com/agent/${id}`} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": name,
          "image": data.photo || "",
          "url": `https://sheetalproperty.com/agent/${id}`,
          "telephone": data.phone || data.mobile || "",
          "email": data.email || "",
          "address": { "@type": "PostalAddress", "addressLocality": data.city || "", "addressCountry": "NP" },
          ...(data.avg_rating > 0 && { "aggregateRating": { "@type": "AggregateRating", "ratingValue": data.avg_rating, "reviewCount": data.review_count || 1 } }),
        })}</script>
      </Helmet>
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <div className="ag-hero" style={{ background: "#0F172A" }}>
        {/* tier color bar */}
        <div style={{ height: 4, background: t.bg }} />

        <div className="ag-hero-inner">
          {/* Mobile: stacked. Desktop: side-by-side */}
          <div className="ag-hero-top">

            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="ag-avatar">
                <img src={data.photo || fallBackSrc} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {isPremium && (
                <div style={{ position: "absolute", bottom: -5, right: -5, width: 22, height: 22, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                  <MdVerified style={{ color: t.accent, fontSize: 13 }} />
                </div>
              )}
            </div>

            {/* Name + info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Label */}
              <div className="lbl" style={{ marginBottom: 6 }}>
                <div className="lbl-line" style={{ background: "rgba(255,255,255,0.3)" }} />
                <span className="lbl-txt" style={{ color: "rgba(255,255,255,0.5)" }}>{t.icon} {t.label} Agent</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 className="ag-name">{name}</h1>
                {isPremium && <FaCrown style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, flexShrink: 0, marginTop: 4 }} />}
              </div>

              {data.designation && <div className="ag-sub">{data.designation}</div>}
              {data.company_name && <div className="ag-sub" style={{ display: "flex", alignItems: "center", gap: 4 }}><FaBriefcase style={{ fontSize: 10 }} />{data.company_name}</div>}
              {(data.city || data.address_1) && (
                <div className="ag-sub" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <FaMapMarkerAlt style={{ fontSize: 10 }} />{data.city || data.address_1}
                </div>
              )}

              {/* CTA buttons */}
              <div className="ag-btns">
                <button className="ag-btn-primary" onClick={() => setContactOpen(true)}>
                  <FaEnvelope style={{ fontSize: 11 }} /> Contact Agent
                </button>
                {data.phone && (
                  <a href={`tel:${data.phone}`} className="ag-btn-ghost">
                    <FaPhone style={{ fontSize: 10 }} />
                    <span className="ag-phone-text">{data.phone}</span>
                  </a>
                )}
                {data.mobile && (
                  <a href={`https://wa.me/${data.mobile?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="ag-btn-wa">
                    <FaWhatsapp style={{ fontSize: 14 }} />
                  </a>
                )}
              </div>
            </div>

            {/* Stats — moves below on mobile */}
            <div className="ag-stats">
              {[
                { icon: FaHome, value: allProps.length || 0, label: "Listings", color: "#fff" },
                ...(data.avg_rating > 0 ? [{ icon: FaStar, value: data.avg_rating, label: "Rating", color: "#e02424" }] : []),
              ].map((s, i, arr) => (
                <div key={i} className="ag-stat" style={{ borderRight: i < arr.length - 1 ? "0.5px solid rgba(255,255,255,0.15)" : "none" }}>
                  <s.icon style={{ fontSize: 14, color: s.color, display: "block", margin: "0 auto 4px" }} />
                  <div className="ag-stat-val">{s.value}</div>
                  <div className="ag-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div className="ag-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPage(1); }}
                className={`ag-tab${activeTab === tab.id ? " ag-tab--active" : ""}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="ag-body">

        {/* LISTINGS */}
        {activeTab === "listings" && (
          <div>
            <div className="ag-toolbar">
              <div>
                <div className="lbl" style={{ marginBottom: 4 }}>
                  <div className="lbl-line" />
                  <span className="lbl-txt">All Listings</span>
                </div>
                <h2 style={{ margin: 0, fontSize: "clamp(16px,3vw,22px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.4px" }}>
                  Properties by {name}
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginLeft: 8 }}>({filteredProps.length})</span>
                </h2>
              </div>
              <div style={{ position: "relative" }}>
                <IoSearchOutline size={14} color="#9CA3AF" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search listings…"
                  className="ag-search"
                />
              </div>
            </div>

            {propLoad ? (
              <div className="ag-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: "#fff", border: "0.5px solid #E9EAEC", borderRadius: 4, overflow: "hidden" }}>
                    <div className="ag-shimmer" style={{ height: 185 }} />
                    <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ height: 11, width: "45%", background: "#E9EAEC", borderRadius: 4 }} />
                      <div style={{ height: 10, width: "80%", background: "#E9EAEC", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProps.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "0.5px solid #E9EAEC", borderRadius: 4 }}>
                <IoHomeOutline size={40} color="#E9EAEC" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>No listings found</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>{search ? "Try a different search" : "No properties yet"}</div>
              </div>
            ) : (
              <>
                <div className="ag-grid">
                  {pagedProps.map((p) => <GridCard key={p.id} property={p} />)}
                </div>
                {totalPages > 1 && (
                  <div className="ag-pagination">
                    <button className="ag-pg-btn" onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === 1}>
                      <IoChevronBackOutline size={13} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, i, arr) => { if (i > 0 && arr[i - 1] !== p - 1) acc.push("..."); acc.push(p); return acc; }, [])
                      .map((p, i) =>
                        p === "..."
                          ? <span key={i} style={{ color: "#9ca3af", fontSize: 12, padding: "0 4px" }}>…</span>
                          : <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className={`ag-pg-btn${p === page ? " ag-pg-btn--active" : ""}`}>{p}</button>
                      )}
                    <button className="ag-pg-btn" onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === totalPages}>
                      <IoChevronForwardOutline size={13} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="ag-about-grid">
            {/* Left col */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {isPremium && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "rgba(39,174,96,0.06)", border: "0.5px solid rgba(39,174,96,0.3)", borderLeft: "3px solid #27ae60", borderRadius: 4 }}>
                  <FaCheckCircle style={{ color: "#27ae60", fontSize: 20, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, color: "#1e8449", fontSize: 13 }}>Verified Premium Agent</div>
                    <div style={{ fontSize: 12, color: "#27ae60" }}>Verified and trusted by Sheetal Property Nepal</div>
                  </div>
                </div>
              )}
              {data.description && (
                <div style={{ background: "#fff", borderRadius: 4, padding: 20, border: "0.5px solid #E9EAEC" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.2px" }}>About</div>
                  <p style={{ margin: 0, fontSize: 14, color: "#4b5563", lineHeight: 1.75, opacity: 1 }}>{data.description}</p>
                </div>
              )}
              <div style={{ background: "#fff", borderRadius: 4, border: "0.5px solid #E9EAEC", overflow: "hidden" }}>
                <div style={{ padding: "12px 18px", borderBottom: "0.5px solid #E9EAEC", background: "#F5F6F8" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", textTransform: "uppercase", letterSpacing: ".06em" }}>Contact Information</div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {[
                    { icon: FaEnvelope, label: "Email", value: data.email, href: `mailto:${data.email}` },
                    { icon: FaPhone, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
                    { icon: FaPhone, label: "Mobile", value: data.mobile, href: `tel:${data.mobile}` },
                    { icon: FaMapMarkerAlt, label: "Address", value: data.address_1 },
                    { icon: FaMapMarkerAlt, label: "City", value: data.city },
                    { icon: FaGlobe, label: "Website", value: data.website_url, href: data.website_url },
                    { icon: FaBriefcase, label: "Company", value: data.company_name },
                  ].filter((r) => r.value).map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "0.5px solid #F5F6F8" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 4, background: "rgba(224,36,36,0.06)", border: "0.5px solid #E9EAEC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <row.icon style={{ fontSize: 12, color: "#e02424" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em" }}>{row.label}</div>
                        {row.href
                          ? <a href={row.href} style={{ fontSize: 13, color: "#0F172A", fontWeight: 600, textDecoration: "none" }}>{row.value}</a>
                          : <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{row.value}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            {/* Social Links */}
              {[
                { label: "Facebook",  href: data.facebook_url,  bg: "#1877F2", icon: <FaFacebook /> },
                { label: "Instagram", href: data.instagram_url, bg: "#E1306C", icon: <FaInstagram /> },
                { label: "TikTok",    href: data.tiktok_url,    bg: "#010101", icon: <SiTiktok /> },
                { label: "YouTube",   href: data.youtube_url,   bg: "#FF0000", icon: <FaYoutube /> },
                { label: "Twitter/X", href: data.twitter_url,   bg: "#1DA1F2", icon: <FaTwitter /> },
                { label: "LinkedIn",  href: data.linkedin_url,  bg: "#0077B5", icon: <FaLinkedin /> },
              ].filter(s => s.href).length > 0 && (
                <div style={{ background: "#fff", borderRadius: 4, border: "0.5px solid #E9EAEC", overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", borderBottom: "0.5px solid #E9EAEC", background: "#F5F6F8" }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", textTransform: "uppercase", letterSpacing: ".06em" }}>Social Media</div>
                  </div>
                  <div style={{ padding: "14px 18px", display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { label: "Facebook",  href: data.facebook_url,  bg: "#1877F2", icon: <FaFacebook /> },
                      { label: "Instagram", href: data.instagram_url, bg: "#E1306C", icon: <FaInstagram /> },
                      { label: "TikTok",    href: data.tiktok_url,    bg: "#010101", icon: <SiTiktok /> },
                      { label: "YouTube",   href: data.youtube_url,   bg: "#FF0000", icon: <FaYoutube /> },
                      { label: "Twitter/X", href: data.twitter_url,   bg: "#1DA1F2", icon: <FaTwitter /> },
                      { label: "LinkedIn",  href: data.linkedin_url,  bg: "#0077B5", icon: <FaLinkedin /> },
                    ].filter(s => s.href).map((s, i) => (
                      <a key={i} href={s.href} target="_blank" rel="noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 7,
                          padding: "8px 14px", background: s.bg,
                          color: "#fff", borderRadius: 4,
                          fontSize: 12, fontWeight: 700,
                          textDecoration: "none",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        {s.icon} {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 4, padding: 18, border: "0.5px solid #E9EAEC" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", marginBottom: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Quick Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => setContactOpen(true)}
                    style={{ width: "100%", background: "#e02424", color: "#fff", border: "none", borderRadius: 4, padding: "11px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, letterSpacing: ".04em", textTransform: "uppercase", fontFamily: "'Outfit',sans-serif", transition: "background .2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#991b1b"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#e02424"}>
                    <FaEnvelope style={{ fontSize: 11 }} /> Send Message
                  </button>
                  {data.phone && (
                    <a href={`tel:${data.phone}`}
                      style={{ width: "100%", background: "#F5F6F8", border: "0.5px solid #E9EAEC", borderRadius: 4, padding: "10px 0", fontSize: 12, fontWeight: 800, color: "#0F172A", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxSizing: "border-box", transition: "border-color .2s" }}>
                      <FaPhone style={{ fontSize: 11, color: "#e02424" }} /> {data.phone}
                    </a>
                  )}
                  {data.mobile && (
                    <a href={`https://wa.me/${data.mobile?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                      style={{ width: "100%", background: "#25d366", borderRadius: 4, padding: "10px 0", fontSize: 12, fontWeight: 800, color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxSizing: "border-box" }}>
                      <FaWhatsapp style={{ fontSize: 13 }} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {data.avg_rating > 0 && (
                <div style={{ background: "#fff", borderRadius: 4, padding: 18, border: "0.5px solid #E9EAEC" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>Rating</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#e02424", lineHeight: 1 }}>{data.avg_rating}</div>
                    <div>
                      <Stars value={data.avg_rating} size={14} />
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{data.review_count} reviews</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab("reviews")}
                    className="btn-p" style={{ width: "100%", fontSize: 12, padding: "10px 0", textAlign: "center", display: "block" }}>
                    See All Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div style={{ maxWidth: 680 }}>
            <div className="lbl" style={{ marginBottom: 8 }}>
              <div className="lbl-line" />
              <span className="lbl-txt">Agent Reviews</span>
            </div>
            <h2 style={{ margin: "0 0 20px", fontSize: "clamp(16px,3vw,22px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.4px" }}>
              What clients say
            </h2>
            <AgentReviews agentId={data.id} />
          </div>
        )}

        {/* REQUIREMENT */}
        {activeTab === "requirement" && data.has_requirement_form && (
          <div style={{ maxWidth: 440, margin: "0 auto", background: "#fff", borderRadius: 4, padding: 28, border: "0.5px solid #E9EAEC", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.4px" }}>Submit a Requirement</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.65, opacity: 1 }}>
              Tell {name} exactly what property you're looking for
            </div>
            <Link to={`/requirementform?agent_id=${data.id}`} className="btn-p">
              Go to Requirement Form →
            </Link>
          </div>
        )}
      </div>

      {/* ══ CONTACT MODAL ══ */}
      {contactOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}
        >
          <div style={{ background: "#fff", borderRadius: 4, padding: 24, width: "100%", maxWidth: 420, position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
            <button
              onClick={() => setContactOpen(false)}
              style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 22, lineHeight: 1, fontFamily: "'Outfit',sans-serif" }}>
              ×
            </button>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 4, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 22 }}>
                {t.icon}
              </div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#0F172A", letterSpacing: "-0.3px" }}>Contact {name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>Send a direct message to this agent</div>
            </div>
            <ContactForm agentId={id} tierBg={t.bg} onClose={() => setContactOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

/* ══ CSS ══ */
const CSS = `
  @keyframes ag-shimmer {
    0%   { background-position: -600px 0 }
    100% { background-position:  600px 0 }
  }

  /* ── Hero ── */
  .ag-hero { padding-top: 64px; }
  .ag-hero-inner { max-width: 1240px; margin: 0 auto; padding: 0 16px; }

  .ag-hero-top {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 0 0;
  }
  @media (min-width: 640px) {
    .ag-hero-top {
      flex-direction: row;
      align-items: flex-start;
      gap: 20px;
    }
  }

  .ag-avatar {
    width: 80px; height: 80px;
    border-radius: 4px; overflow: hidden;
    border: 2px solid rgba(255,255,255,0.25);
    background: #fff; flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .ag-avatar { width: 96px; height: 96px; }
  }

  .ag-name {
    margin: 0;
    font-size: clamp(18px, 4vw, 28px);
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -0.5px;
    font-family: 'Outfit', sans-serif;
  }
  .ag-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 2px;
    font-family: 'Outfit', sans-serif;
  }

  .ag-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 14px;
  }
  .ag-btn-primary {
    display: flex; align-items: center; gap: 6px;
    background: #e02424; color: #fff;
    border: none; border-radius: 4px;
    padding: 9px 16px;
    font-size: 12px; font-weight: 800;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    letter-spacing: .04em; text-transform: uppercase;
    transition: background .2s;
    white-space: nowrap;
  }
  .ag-btn-primary:hover { background: #991b1b; }
  .ag-btn-ghost {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.1);
    border: 0.5px solid rgba(255,255,255,0.25);
    border-radius: 4px; padding: 9px 14px;
    font-size: 12px; font-weight: 700;
    color: #fff; text-decoration: none;
    transition: background .2s;
    white-space: nowrap;
  }
  .ag-btn-ghost:hover { background: rgba(255,255,255,0.18); }
  .ag-btn-wa {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    background: #25d366; border-radius: 4px;
    text-decoration: none; flex-shrink: 0;
  }
  .ag-phone-text { display: none; }
  @media (min-width: 420px) { .ag-phone-text { display: inline; } }

  /* Stats — full-width below hero info on mobile */
  .ag-stats {
    display: flex;
    background: rgba(255,255,255,0.08);
    border: 0.5px solid rgba(255,255,255,0.15);
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
  }
  @media (min-width: 640px) {
    .ag-stats {
      width: auto;
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 6px;
    }
  }
  .ag-stat { padding: 12px 18px; text-align: center; flex: 1; }
  @media (min-width: 640px) { .ag-stat { flex: none; } }
  .ag-stat-val { font-size: 20px; font-weight: 900; color: #fff; line-height: 1; font-family: 'Outfit', sans-serif; }
  .ag-stat-lbl { font-size: 9px; color: rgba(255,255,255,0.5); font-weight: 700; margin-top: 2px; text-transform: uppercase; letter-spacing: .06em; }

  /* Tabs */
  .ag-tabs {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    border-top: 0.5px solid rgba(255,255,255,0.1);
    margin: 16px -16px 0;
    padding: 0 16px;
  }
  .ag-tabs::-webkit-scrollbar { display: none; }
  .ag-tab {
    display: flex; align-items: center; gap: 5px;
    padding: 12px 14px;
    border: none; background: none;
    font-size: 12px; font-weight: 700;
    color: rgba(255,255,255,0.45);
    border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap;
    font-family: 'Outfit', sans-serif;
    transition: color .15s, border-color .15s;
    letter-spacing: .02em;
  }
  .ag-tab--active { color: #fff; border-bottom-color: #e02424; }
  .ag-tab:hover:not(.ag-tab--active) { color: rgba(255,255,255,0.75); }

  /* Body */
  .ag-body { max-width: 1240px; margin: 0 auto; padding: 20px 16px 60px; }
  @media (min-width: 640px) { .ag-body { padding: 28px 24px 72px; } }

  /* Toolbar */
  .ag-toolbar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  @media (min-width: 480px) {
  .ag-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
}
@media (min-width: 1024px) {
  .ag-grid { grid-template-columns: repeat(4, 1fr); }
}
  }
  .ag-search {
    padding: 9px 12px 9px 34px;
    border: 1.5px solid #E9EAEC;
    border-radius: 4px;
    font-size: 13px;
    outline: none;
    width: 100%;
    background: #fff;
    font-family: 'Outfit', sans-serif;
    box-sizing: border-box;
    transition: border-color .2s;
  }
  @media (min-width: 480px) { .ag-search { width: 200px; } }
  .ag-search:focus { border-color: #e02424; }

  /* Property grid */
  .ag-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (min-width: 480px) {
    .ag-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  }
  @media (max-width: 360px) { .ag-grid { grid-template-columns: 1fr; } }

  /* Property card */
  .sa-card {
    background: #fff; border: 0.5px solid #E9EAEC;
    border-radius: 4px; overflow: visible;
    cursor: pointer; display: flex; flex-direction: column;
    transition: border-color .18s, box-shadow .18s;
    font-family: 'Outfit', sans-serif;
  }
  .sa-card:hover { border-color: rgba(224,36,36,0.3); box-shadow: 0 4px 18px rgba(224,36,36,0.08); }
  .sa-img-wrap { position: relative; height: 160px; overflow: hidden; flex-shrink: 0; border-radius: 4px 4px 0 0; }
  @media (min-width: 480px) { .sa-img-wrap { height: 180px; } }
  .sa-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .38s ease; }
  .sa-card:hover .sa-img { transform: scale(1.04); }
  .sa-img-top { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 8px 0; z-index: 8; }
  .sa-price-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px 10px 8px; background: linear-gradient(to top,rgba(0,0,0,0.65),transparent); z-index: 6; }
  .sa-price { font-size: 12px; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif; }
  .sa-ptag { display: inline-block; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px; letter-spacing: .05em; text-transform: uppercase; line-height: 1; }
  .sa-heart { width: 26px; height: 26px; border-radius: 4px; background: rgba(0,0,0,0.3); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: background .15s; }
  .sa-heart:hover { background: rgba(0,0,0,0.5); }
  .sa-body { padding: 10px 11px 6px; flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; overflow: hidden; }
  .sa-title { font-size: 12px; font-weight: 700; color: #0F172A; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; width: 100%; }
  .sa-loc { display: flex; align-items: center; gap: 3px; font-size: 10px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; margin: 0; }
  .sa-tags { display: flex; gap: 4px; flex-wrap: wrap; overflow: hidden; }
  .sa-tag { font-size: 9px; color: #6b7280; background: #F5F6F8; padding: 2px 7px; border-radius: 4px; line-height: 1.6; white-space: nowrap; border: 0.5px solid #E9EAEC; }
  .sa-footer { display: flex; align-items: center; justify-content: space-between; padding: 7px 11px 9px; border-top: 0.5px solid #E9EAEC; margin-top: auto; gap: 6px; flex-wrap: wrap; min-width: 0; overflow: visible; position: relative; z-index: 20; }
  .sa-share { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 4px; background: #F5F6F8; border: 0.5px solid #E9EAEC; cursor: pointer; color: #6b7280; transition: border-color .15s, color .15s; }
  .sa-share:hover { border-color: #e02424; color: #e02424; }
  .sa-detail { font-size: 11px; font-weight: 800; color: #fff; background: #e02424; border: none; border-radius: 4px; padding: 5px 12px; cursor: pointer; font-family: 'Outfit', sans-serif; transition: background .15s; white-space: nowrap; letter-spacing: .04em; text-transform: uppercase; }
  .sa-detail:hover { background: #991b1b; }

  /* Shimmer */
  .ag-shimmer {
    background: linear-gradient(90deg, #F5F6F8 25%, #E9EAEC 50%, #F5F6F8 75%);
    background-size: 600px 100%;
    animation: ag-shimmer 1.4s infinite;
  }

  /* Pagination */
  .ag-pagination { display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 28px; flex-wrap: wrap; }
  .ag-pg-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 8px; border: 0.5px solid #E9EAEC; border-radius: 4px; background: #fff; color: #6b7280; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; transition: border-color .15s, color .15s; }
  .ag-pg-btn:hover:not(:disabled) { border-color: #e02424; color: #e02424; }
  .ag-pg-btn:disabled { opacity: .35; cursor: not-allowed; }
  .ag-pg-btn--active { background: #e02424; border-color: #e02424; color: #fff; }

  /* About grid */
  .ag-about-grid { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
  @media (min-width: 768px) { .ag-about-grid { grid-template-columns: 1fr 280px; gap: 20px; } }
`;

export default SingleAgent;