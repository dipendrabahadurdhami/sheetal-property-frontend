import { useState, useRef } from "react";

// ─── Local Extraction Engine (no API needed) ──────────────────────────────────

function devanagariToArabic(str) {
  return str.replace(/[०-९]/g, d => d.charCodeAt(0) - 2406);
}

function normalizePhone(raw) {
  let s = devanagariToArabic(String(raw)).replace(/[\s\-().]/g, "");
  if (s.startsWith("+977")) s = s.slice(4);
  else if (s.startsWith("977") && s.length === 13) s = s.slice(3);
  if (/^98\d{8}$/.test(s) || /^97\d{8}$/.test(s) || /^96\d{8}$/.test(s)) return s;
  return null;
}

function detectIntent(text) {
  const t = text.toLowerCase();
  if (/\b(kinnu|buy|purchase|kharida|खरिद|किन्नु|किन्न)\b/.test(t)) return "Buy";
  if (/\b(bechnu|sell|sale|bech|बेच्नु|बेच्न|बेच)\b/.test(t)) return "Sell";
  if (/\b(bhado|bhada|rent|lease|kiraya|भाडा|भाडामा|bhada)\b/.test(t)) return "Rent";
  if (/\b(lagani|invest|लगानी)\b/.test(t)) return "Invest";
  if (/\b(inquiry|sochpuch|सोधपुछ|जानकारी|info)\b/.test(t)) return "Inquiry";
  return "Unknown";
}

function detectPropertyType(text) {
  const t = text.toLowerCase();
  if (/\b(flat)\b/.test(t)) return "Flat";
  if (/\b(apartment|app|apmnt)\b/.test(t)) return "Apartment";
  if (/\b(jagga|jग्गा|जग्गा|land|plot|aana|ropani|bigha|dhur)\b/.test(t)) return "Land";
  if (/\b(ghar|घर|house|home)\b/.test(t)) return "House";
  if (/\b(office|commercial|shop|showroom)\b/.test(t)) return "Commercial";
  if (/\b(building|hall)\b/.test(t)) return "Building";
  return "";
}

function detectBudget(text) {
  const t = devanagariToArabic(text);
  let m;
  if ((m = t.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|करोड)/i))) return m[1] + "Cr";
  if ((m = t.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b|लाख)/i))) return m[1] + "L";
  if ((m = t.match(/(\d+)\s*k\s*\/?\s*month/i))) return m[1] + "k/month";
  if ((m = t.match(/(\d+)\s*k\b/i))) return m[1] + "k";
  if ((m = t.match(/(\d+)\s*sqft/i))) return m[1] + "sqft";
  if ((m = t.match(/rs\.?\s*(\d[\d,]+)/i))) return "Rs " + m[1].replace(/,/g, "");
  return "";
}

function detectLocation(text) {
  const locations = [
    "Kathmandu","Lalitpur","Bhaktapur","Pokhara","Chitwan","Butwal","Biratnagar","Birgunj",
    "Dharan","Hetauda","Itahari","Nepalgunj","Dhangadhi","Janakpur","Bharatpur",
    "Mandikatar","Putalisadak","Ringroad","Ring Road","Dhapakhel","Koteshwor","Koteshwore",
    "Thamel","Lazimpat","Baluwatar","Baneshwor","Chabahil","Gongabu","Kalanki","Kirtipur",
    "Thankot","Godawari","Imadol","Jhamsikhel","Kupondol","Lagankhel","Maitighar",
    "Naxal","Newroad","New Road","Patan","Pulchowk","Ratnapark","Sanepa","Satdobato",
    "Sundhara","Teku","Thapathali","Boudha","Swayambhu","Gwarko","Harisiddhi",
    "Lubhu","Suryabinayak","Sallaghari","Sipadol","Lokanthali","Jadibuti","Thimi",
    "Bhaisepati","Tikathali","Khumaltar","Ekantakuna","Balkumari","Nakhipot",
    "Minbhawan","Battisputali","Bishalnagar","Budhanilkantha","Gokarneshwor",
    "Jorpati","Kapan","Maharajgunj","Mahankal","Narayanthan","Panipokhari",
    "Samakhusi","Shantinagar","Sinamangal","Sorhakhutte","Tokha","Uttar Dhoka",
    "Chandragiri","Dakshinkali","Nagarjun","Tarakeshwor","Kageshwori",
    "Dhumbarahi","Gaushala","Dillibazar","Shankar Dev","Tripureshwor",
    "Kalimati","Sitapaila","Swoyambhu","Machhapokhari","Balaju","Budha Nilkantha",
  ];
  for (const loc of locations) {
    if (new RegExp("\\b" + loc + "\\b", "i").test(text)) return loc;
  }
  return "";
}

