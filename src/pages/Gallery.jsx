import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "./Gallery.css";

/* ────────────────────────────────────────────────────────────────────────
   /galery — oval photo-ring showcase (rewritten from scratch for speed)

   Behaviour (matched frame-by-frame from the reference clip):
   • A ring of photo "slats" sits on an ellipse. Moving the mouse spins the
     ring like a wheel — speed comes from how fast the cursor is moving,
     not where it is. Scrolling gives the same ring a "flick".
   • The whole ring also tilts a few degrees toward wherever the cursor
     is on screen (cheap parallax), and eases back flat when the pointer
     leaves the window.
   • Category names are fixed around the oval (they never spin) and their
     text always grows *inward* so long names can't clip off-screen.
   • Centre panel: while idle it auto-cycles through real projects (photo
     + title + category), like a slideshow. Hovering a category label
     swaps it to that category's summary. Hovering one photo directly
     pops that exact photo out of the ring AND mirrors that same photo's
     title/category into the centre panel — never a random/different one.
   • Clicking a photo gives the ring a short spin flourish (like the
     video's transition) and fades the stage out, then opens that exact
     property's page.

   Performance rewrite:
   • The old version called Math.sin/Math.cos 3-4× per slat, per frame
     (1000+ trig calls/frame for 320 slats). This version precomputes
     each slat's base sin/cos ONCE, then uses the angle-sum identities
     (sin(a+r) = sinA·cosR + cosA·sinR, etc.) so a whole frame only needs
     TWO trig calls total, no matter how many slats exist. Everything
     else is plain multiply/add.
   • Slat transforms are only written to the DOM on frames where the ring
     actually moved (rotation or tilt) — a fully idle ring does zero work.
   • Typed arrays (Float32Array) instead of objects, so the hot loop never
     allocates or triggers React re-renders.
   ──────────────────────────────────────────────────────────────────────── */

