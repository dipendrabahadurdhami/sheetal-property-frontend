import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "./Gallery.css";

/* ────────────────────────────────────────────────────────────────────────
   /galery — an animated, mouse-driven oval showcase of every property
   category. No header / footer — this page is meant to stand on its own.

   How it works
   ─────────────
   • A ring of thin photo "slats" is arranged around an oval using real
     ellipse geometry (x = rx·sin θ, y = -ry·cos θ).
   • Each slat gets a CSS 3D rotateY = 90·cos(θ). That single formula is
     what makes the top/bottom of the oval look like an edge-on sliver and
     the left/right look like a full, flat photo — with the browser's own
     perspective engine doing the width-foreshortening for us.
   • The whole ring is nudged by a continuous rotation value that drifts
     toward the pointer's horizontal position (plus a tiny idle drift so
     it's never fully still). This is driven imperatively (refs + rAF),
     not React state, so 100+ slats can animate at 60fps without
     re-rendering the tree every frame.
   • Category labels are fixed around the oval (they don't spin). Hovering
     one crossfades the centre panel to a sample photo + live count for
     that category; clicking sends the visitor to the full search results.
   ──────────────────────────────────────────────────────────────────────── */

// Sensible fallback categories so the page still looks intentional even
// before the API responds (or if a project has zero listings in a type).
const FALLBACK_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Land / Plot",
  "Commercial Space",
  "Office",
  "Shop",
  "Warehouse",
  "Hotel & Resort",
  "Guest House",
  "Farm House",
  "Penthouse",
  "Duplex",
  "Row House",
  "Studio",
];

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420'>
       <rect width='300' height='420' fill='#EEEFEC'/>
       <rect x='0' y='0' width='300' height='420' fill='url(#g)'/>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
         <stop offset='0' stop-color='#F1F1EE'/>
         <stop offset='1' stop-color='#E4E5E0'/>
       </linearGradient></defs>
     </svg>`
  );

const TOTAL_SLATS = 150; // roughly how many thin photo slats fill the ring
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

const Gallery = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const slatRefs = useRef([]);
  const leaveTimer = useRef(null);

  const rotation = useRef(0);
  const velocity = useRef(0);
  const targetVelocity = useRef(0.035); // small idle drift so it's never static
  const pointer = useRef({ x: null, y: null });
  const dotPos = useRef({ x: 0, y: 0 });
  const dims = useRef({ rx: 560, ry: 230 });

  /* ── fetch property types + a live sample/count per category ────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const attrRes = await apiClient.get("/property-attributes");
        const apiTypes = attrRes?.data?.data?.property_types;
        const typeNames =
          Array.isArray(apiTypes) && apiTypes.length
            ? apiTypes.map((t) => t?.name).filter(Boolean)
            : FALLBACK_TYPES;

        const settled = await Promise.allSettled(
          typeNames.map((name) =>
            apiClient.get("/search", {
              params: { property_type: name, itemsPerPage: 10, page: 1 },
            })
          )
        );

        if (cancelled) return;

        let grandTotal = 0;
        const cats = typeNames.map((name, i) => {
          const r = settled[i];
          let images = [];
          let count = 0;
          if (r.status === "fulfilled") {
            const raw = r.value?.data?.data ?? r.value?.data ?? [];
            const list = Array.isArray(raw) ? raw : [];
            images = list.map((p) => p?.feature_image).filter(Boolean);
            count =
              r.value?.data?.total ??
              r.value?.data?.meta?.total ??
              list.length;
          }
          grandTotal += Number(count) || 0;
          return {
            name,
            count: Number(count) || 0,
            images: images.length ? images : [FALLBACK_IMG],
          };
        });

        setCategories(cats);
        setTotalCount(grandTotal || null);
      } catch (e) {
        if (!cancelled) {
          setCategories(
            FALLBACK_TYPES.map((name) => ({
              name,
              count: 0,
              images: [FALLBACK_IMG],
            }))
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── build the flat list of ring "slats", each owned by a category ──── */
  const slats = useMemo(() => {
    if (!categories.length) return [];
    const n = categories.length;
    const arc = 360 / n;
    const perCat = Math.max(6, Math.round(TOTAL_SLATS / n));
    const out = [];
    categories.forEach((cat, ci) => {
      const start = ci * arc;
      for (let i = 0; i < perCat; i++) {
        const baseAngle = start + (i / perCat) * arc;
        out.push({
          key: `${ci}-${i}`,
          baseAngle,
          img: cat.images[i % cat.images.length],
        });
      }
    });
    return out;
  }, [categories]);

  slatRefs.current = useMemo(
    () => slats.map((_, i) => slatRefs.current[i] || React.createRef()),
    [slats]
  );

  /* ── size the oval to the viewport ───────────────────────────────────── */
  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      dims.current = {
        rx: clamp(w * 0.4, 260, 640),
        ry: clamp(h * 0.32, 140, 300),
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ── pointer tracking ────────────────────────────────────────────────── */
  useEffect(() => {
    const onMove = (clientX, clientY) => {
      pointer.current = { x: clientX, y: clientY };
      const w = window.innerWidth;
      const nx = clamp((clientX - w / 2) / (w / 2), -1, 1);
      targetVelocity.current = nx * 0.9 + Math.sign(nx || 1) * 0.02;
    };
    const mouseHandler = (e) => onMove(e.clientX, e.clientY);
    const touchHandler = (e) => {
      const t = e.touches?.[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const leaveHandler = () => {
      targetVelocity.current = 0.035;
    };

    window.addEventListener("mousemove", mouseHandler, { passive: true });
    window.addEventListener("touchmove", touchHandler, { passive: true });
    window.addEventListener("mouseleave", leaveHandler);

    return () => {
      window.removeEventListener("mousemove", mouseHandler);
      window.removeEventListener("touchmove", touchHandler);
      window.removeEventListener("mouseleave", leaveHandler);
    };
  }, []);

  /* ── the animation loop: imperative DOM writes, no React re-render ──── */
  useEffect(() => {
    let raf;
    const tick = () => {
      velocity.current = lerp(velocity.current, targetVelocity.current, 0.05);
      rotation.current = (rotation.current + velocity.current) % 360;

      const { rx, ry } = dims.current;
      const rot = rotation.current;

      slatRefs.current.forEach((ref, i) => {
        const el = ref.current;
        const s = slats[i];
        if (!el || !s) return;
        const theta = s.baseAngle + rot;
        const rad = (theta * Math.PI) / 180;
        const x = rx * Math.sin(rad);
        const y = -ry * Math.cos(rad);
        const rotY = 90 * Math.cos(rad);
        const z = Math.round(Math.abs(Math.sin(rad)) * 100);
        el.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(
          1
        )}px, ${y.toFixed(1)}px, 0) rotateY(${rotY.toFixed(1)}deg)`;
        el.style.zIndex = z;
      });

      if (pointer.current.x !== null) {
        dotPos.current.x = lerp(dotPos.current.x, pointer.current.x, 0.18);
        dotPos.current.y = lerp(dotPos.current.y, pointer.current.y, 0.18);
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%,-50%)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slats]);

  /* ── label hover / focus handlers ────────────────────────────────────── */
  const handleEnter = useCallback((idx) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveIdx(idx);
  }, []);
  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveIdx(null), 120);
  }, []);
  const goToCategory = useCallback(
    (name) => {
      navigate(`/productSearch?property_type=${encodeURIComponent(name)}`);
    },
    [navigate]
  );

  const n = categories.length;
  const active = activeIdx !== null ? categories[activeIdx] : null;

  return (
    <div className="gly-page">
      {/* top bar — intentionally minimal, no site header/footer here */}
      <div className="gly-topbar">
        <button className="gly-brand" onClick={() => navigate("/")}>
          Sheetal<span>.</span>
        </button>
        <div className="gly-top-right">
          <button
            className="gly-link"
            onClick={() => navigate("/productSearch")}
          >
            Grid view
          </button>
        </div>
      </div>

      <div className="gly-stage" ref={stageRef}>
        {loading && (
          <div className="gly-loading">
            <span className="gly-loading-dot" />
            Loading properties…
          </div>
        )}

        <div className="gly-ring" ref={ringRef} aria-hidden="true">
          {slats.map((s, i) => (
            <div className="gly-slat" key={s.key} ref={slatRefs.current[i]}>
              <img src={s.img} alt="" loading="lazy" draggable={false} />
            </div>
          ))}
        </div>

        {/* fixed category labels around the oval */}
        <div className="gly-labels">
          {categories.map((cat, i) => {
            const angle = (360 / n) * i;
            const rad = (angle * Math.PI) / 180;
            const lx = 50 + Math.sin(rad) * 45;
            const ly = 50 - Math.cos(rad) * 46;
            return (
              <button
                key={cat.name}
                className={`gly-label${activeIdx === i ? " is-active" : ""}`}
                style={{ left: `${lx}%`, top: `${ly}%` }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
                onFocus={() => handleEnter(i)}
                onBlur={handleLeave}
                onClick={() => goToCategory(cat.name)}
              >
                {cat.name}
                <sup>{cat.count > 0 ? `(${cat.count})` : ""}</sup>
              </button>
            );
          })}
        </div>

        {/* centre panel: idle brand state, or the hovered category */}
        <div className="gly-center">
          {active ? (
            <div className="gly-center-inner is-cat" key={active.name}>
              <div className="gly-center-thumb">
                <img src={active.images[0]} alt={active.name} />
              </div>
              <h2>{active.name}</h2>
              <p>
                {active.count > 0
                  ? `${active.count.toLocaleString()} listings`
                  : "Explore listings"}
              </p>
            </div>
          ) : (
            <div className="gly-center-inner is-idle" key="idle">
              <h1>
                We are <span>Sheetal.</span>
              </h1>
              <p>
                {totalCount
                  ? `${totalCount.toLocaleString()}+ properties across Nepal`
                  : "Every property, beautifully organised."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="gly-dot" ref={dotRef} />
    </div>
  );
};

export default Gallery;