function detectLanguage(text) {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasRomanNepali = /\b(ghar|bhado|kinnu|bechnu|jagga|aana|ropani|bhada|lagani|kotha|tala)\b/i.test(text);
  const hasEnglish = /\b(buy|sell|rent|house|flat|land|plot|inquiry|budget)\b/i.test(text);
  if (hasDevanagari && (hasEnglish || hasRomanNepali)) return "Mixed";
  if (hasDevanagari) return "Nepali";
  if (hasRomanNepali && hasEnglish) return "Mixed";
  if (hasRomanNepali) return "Roman Nepali";
  return "English";
}

// Words that look capitalized but are NOT names
const NON_NAME_WORDS = new Set([
  "Kathmandu","Lalitpur","Bhaktapur","Pokhara","Chitwan","Butwal","Biratnagar","Birgunj",
  "Dharan","Hetauda","Itahari","Nepalgunj","Dhangadhi","Janakpur","Bharatpur",
  "Mandikatar","Putalisadak","Ringroad","Dhapakhel","Koteshwor","Koteshwore",
  "Thamel","Lazimpat","Baluwatar","Baneshwor","Chabahil","Gongabu","Kalanki","Kirtipur",
  "Thankot","Godawari","Imadol","Jhamsikhel","Kupondol","Lagankhel","Maitighar",
  "Naxal","Patan","Pulchowk","Sanepa","Satdobato","Sundhara","Teku","Thapathali",
  "Boudha","Swayambhu","Gwarko","Harisiddhi","Lubhu","Suryabinayak","Sallaghari",
  "Sipadol","Lokanthali","Jadibuti","Thimi","Bhaisepati","Tikathali","Khumaltar",
  "Ekantakuna","Balkumari","Nakhipot","Minbhawan","Battisputali","Bishalnagar",
  "Budhanilkantha","Gokarneshwor","Jorpati","Kapan","Maharajgunj","Mahankal",
  "Narayanthan","Panipokhari","Samakhusi","Shantinagar","Sinamangal","Sorhakhutte",
  "Tokha","Chandragiri","Dakshinkali","Nagarjun","Tarakeshwor","Kageshwori",
  "Dhumbarahi","Gaushala","Dillibazar","Tripureshwor","Kalimati","Sitapaila",
  "Balaju","Ganeshthan","Kakani","Baneshowr","Kamalpokhari","Kamal","Montessori",
  // Property / keyword words
  "Flat","House","Land","Plot","Apartment","Building","Hall","Office","Commercial",
  "Inquiry","Buy","Sell","Rent","Invest","Unknown","Missed","Call","Calls",
  "Ghar","Bhado","Kinnu","Bechnu","Jagga","Aana","Ropani","Owner","Client",
  "Urgent","Budget","Needed","Anywhere","Ground","Floor","Cafe","Hostel",
  "Mixed","Roman","Nepali","English","Road","Ring","New","Area","Near","Side",
]);