const FALLBACK_TYPES = [
  "Apartment", "House", "Villa", "Land / Plot", "Commercial Space", "Office",
  "Shop", "Warehouse", "Hotel & Resort", "Guest House", "Farm House",
  "Penthouse", "Duplex", "Row House", "Studio",
];

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420'>
       <rect width='300' height='420' fill='#EEEFEC'/>
       <rect width='300' height='420' fill='url(#g)'/>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
         <stop offset='0' stop-color='#F1F1EE'/><stop offset='1' stop-color='#E4E5E0'/>
       </linearGradient></defs>
     </svg>`
  );

const TOTAL_SLATS = 240;           // dense but noticeably lighter than 320
const AUTOPLAY_MS = 4200;          // idle centre-panel slideshow interval
const ROT_Y_AMPLITUDE = 78;
const ROT_Y_CLAMP = 84;
const TILT_MAX_X = 9;
const TILT_MAX_Y = 13;
const LABEL_GAP_X = 110;
const LABEL_GAP_Y = 70;
const WHEEL_SENSITIVITY = 0.045;
const WHEEL_MAX_BOOST = 5;
const WHEEL_DECAY = 0.93;
const MAX_DT_FACTOR = 3;
const SETTLE_EPS = 0.002;
const DEG2RAD = Math.PI / 180;
const CLICK_TRANSITION_FRAMES = 34; // ~0.55s at 60fps
const CLICK_SPIN_KICK = 3.4;        // extra spin impulse when a photo is clicked

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpDt = (a, b, rate, dtFactor) => lerp(a, b, 1 - Math.pow(1 - rate, dtFactor));

// Equal ARC-LENGTH spacing (not equal angle) so the visually-thin top/
// bottom of the oval still gets enough slats to stay gapless. Runs once
// per category set, never in the hot loop.
function buildArcLengthThetas(startDeg, endDeg, count, rx, ry) {
  const STEPS = 180;
  const startRad = startDeg * DEG2RAD;
  const dTheta = ((endDeg - startDeg) * DEG2RAD) / STEPS;
  const cum = new Float64Array(STEPS + 1);
  for (let i = 1; i <= STEPS; i++) {
    const t = startRad + i * dTheta;
    const speed = Math.sqrt((rx * Math.cos(t)) ** 2 + (ry * Math.sin(t)) ** 2);
    cum[i] = cum[i - 1] + speed * dTheta;
  }
  const total = cum[STEPS] || 1;
  const thetas = new Float64Array(count);
  for (let k = 0; k < count; k++) {
    const target = (k / count) * total;
    let lo = 0, hi = STEPS;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1; else hi = mid;
    }
    thetas[k] = (startRad + lo * dTheta) / DEG2RAD;
  }
  return thetas;
}

const Gallery = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);     // hovered label
  const [hoveredItem, setHoveredItem] = useState(null);  // hovered slat (for a11y/click only)
  const [autoIdx, setAutoIdx] = useState(0);             // idle slideshow position
  const [isTransitioning, setIsTransitioning] = useState(false); // click → navigate

  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const slatEls = useRef([]);
  const labelLeaveTimer = useRef(null);
  const itemLeaveTimer = useRef(null);
  const hoveredSlatIndex = useRef(null);
  const clickTransition = useRef(null); // { idx, frame, targetSlat }

  const rotation = useRef(0);
  const velocity = useRef(0);
  const targetVelocity = useRef(0);
  const wheelBoost = useRef(0);
  const pointer = useRef({ x: null, y: null });
  const prevFrameX = useRef(null);
  const dotPos = useRef({ x: 0, y: 0 });
  const dims = useRef({ rx: 560, ry: 230 });
  const lastTime = useRef(null);
  const [labelDims, setLabelDims] = useState({ rx: 560, ry: 230 });
  const tilt = useRef({ x: 0, y: 0 });
  const tiltTarget = useRef({ x: 0, y: 0 });

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
            apiClient.get("/search", { params: { property_type: name, itemsPerPage: 14, page: 1 } })
          )
        );
        if (cancelled) return;

        let grandTotal = 0;
        const raw = typeNames.map((name, i) => {
          const r = settled[i];
          let items = [], count = 0;
          if (r.status === "fulfilled") {
            const body = r.value?.data?.data ?? r.value?.data ?? [];
            const list = Array.isArray(body) ? body : [];
            items = list.filter((p) => p?.feature_image).map((p) => ({
              img: p.feature_image,
              title: p?.title || p?.name || name,
              id: p?.url || p?.id || null,
              location: p?.property_location || "",
            }));
            count = r.value?.data?.total ?? r.value?.data?.meta?.total ?? list.length;
          }
          grandTotal += Number(count) || 0;
          return { name, count: Number(count) || 0, items };
        });

        const pool = raw.flatMap((c) => c.items);
        const cats = raw.map((c) => ({
          ...c,
          items: c.items.length ? c.items : pool.length ? pool
            : [{ img: FALLBACK_IMG, title: c.name, id: null, location: "" }],
        }));

        setCategories(cats);
      } catch {
        if (!cancelled) {
          setCategories(FALLBACK_TYPES.map((name) => ({
            name, count: 0,
            items: [{ img: FALLBACK_IMG, title: name, id: null, location: "" }],
          })));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── size the oval to the viewport ───────────────────────────────────── */
  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      const next = {
        rx: clamp(el.clientWidth * 0.34, 300, 620),
        ry: clamp(el.clientHeight * 0.4, 220, 380),
      };
      dims.current = next;
      setLabelDims(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* ── build slats + precomputed trig (the perf win) ───────────────────── */
  const { slats, sinBase, cosBase } = useMemo(() => {
    if (!categories.length) return { slats: [], sinBase: null, cosBase: null };
    const n = categories.length;
    const arc = 360 / n;
    const perCat = Math.max(6, Math.round(TOTAL_SLATS / n));
    const { rx, ry } = dims.current;
    const out = [];
    categories.forEach((cat, ci) => {
      const start = ci * arc;
      const thetas = buildArcLengthThetas(start, start + arc, perCat, rx, ry);
      for (let i = 0; i < thetas.length; i++) {
        const item = cat.items[i % cat.items.length];
        out.push({
          key: `${ci}-${i}`,
          baseAngle: thetas[i],
          img: item.img,
          title: item.title,
          id: item.id,
          catName: cat.name,
        });
      }
    });
    const sinB = new Float32Array(out.length);
    const cosB = new Float32Array(out.length);
    out.forEach((s, i) => {
      const rad = s.baseAngle * DEG2RAD;
      sinB[i] = Math.sin(rad);
      cosB[i] = Math.cos(rad);
    });
    return { slats: out, sinBase: sinB, cosBase: cosB };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  slatEls.current = useMemo(
    () => slats.map((_, i) => slatEls.current[i] || React.createRef()),
    [slats]
  );

  /* ── idle centre-panel slideshow (paused while hovering) ─────────────── */
  useEffect(() => {
    if (!slats.length) return;
    const id = setInterval(() => {
      if (activeIdx === null && hoveredSlatIndex.current === null && !clickTransition.current) {
        setAutoIdx((v) => (v + 1) % slats.length);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [slats.length, activeIdx]);

  /* ── pointer tracking ─────────────────────────────────────────────────
     Only raw position is stored here; rotation speed is derived from
     frame-to-frame delta inside the loop, so the ring settles the moment
     the cursor stops instead of drifting forever. */
  useEffect(() => {
    const onMove = (x, y) => { pointer.current = { x, y }; };
    const mouseHandler = (e) => onMove(e.clientX, e.clientY);
    const touchHandler = (e) => { const t = e.touches?.[0]; if (t) onMove(t.clientX, t.clientY); };
    const leaveHandler = () => {
      pointer.current = { x: null, y: null };
      prevFrameX.current = null;
      tiltTarget.current = { x: 0, y: 0 };
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

  /* ── wheel gives the ring a flick ────────────────────────────────────── */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      wheelBoost.current = clamp(
        wheelBoost.current + e.deltaY * WHEEL_SENSITIVITY,
        -WHEEL_MAX_BOOST, WHEEL_MAX_BOOST
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ── the animation loop ──────────────────────────────────────────────── */
  useEffect(() => {
    let raf;
    let needsInitialPaint = true;
    lastTime.current = null;

    const tick = (now) => {
      if (lastTime.current === null) lastTime.current = now;
      const dtFactor = clamp((now - lastTime.current) / (1000 / 60), 0, MAX_DT_FACTOR) || 1;
      lastTime.current = now;

      if (pointer.current.x !== null) {
        if (prevFrameX.current === null) prevFrameX.current = pointer.current.x;
        const dx = pointer.current.x - prevFrameX.current;
        prevFrameX.current = pointer.current.x;
        targetVelocity.current = clamp((dx / dtFactor) * 0.55, -3.2, 3.2);
      } else {
        targetVelocity.current = 0;
      }

      velocity.current = lerpDt(velocity.current, targetVelocity.current, 0.4, dtFactor);
      if (Math.abs(velocity.current) < 0.002) velocity.current = 0;

      wheelBoost.current *= Math.pow(WHEEL_DECAY, dtFactor);
      if (Math.abs(wheelBoost.current) < 0.001) wheelBoost.current = 0;

      const spinDelta = (velocity.current + wheelBoost.current) * dtFactor;
      if (spinDelta !== 0) rotation.current = (rotation.current + spinDelta) % 360;

      const stageEl = stageRef.current;
      if (stageEl && pointer.current.x !== null) {
        const rect = stageEl.getBoundingClientRect();
        const nx = clamp((pointer.current.x - (rect.left + rect.width / 2)) / (rect.width / 2), -1, 1);
        const ny = clamp((pointer.current.y - (rect.top + rect.height / 2)) / (rect.height / 2), -1, 1);
        tiltTarget.current = { x: -ny * TILT_MAX_X, y: nx * TILT_MAX_Y };
      } else {
        tiltTarget.current = { x: 0, y: 0 };
      }
      tilt.current.x = lerpDt(tilt.current.x, tiltTarget.current.x, 0.14, dtFactor);
      tilt.current.y = lerpDt(tilt.current.y, tiltTarget.current.y, 0.14, dtFactor);
      const tiltMoving =
        Math.abs(tilt.current.x - tiltTarget.current.x) > SETTLE_EPS ||
        Math.abs(tilt.current.y - tiltTarget.current.y) > SETTLE_EPS;

      if (ringRef.current && (tiltMoving || needsInitialPaint)) {
        ringRef.current.style.transform =
          `translate(-50%,-50%) rotateX(${tilt.current.x.toFixed(2)}deg) rotateY(${tilt.current.y.toFixed(2)}deg)`;
      }

      // click → navigate flourish: keep spinning the ring a little and
      // grow the clicked photo until it fills more of the stage, then
      // the timeout below fires the real navigation.
      const ct = clickTransition.current;
      if (ct) {
        ct.frame += dtFactor;
        wheelBoost.current = lerpDt(wheelBoost.current, ct.spinSign * 1.4, 0.15, dtFactor);
        if (ringRef.current) {
          const fade = clamp(1 - ct.frame / CLICK_TRANSITION_FRAMES, 0, 1);
          ringRef.current.style.opacity = 0.35 + 0.65 * fade;
        }
      }

      // ---- the hot path: angle-sum trig instead of per-slat sin/cos ----
      if ((spinDelta !== 0 || needsInitialPaint || ct) && sinBase) {
        const { rx, ry } = dims.current;
        const rotRad = rotation.current * DEG2RAD;
        const cosR = Math.cos(rotRad);
        const sinR = Math.sin(rotRad);
        const hoveredIdx = hoveredSlatIndex.current;
        const els = slatEls.current;
        const clickIdx = ct ? ct.idx : null;
        const clickProgress = ct ? clamp(ct.frame / CLICK_TRANSITION_FRAMES, 0, 1) : 0;
        const clickScale = ct ? 1.22 + clickProgress * 1.4 : 1;
        const clickZ = ct ? 60 + clickProgress * 260 : 0;

        for (let i = 0; i < els.length; i++) {
          const el = els[i].current;
          if (!el) continue;
          const sA = sinBase[i], cA = cosBase[i];
          const sinTheta = sA * cosR + cA * sinR;
          const cosTheta = cA * cosR - sA * sinR;
          const x = rx * sinTheta;
          const y = -ry * cosTheta;
          const rotY = clamp(ROT_Y_AMPLITUDE * cosTheta, -ROT_Y_CLAMP, ROT_Y_CLAMP);
          const spin = (slats[i].baseAngle + rotation.current) % 360;
          const z = (Math.abs(sinTheta) * 100) | 0;

          if (i === clickIdx) {
            el.style.transform =
              `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${clickZ.toFixed(0)}px) rotateY(0deg) rotate(0deg) scale(${clickScale.toFixed(2)})`;
            el.style.zIndex = 1000;
            el.style.opacity = 1;
          } else if (i === hoveredIdx && !ct) {
            el.style.transform =
              `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,60px) rotateY(${rotY.toFixed(1)}deg) rotate(${spin.toFixed(1)}deg) scale(1.22)`;
            el.style.zIndex = 999;
          } else {
            el.style.transform =
              `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotateY(${rotY.toFixed(1)}deg) rotate(${spin.toFixed(1)}deg)`;
            el.style.zIndex = z;
            if (ct) el.style.opacity = clamp(1 - clickProgress, 0.15, 1);
          }
        }
      }

      if (pointer.current.x !== null) {
        const dotDx = pointer.current.x - dotPos.current.x;
        const dotDy = pointer.current.y - dotPos.current.y;
        dotPos.current.x = lerpDt(dotPos.current.x, pointer.current.x, 0.35, dtFactor);
        dotPos.current.y = lerpDt(dotPos.current.y, pointer.current.y, 0.35, dtFactor);
        if (dotRef.current && (Math.abs(dotDx) > SETTLE_EPS || Math.abs(dotDy) > SETTLE_EPS || needsInitialPaint)) {
          dotRef.current.style.transform =
            `translate(${dotPos.current.x}px,${dotPos.current.y}px) translate(-50%,-50%)`;
        }
      }

      needsInitialPaint = false;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slats, sinBase, cosBase]);

  /* ── hover / focus handlers ──────────────────────────────────────────── */
  const handleLabelEnter = useCallback((idx) => {
    if (labelLeaveTimer.current) clearTimeout(labelLeaveTimer.current);
    setActiveIdx(idx);
  }, []);
  const handleLabelLeave = useCallback(() => {
    labelLeaveTimer.current = setTimeout(() => setActiveIdx(null), 120);
  }, []);

  const handleItemEnter = useCallback((slat, idx) => {
    if (itemLeaveTimer.current) clearTimeout(itemLeaveTimer.current);
    hoveredSlatIndex.current = idx;
    setHoveredItem(slat);
  }, []);
  const handleItemLeave = useCallback(() => {
    itemLeaveTimer.current = setTimeout(() => {
      hoveredSlatIndex.current = null;
      setHoveredItem(null);
    }, 100);
  }, []);

  const goToCategory = useCallback(
    (name) => navigate(`/productSearch?property_type=${encodeURIComponent(name)}`),
    [navigate]
  );

  // Click a photo → spin flourish (matches the video's transition), then
  // navigate to that EXACT photo's property page — never a different one.
  const goToProperty = useCallback(
    (slat, idx) => {
      if (clickTransition.current) return; // already transitioning
      const dest = slat?.id ? `/property/${slat.id}` : null;
      clickTransition.current = {
        idx,
        frame: 0,
        spinSign: idx % 2 === 0 ? 1 : -1,
      };
      setIsTransitioning(true);
      window.setTimeout(() => {
        if (dest) navigate(dest);
        else navigate(`/productSearch?property_type=${encodeURIComponent(slat?.catName || "")}`);
      }, 520);
    },
    [navigate]
  );

  const n = categories.length;
  const activeCat = activeIdx !== null ? categories[activeIdx] : null;
  const autoSlat = slats.length ? slats[autoIdx % slats.length] : null;

  return (
    <div className="gly-page">
      <div className={`gly-topbar${isTransitioning ? " is-transitioning" : ""}`}>
        <button className="gly-logo-dot" onClick={() => navigate("/")} aria-label="Home" />
        <div className="gly-top-right">
          <button className="gly-link" onClick={() => navigate("/")}>Sheetal</button>
          <button className="gly-link" onClick={() => navigate("/productSearch")}>Grid view</button>
        </div>
      </div>

      <div className={`gly-stage${isTransitioning ? " is-transitioning" : ""}`} ref={stageRef}>
        {loading && (
          <div className="gly-loading">
            <span className="gly-loading-dot" />
            Loading properties…
          </div>
        )}

        <div className="gly-ring" ref={ringRef}>
          {slats.map((s, i) => (
            <div
              className="gly-slat"
              key={s.key}
              ref={slatEls.current[i]}
              onMouseEnter={() => handleItemEnter(s, i)}
              onMouseLeave={handleItemLeave}
              onFocus={() => handleItemEnter(s, i)}
              onBlur={handleItemLeave}
              onClick={() => goToProperty(s, i)}
              role="button"
              tabIndex={-1}
            >
              <img
                src={s.img}
                alt=""
                draggable={false}
                decoding="async"
                onLoad={(e) => {
                  e.currentTarget.classList.add("is-loaded");
                  e.currentTarget.parentElement?.classList.add("is-loaded");
                }}
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
                  else {
                    e.currentTarget.classList.add("is-loaded");
                    e.currentTarget.parentElement?.classList.add("is-loaded");
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="gly-labels">
          {categories.map((cat, i) => {
            const angle = (360 / n) * i;
            const rad = angle * DEG2RAD;
            const lxPx = Math.sin(rad) * (labelDims.rx + LABEL_GAP_X);
            const lyPx = -Math.cos(rad) * (labelDims.ry + LABEL_GAP_Y);
            const isLeft = lxPx < 0;
            return (
              <button
                key={cat.name}
                className={`gly-label${activeIdx === i ? " is-active" : ""}${isLeft ? " grow-right" : " grow-left"}`}
                style={{ left: `calc(50% + ${lxPx.toFixed(1)}px)`, top: `calc(50% + ${lyPx.toFixed(1)}px)` }}
                onMouseEnter={() => handleLabelEnter(i)}
                onMouseLeave={handleLabelLeave}
                onFocus={() => handleLabelEnter(i)}
                onBlur={handleLabelLeave}
                onClick={() => goToCategory(cat.name)}
              >
                {cat.name}
                <sup>{cat.count > 0 ? `(${cat.count})` : ""}</sup>
              </button>
            );
          })}
        </div>

        {/* Centre panel priority: the EXACT hovered photo (never a random
            one) > the hovered category's summary > the idle slideshow.
            Hidden during the click → navigate transition. */}
        {!loading && !isTransitioning && (
          <div className="gly-center">
            {hoveredItem ? (
              <div className="gly-center-inner is-item" key={`hover-${hoveredItem.key}`}>
                <div className="gly-center-thumb">
                  <img src={hoveredItem.img} alt={hoveredItem.title} />
                </div>
                <h2>{hoveredItem.title}</h2>
                <p>{hoveredItem.catName}</p>
              </div>
            ) : activeCat ? (
              <div className="gly-center-inner is-cat" key={activeCat.name}>
                <div className="gly-center-thumb">
                  <img src={activeCat.items[0].img} alt={activeCat.name} />
                </div>
                <h2>{activeCat.name}</h2>
                <p>{activeCat.count > 0 ? `${activeCat.count.toLocaleString()} listings` : "Explore listings"}</p>
              </div>
            ) : autoSlat ? (
              <div className="gly-center-inner is-item" key={`auto-${autoSlat.key}`}>
                <div className="gly-center-thumb">
                  <img src={autoSlat.img} alt={autoSlat.title} />
                </div>
                <h2>{autoSlat.title}</h2>
                <p>{autoSlat.catName}</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="gly-dot" ref={dotRef} />
    </div>
  );
};

export default Gallery;