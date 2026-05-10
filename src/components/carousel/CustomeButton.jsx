const ArrowBtn = ({ onClick, direction }) => (
  <>
    <style>{`
      .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1.5px solid rgba(0, 0, 0, 0.12);
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10), 0 1px 3px rgba(0,0,0,0.06);
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.18s;
        outline: none;
        padding: 0;
      }
      .carousel-arrow:hover {
        background: var(--r, #b41414);
        border-color: var(--r, #b41414);
        box-shadow: 0 6px 20px rgba(180, 20, 20, 0.28);
        transform: translateY(-50%) scale(1.08);
      }
      .carousel-arrow:active {
        transform: translateY(-50%) scale(0.96);
      }
      .carousel-arrow--right { right: 0; }
      .carousel-arrow--left  { left: 0; }

      .carousel-arrow svg {
        width: 16px;
        height: 16px;
        color: #444;
        transition: color 0.2s, transform 0.2s;
        flex-shrink: 0;
      }
      .carousel-arrow:hover svg {
        color: #fff;
      }
      .carousel-arrow--right:hover svg { transform: translateX(1px); }
      .carousel-arrow--left:hover svg  { transform: translateX(-1px); }
    `}</style>

    <button
      type="button"
      onClick={() => onClick()}
      className={`carousel-arrow carousel-arrow--${direction}`}
      aria-label={direction === "right" ? "Next slide" : "Previous slide"}
    >
      {direction === "right" ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 8H3M7 4L3 8l4 4" />
        </svg>
      )}
    </button>
  </>
);

export const CustomRightArrow = ({ onClick }) => (
  <ArrowBtn onClick={onClick} direction="right" />
);

export const CustomLeftArrow = ({ onClick }) => (
  <ArrowBtn onClick={onClick} direction="left" />
);