function extractName(text) {
  // Strip phone numbers, Devanagari, numbers, separators
  let clean = text
    .replace(/\+?977[\s-]?\d{10}/g, " ")
    .replace(/\b9[678]\d{8}\b/g, " ")
    .replace(/[\u0900-\u097F]+/g, " ")
    .replace(/\d+(?:\.\d+)?(?:cr|crore|lakh|lac|sqft|k|l)\b/gi, " ")
    .replace(/\d+/g, " ")
    .replace(/[|,\-+_\/\\]/g, " ")
    .replace(/\b(flat|house|ghar|land|plot|apartment|inquiry|buy|sell|rent|bhado|kinnu|bechnu|jagga|aana|ropani|owner|client|missed|call|calls|urgent|sqft|crore|lakh|cr|budget|needed|anywhere|building|hall|request|duplex|bhk|bedroom|room|floor|ground|area|near|side|road|ringroad|ring)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Try to find 2-word Proper Name (First Last) — both capitalized, neither a known place/keyword
  const twoWord = clean.match(/\b([A-Z][a-zA-Z]{1,})\s+([A-Z][a-zA-Z]{1,})\b/g);
  if (twoWord) {
    for (const candidate of twoWord) {
      const parts = candidate.trim().split(/\s+/);
      if (parts.every(p => !NON_NAME_WORDS.has(p) && p.length > 1)) {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
      }
    }
  }

  // Single capitalized word that is not a known place/keyword
  const words = clean.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
  for (const w of words) {
    if (!NON_NAME_WORDS.has(w)) return w;
  }

  // ALL CAPS (e.g. KHADKA) not in non-name list
  const caps = clean.match(/\b[A-Z]{3,}\b/g) || [];
  for (const w of caps) {
    const titled = w.charAt(0) + w.slice(1).toLowerCase();
    if (!NON_NAME_WORDS.has(titled) && !NON_NAME_WORDS.has(w)) {
      return titled;
    }
  }

  return "Unknown";
}

function localExtract(rawText) {
  const lines = rawText.split(/\n/).map(l => l.trim()).filter(Boolean);
  const leads = [];
  let isMissedCallSection = false;
  let idCounter = 1;

  for (const line of lines) {
    // Detect missed call section header
    if (/missed\s*calls?/i.test(line) && !(/\d{9,}/.test(line))) {
      isMissedCallSection = true;
      continue;
    }
    // Reset missed call section if line looks like normal lead
    if (isMissedCallSection && /[a-zA-Z\u0900-\u097F]{4,}/.test(line) && !/^\+?977/.test(line.trim())) {
      isMissedCallSection = false;
    }

    const normalized = devanagariToArabic(line);
    // Find all phone numbers in the line
    const phoneMatches = [...normalized.matchAll(/(?:\+?977[\s-]?)?(?:98|97|96)\d{8}/g)];

    if (phoneMatches.length === 0) continue;

    for (const pm of phoneMatches) {
      const phone = normalizePhone(pm[0]);
      if (!phone) continue;

      const isMissed = isMissedCallSection || /missed/i.test(line);
      const intent = isMissed ? "Unknown" : detectIntent(line);
      const property_type = detectPropertyType(line);
      const budget = detectBudget(line);
      const location = detectLocation(line);
      const detected_language = detectLanguage(line);
      const name = isMissed ? "Unknown" : extractName(line);
      const confidence = [phone, name !== "Unknown", location, budget].filter(Boolean).length - 1 || 1;

      leads.push({
        id: idCounter++,
        name,
        phone,
        location,
        budget,
        intent,
        property_type,
        notes: isMissed ? "Missed call" : "",
        confidence: Math.min(3, Math.max(1, confidence)),
        source_hint: isMissed ? "missed call" : detected_language === "Nepali" ? "Nepali text" : detected_language === "Roman Nepali" ? "Roman Nepali" : "inquiry note",
        detected_language,
      });
    }
  }
  return leads;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SAMPLE = `Begam KHADKA +977 9849297074 Mandikatar flat owner
+977 9762288541 Putalisadak 22k house inquiry
Chandragiri +977 9803119299 35k inquiry
+977 9845285896 Shandar Momo Ringroad 300sqft needed anywhere
Shangrilla building inquiry +977 9801192771
+977 9813382830 Dhapakhel 240ko ghar
Missed calls
+977 9851277969
+977 9808949791
+977 9841243690
Ram Bahadur Shrestha - 9841234567 - Kathmandu - 3BHK apartment budget 80 lakhs kinnu cha
Sita Rai | 9851112233 | Lalitpur | Patan flat bhado khojdai 25k/month
Bijay Tamang, 9803456789, Bhaktapur, ghar bechnu cha 1 ropani 3cr
Anita Gurung 9862223344 chitwan commercial plot lagani garna interested
Narayan KC 9815556677 Butwal buy residential plot 10 aana 1.5 crore
Ram ko ghar kinnu cha 9841234999 Koteshwor
Hostel client from July call leads +977 9808641037 urgent
+977 9844037298 Tikathali 1.65cr ko ghar inquiry`;

const INTENT_STYLES = {
  Buy:     { background: "#eaf3de", color: "#27500a" },
  Rent:    { background: "#e6f1fb", color: "#0c447c" },
  Sell:    { background: "#faeeda", color: "#633806" },
  Invest:  { background: "#fcebeb", color: "#791f1f" },
  Inquiry: { background: "#eeedfe", color: "#3c3489" },
  Unknown: { background: "#f1efe8", color: "#444441" },
};

function esc(s) { return s == null ? "" : String(s); }

function IntentBadge({ intent }) {
  const style = INTENT_STYLES[intent] || INTENT_STYLES.Unknown;
  return <span style={{ ...style, display: "inline-block", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4 }}>{intent || "Unknown"}</span>;
}

function ConfDots({ confidence }) {
  const n = parseInt(confidence) || 1;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: i <= n ? "#c0392b" : "#ddd" }} />)}
    </div>
  );
}

function LangTag({ lang }) {
  if (!lang || lang === "English") return null;
  return <span style={{ background: "#eeedfe", color: "#3c3489", fontSize: 9, fontWeight: 600, padding: "1px 4px", borderRadius: 2, marginLeft: 3 }}>{lang}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShetalLeadExtractor() {
  const [leads, setLeads] = useState([]);
  const [activePanel, setActivePanel] = useState("extract");
  const [rawInput, setRawInput] = useState("");
  const [importText, setImportText] = useState("");
  const [extractStatus, setExtractStatus] = useState({ msg: "", type: "" });
  const [importStatus, setImportStatus] = useState({ msg: "", type: "" });
  const [previewLeads, setPreviewLeads] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterIntent, setFilterIntent] = useState("");
  const [filterLoc, setFilterLoc] = useState("");
  const [filterType, setFilterType] = useState("");
  const [copyStatus, setCopyStatus] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const sw = (panel) => setActivePanel(panel);

  const runExtraction = (text, isImport = false) => {
    const setStatus = isImport ? setImportStatus : setExtractStatus;
    try {
      const newLeads = localExtract(text);
      if (!newLeads.length) { setStatus({ msg: "No phone numbers found.", type: "err" }); return; }
      setLeads(prev => [...prev, ...newLeads]);
      if (!isImport) setPreviewLeads(newLeads);
      setStatus({ msg: `✓ Extracted ${newLeads.length} lead${newLeads.length !== 1 ? "s" : ""}`, type: "ok" });
      if (!isImport) setRawInput(""); else setImportText("");
    } catch (e) {
      setStatus({ msg: "Error: " + e.message, type: "err" });
    }
  };

  const extractLeads = () => {
    if (!rawInput.trim()) { setExtractStatus({ msg: "Paste some data first.", type: "err" }); return; }
    runExtraction(rawInput, false);
  };

  const importData = () => {
    if (!importText.trim()) { setImportStatus({ msg: "Paste or upload data first.", type: "err" }); return; }
    runExtraction(importText, true);
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setImportText(e.target.result);
    reader.readAsText(file);
    sw("import");
  };

  const handleFileInput = (e) => { const f = e.target.files[0]; if (f) readFile(f); };

  const allLocs = [...new Set(leads.map(l => l.location).filter(Boolean))].sort();
  const filteredLeads = leads.filter(l => {
    if (filterIntent && l.intent !== filterIntent) return false;
    if (filterLoc && l.location !== filterLoc) return false;
    if (filterType && l.property_type !== filterType) return false;
    if (searchQ) {
      const hay = [l.name, l.phone, l.location, l.notes, l.budget, l.property_type].join(" ").toLowerCase();
      if (!hay.includes(searchQ.toLowerCase())) return false;
    }
    return true;
  });

  const deleteLead = (id) => setLeads(prev => prev.filter(l => l.id !== id));

  const locCounts = leads.reduce((acc, l) => { if (l.location) acc[l.location] = (acc[l.location] || 0) + 1; return acc; }, {});
  const sortedLocs = Object.entries(locCounts).sort((a, b) => b[1] - a[1]);
  const maxLoc = sortedLocs[0]?.[1] || 1;

  const toCSV = () => {
    const h = ["ID","Name","Phone","Location","Budget","Intent","Property Type","Notes","Confidence","Source","Language"];
    const rows = leads.map(l => [l.id,l.name,l.phone,l.location,l.budget,l.intent,l.property_type,l.notes,l.confidence,l.source_hint,l.detected_language].map(v => '"'+String(v||"").replace(/"/g,'""')+'"').join(","));
    return [h.join(","), ...rows].join("\n");
  };

  const toVCF = () => leads.filter(l => l.phone).map(l => {
    const name = l.name && l.name !== "Unknown" ? l.name : l.phone;
    const d = l.phone.replace(/\D/g,"");
    const intl = d.startsWith("977") ? "+"+d : "+977"+d;
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${intl}\nNOTE:${l.notes||""} | ${l.location||""} | ${l.intent||""}\nEND:VCARD`;
  }).join("\n\n");

  const dl = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const flash = (key, msg) => { setCopyStatus(p => ({ ...p, [key]: msg })); setTimeout(() => setCopyStatus(p => ({ ...p, [key]: "" })), 2500); };

  const copyPhones = (formatted = false) => {
    const phones = leads.filter(l => l.phone).map(l => {
      if (!formatted) return l.phone;
      const d = l.phone.replace(/\D/g,"");
      return d.startsWith("977") ? "+"+d : "+977"+d;
    });
    if (!phones.length) { flash("ph","No numbers"); return; }
    navigator.clipboard.writeText(phones.join("\n")).then(() => flash("ph", `✓ Copied ${phones.length}`)).catch(() => flash("ph","Failed"));
  };

  const stats = {
    total: leads.length,
    phone: leads.filter(l => l.phone).length,
    named: leads.filter(l => l.name && l.name !== "Unknown").length,
    loc: leads.filter(l => l.location).length,
    budget: leads.filter(l => l.budget).length,
  };

  const S = {
    app: { display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: 75, fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#f8f8f7", color: "#1a1a1a", fontSize: 13 },
    main: { display: "flex", flex: 1, minHeight: 0 },
    sidebar: { width: 205, background: "#fff", borderRight: "1px solid rgba(0,0,0,0.08)", padding: "12px 0", flexShrink: 0 },
    sSec: { fontSize: 10, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: "#aaa", padding: "14px 16px 5px" },
    sItem: (active) => ({ display: "flex", alignItems: "center", gap: 9, padding: "8px 16px", fontSize: 13, fontWeight: active ? 600 : 500, color: active ? "#c0392b" : "#666", cursor: "pointer", borderLeft: `3px solid ${active ? "#c0392b" : "transparent"}`, background: active ? "rgba(192,57,43,0.07)" : "transparent", transition: "all 0.1s" }),
    sBadge: { marginLeft: "auto", background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" },
    content: { flex: 1, padding: "22px 26px", overflowY: "auto" },
    pageHd: { fontSize: 17, fontWeight: 700, marginBottom: 3 },
    pageSub: { fontSize: 13, color: "#666", marginBottom: 18 },
    card: { background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 6, padding: 18, marginBottom: 14 },
    cardTitle: { fontSize: 13, fontWeight: 600, marginBottom: 11, display: "flex", alignItems: "center", gap: 7, color: "#444" },
    btn: (v="default") => ({ padding: v==="sm" ? "5px 10px" : "8px 15px", fontSize: v==="sm" ? 12 : 13, fontWeight: 600, borderRadius: 4, border: v==="primary" ? "1px solid #c0392b" : "1px solid rgba(0,0,0,0.12)", background: v==="primary" ? "#c0392b" : "#fff", color: v==="primary" ? "#fff" : v==="danger" ? "#a32d2d" : "#1a1a1a", cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.1s", lineHeight: 1 }),
    textarea: { width: "100%", padding: "9px 11px", fontSize: 12, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4, background: "#fff", color: "#1a1a1a", outline: "none", fontFamily: "'Courier New',monospace", resize: "vertical", lineHeight: 1.65 },
    input: { width: "100%", padding: "8px 11px", fontSize: 13, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4, background: "#fff", color: "#1a1a1a", outline: "none" },
    select: { padding: "7px 10px", fontSize: 12, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 4, background: "#fff", color: "#1a1a1a", outline: "none" },
    tblWrap: { overflowX: "auto", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 4, background: "#fff" },
    th: { textAlign: "left", padding: "9px 11px", fontSize: 10, fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#f8f8f7", whiteSpace: "nowrap" },
    td: { padding: "8px 11px", borderBottom: "1px solid rgba(0,0,0,0.05)", verticalAlign: "middle" },
    stat: { background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 4, padding: "12px 14px" },
    statN: { fontSize: 24, fontWeight: 700, lineHeight: 1 },
    statL: { fontSize: 11, color: "#888", marginTop: 3 },
    note: { fontSize: 11, color: "#aaa", marginTop: 5, lineHeight: 1.5 },
    status: (type) => ({ fontSize: 12, color: type==="ok" ? "#3b6d11" : type==="err" ? "#a32d2d" : "#888", fontWeight: type ? 600 : 400 }),
    dropZone: (over) => ({ border: `1.5px dashed ${over ? "#c0392b" : "rgba(0,0,0,0.15)"}`, borderRadius: 4, padding: 22, textAlign: "center", cursor: "pointer", background: over ? "rgba(192,57,43,0.06)" : "#f8f8f7", transition: "all 0.12s" }),
    exportCard: { background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 6, padding: 16 },
    locCard: { background: "#fff", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 4, padding: "13px 15px", cursor: "pointer", transition: "border-color 0.1s" },
    phoneBox: { fontFamily: "'Courier New',monospace", fontSize: 12, background: "#f8f8f7", border: "1px solid rgba(0,0,0,0.09)", borderRadius: 4, padding: "9px 11px", maxHeight: 120, overflowY: "auto", color: "#666", lineHeight: 1.9, whiteSpace: "pre" },
  };

  return (
    <div style={S.app}>
      <div style={S.main}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          <div style={S.sSec}>Tools</div>
          {["extract","import","contacts","locations"].map(p => (
            <div key={p} style={S.sItem(activePanel===p)} onClick={() => sw(p)}>
              <span>{p==="extract"?"📥":p==="import"?"📂":p==="contacts"?"👥":"📍"}</span>
              {p.charAt(0).toUpperCase()+p.slice(1)}
              {p==="contacts" && leads.length > 0 && <span style={S.sBadge}>{leads.length}</span>}
            </div>
          ))}
          <div style={S.sSec}>Output</div>
          <div style={S.sItem(activePanel==="export")} onClick={() => sw("export")}>
            <span>⬇️</span> Export
          </div>
        </div>

        {/* CONTENT */}
        <div style={S.content}>

          {/* EXTRACT */}
          {activePanel==="extract" && (
            <div>
              <div style={S.pageHd}>Extract Leads</div>
              <div style={S.pageSub}>Paste raw lead data — Nepali, English, Roman Nepali, or mixed. Extracts instantly, no API needed.</div>
              <div style={S.card}>
                <div style={S.cardTitle}>📋 Raw Lead Data</div>
                <textarea style={S.textarea} rows={11} value={rawInput} onChange={e => setRawInput(e.target.value)}
                  placeholder={`Paste anything — Nepali, English, Roman Nepali, or mixed:\n\nBegam KHADKA +977 9849297074 Mandikatar flat owner\nRam ko ghar kinnu cha 9841234567 Koteshwor\nSita didi 9803456789 Patan ma flat bhado khojdai\nMissed calls\n+977 9808949791\n+977 9851277969`} />
                <div style={S.note}>⚡ Works offline — no API key needed · Handles: +977 prefix · Devanagari digits · Roman Nepali (ghar, bhado, kinnu, bechnu, jagga, aana, ropani) · missed call lists · 100+ Nepal locations</div>
                <div style={{ display:"flex", gap:8, marginTop:11, alignItems:"center", flexWrap:"wrap" }}>
                  <button style={S.btn("primary")} onClick={extractLeads}>✨ Extract Leads</button>
                  <button style={S.btn()} onClick={() => setRawInput(SAMPLE)}>Load sample</button>
                  <button style={S.btn("danger")} onClick={() => { if (!leads.length || window.confirm(`Delete all ${leads.length} leads?`)) { setLeads([]); setPreviewLeads(null); setExtractStatus({msg:"",type:""}); } }}>🗑 Clear all</button>
                  <span style={S.status(extractStatus.type)}>{extractStatus.msg}</span>
                </div>
              </div>

              {previewLeads && previewLeads.length > 0 && (
                <div style={S.card}>
                  <div style={S.cardTitle}>✅ Extraction Preview — {previewLeads.length} leads added</div>
                  <div style={S.tblWrap}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:700 }}>
                      <thead><tr>{["Name","Phone","Location","Budget","Intent","Type","Conf.","Lang","Notes"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {previewLeads.map(l => (
                          <tr key={l.id}>
                            <td style={S.td}><strong>{esc(l.name)}</strong>{l.name==="Unknown" && <span style={{background:"#f1efe8",color:"#5f5e5a",fontSize:9,fontWeight:600,padding:"1px 4px",borderRadius:2,marginLeft:3}}>?</span>}</td>
                            <td style={{...S.td,fontFamily:"monospace",fontSize:11}}>{esc(l.phone)||"—"}</td>
                            <td style={S.td}>{esc(l.location)||"—"}</td>
                            <td style={{...S.td,fontSize:11}}>{esc(l.budget)||"—"}</td>
                            <td style={S.td}><IntentBadge intent={l.intent}/></td>
                            <td style={{...S.td,fontSize:11}}>{esc(l.property_type)||"—"}</td>
                            <td style={S.td}><ConfDots confidence={l.confidence}/></td>
                            <td style={S.td}><LangTag lang={l.detected_language}/></td>
                            <td style={{...S.td,fontSize:11,color:"#777",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{esc(l.notes)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{marginTop:10}}><button style={S.btn("primary")} onClick={() => sw("contacts")}>View All Contacts →</button></div>
                </div>
              )}
            </div>
          )}

          {/* IMPORT */}
          {activePanel==="import" && (
            <div>
              <div style={S.pageHd}>Import File</div>
              <div style={S.pageSub}>Import from CSV, TXT, VCF, or TSV — paste or drag & drop.</div>
              <div style={S.card}>
                <div style={S.cardTitle}>📂 Upload File</div>
                <div style={S.dropZone(dragOver)}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); }}>
                  <div style={{fontSize:28,marginBottom:6}}>📁</div>
                  <div style={{fontSize:13,color:"#555"}}>Click to choose or drag & drop a file here</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:3}}>Supports: .csv · .txt · .vcf · .tsv</div>
                </div>
                <input ref={fileInputRef} type="file" accept=".csv,.txt,.vcf,.tsv" style={{display:"none"}} onChange={handleFileInput} />
                <div style={{height:1,background:"rgba(0,0,0,0.06)",margin:"14px 0"}} />
                <div style={S.cardTitle}>📋 Or paste CSV / TSV / raw text</div>
                <textarea style={S.textarea} rows={7} value={importText} onChange={e => setImportText(e.target.value)}
                  placeholder={"Paste CSV, TSV, or any raw text with phone numbers…\n\nName,Phone,Location\nRam Bahadur,9841234567,Kathmandu\n,9851112233,Lalitpur"} />
                <div style={{display:"flex",gap:8,marginTop:11,alignItems:"center"}}>
                  <button style={S.btn("primary")} onClick={importData}>📂 Import & Extract</button>
                  <span style={S.status(importStatus.type)}>{importStatus.msg}</span>
                </div>
              </div>
            </div>
          )}

          {/* CONTACTS */}
          {activePanel==="contacts" && (
            <div>
              <div style={S.pageHd}>All Contacts</div>
              <div style={S.pageSub}>Every extracted lead — searchable, filterable.</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:16}}>
                {[{n:stats.total,l:"Total leads"},{n:stats.phone,l:"With phone"},{n:stats.named,l:"Named"},{n:stats.loc,l:"With location"},{n:stats.budget,l:"With budget"}].map(({n,l}) => (
                  <div key={l} style={S.stat}><div style={S.statN}>{n}</div><div style={S.statL}>{l}</div></div>
                ))}
              </div>
              <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
                <input style={{...S.input,flex:1,minWidth:140}} placeholder="Search name, phone, location…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                <select style={S.select} value={filterIntent} onChange={e => setFilterIntent(e.target.value)}>
                  <option value="">All intents</option>
                  {["Buy","Rent","Sell","Invest","Inquiry","Unknown"].map(v => <option key={v}>{v}</option>)}
                </select>
                <select style={S.select} value={filterLoc} onChange={e => setFilterLoc(e.target.value)}>
                  <option value="">All locations</option>
                  {allLocs.map(l => <option key={l}>{l}</option>)}
                </select>
                <select style={S.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All types</option>
                  {["Apartment","House","Land","Office","Plot","Commercial","Flat"].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div style={S.tblWrap}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:780}}>
                  <thead><tr>{["#","Name","Phone","Location","Budget","Intent","Type","Lang","Notes",""].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredLeads.length===0 ? (
                      <tr><td colSpan={10}><div style={{textAlign:"center",padding:"30px 12px",color:"#bbb",fontSize:13}}><div style={{fontSize:28,marginBottom:6}}>{leads.length?"🔍":"📭"}</div>{leads.length?"No leads match.":"No leads yet."}</div></td></tr>
                    ) : filteredLeads.map((l,i) => (
                      <tr key={l.id}>
                        <td style={{...S.td,color:"#bbb",fontSize:11}}>{i+1}</td>
                        <td style={S.td}>
                          <strong style={{fontSize:12}}>{esc(l.name)}</strong>
                          {l.name==="Unknown" && <span style={{background:"#f1efe8",color:"#5f5e5a",fontSize:9,fontWeight:600,padding:"1px 4px",borderRadius:2,marginLeft:3}}>?</span>}
                          {l.source_hint && <div style={{fontSize:10,color:"#bbb"}}>{esc(l.source_hint)}</div>}
                        </td>
                        <td style={{...S.td,fontFamily:"monospace",fontSize:11}}>{esc(l.phone)||"—"}</td>
                        <td style={{...S.td,fontSize:12}}>{esc(l.location)||"—"}</td>
                        <td style={{...S.td,fontSize:11}}>{esc(l.budget)||"—"}</td>
                        <td style={S.td}><IntentBadge intent={l.intent}/></td>
                        <td style={{...S.td,fontSize:11}}>{esc(l.property_type)||"—"}</td>
                        <td style={S.td}><LangTag lang={l.detected_language}/></td>
                        <td style={{...S.td,fontSize:11,color:"#777",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={esc(l.notes)}>{esc(l.notes)}</td>
                        <td style={S.td}><button onClick={() => deleteLead(l.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:13,padding:"2px 5px"}}>🗑</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LOCATIONS */}
          {activePanel==="locations" && (
            <div>
              <div style={S.pageHd}>Leads by Location</div>
              <div style={S.pageSub}>Geographic distribution across Nepal. Click a card to filter contacts.</div>
              {sortedLocs.length===0 ? (
                <div style={{textAlign:"center",padding:36,color:"#bbb"}}>No location data yet.</div>
              ) : (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:9}}>
                  {sortedLocs.map(([loc,count]) => (
                    <div key={loc} style={S.locCard} onClick={() => { setFilterLoc(loc); sw("contacts"); }}>
                      <div style={{fontSize:26,fontWeight:700,color:"#c0392b",lineHeight:1}}>{count}</div>
                      <div style={{fontSize:13,fontWeight:600,marginTop:2}}>{loc}</div>
                      <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{Math.round(count/leads.length*100)}% of all leads</div>
                      <div style={{height:2,background:"rgba(192,57,43,0.12)",borderRadius:2,marginTop:8}}>
                        <div style={{height:2,background:"#c0392b",borderRadius:2,width:`${Math.round(count/maxLoc*100)}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXPORT */}
          {activePanel==="export" && (
            <div>
              <div style={S.pageHd}>Export</div>
              <div style={S.pageSub}>Download leads in multiple formats or copy for WhatsApp broadcast.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div style={S.exportCard}>
                  <h3 style={{fontSize:13,fontWeight:600,marginBottom:5}}>📊 Download CSV</h3>
                  <p style={{fontSize:12,color:"#777",marginBottom:12,lineHeight:1.5}}>All leads as .csv — opens in Excel or Google Sheets.</p>
                  <button style={S.btn("primary")} onClick={() => { if (!leads.length) return alert("No leads."); dl(toCSV(), `shetal-leads-${new Date().toISOString().slice(0,10)}.csv`, "text/csv;charset=utf-8;"); }}>⬇ Download CSV</button>
                </div>
                <div style={S.exportCard}>
                  <h3 style={{fontSize:13,fontWeight:600,marginBottom:5}}>📄 Download JSON</h3>
                  <p style={{fontSize:12,color:"#777",marginBottom:12,lineHeight:1.5}}>Full data as JSON — for developers or CRM import.</p>
                  <button style={S.btn()} onClick={() => { if (!leads.length) return alert("No leads."); dl(JSON.stringify(leads,null,2), `shetal-leads-${new Date().toISOString().slice(0,10)}.json`, "application/json"); }}>⬇ Download JSON</button>
                </div>
                <div style={S.exportCard}>
                  <h3 style={{fontSize:13,fontWeight:600,marginBottom:5}}>📱 Download VCF</h3>
                  <p style={{fontSize:12,color:"#777",marginBottom:12,lineHeight:1.5}}>Phone contacts — import directly into your phone.</p>
                  <button style={S.btn()} onClick={() => { if (!leads.length) return alert("No leads."); dl(toVCF(), `shetal-leads-${new Date().toISOString().slice(0,10)}.vcf`, "text/vcard"); }}>⬇ Download VCF</button>
                </div>
              </div>
              <div style={{...S.exportCard,marginBottom:12}}>
                <h3 style={{fontSize:13,fontWeight:600,marginBottom:5}}>📋 Copy for Excel</h3>
                <p style={{fontSize:12,color:"#777",marginBottom:10,lineHeight:1.5}}>Tab-separated — paste directly into Excel or Google Sheets.</p>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <button style={S.btn()} onClick={() => {
                    if (!leads.length) return;
                    const h = ["Name","Phone","Location","Budget","Intent","Property Type","Notes"];
                    const rows = leads.map(l => [l.name,l.phone,l.location,l.budget,l.intent,l.property_type,l.notes].join("\t"));
                    navigator.clipboard.writeText([h.join("\t"),...rows].join("\n")).then(() => flash("tbl","✓ Copied!")).catch(() => flash("tbl","Failed"));
                  }}>📋 Copy table</button>
                  <span style={S.status("ok")}>{copyStatus.tbl}</span>
                </div>
              </div>
              <div style={S.exportCard}>
                <h3 style={{fontSize:13,fontWeight:600,marginBottom:5}}>📱 WhatsApp Numbers</h3>
                <p style={{fontSize:12,color:"#777",marginBottom:8,lineHeight:1.5}}>All phone numbers — ready for bulk broadcast.</p>
                <div style={S.phoneBox}>{leads.filter(l=>l.phone).length ? leads.filter(l=>l.phone).map(l=>l.phone).join("\n") : "No phone numbers yet."}</div>
                <div style={{display:"flex",gap:7,marginTop:8,alignItems:"center"}}>
                  <button style={{...S.btn(),padding:"5px 9px",fontSize:11}} onClick={() => copyPhones(false)}>📋 Copy numbers</button>
                  <button style={{...S.btn(),padding:"5px 9px",fontSize:11}} onClick={() => copyPhones(true)}>Copy with +977</button>
                  <span style={S.status("ok")}>{copyStatus.ph}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>
    </div>
  );
}