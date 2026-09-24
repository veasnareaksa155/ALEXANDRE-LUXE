import React, { useRef, useEffect } from "react";

const COMPONENT_DEFAULTS = {
  count: 180,
  wind: 0,
  windVariation: 0.8,
  sizeMin: 1.5,
  sizeMax: 3.5,
  speedMin: 0.6,
  speedMax: 2.2,
  opacityMin: 30,
  opacityMax: 90,
  direction: "down",
  color: "#ffffff",
};

export default function Snowfall(props) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const {
    count,
    speedMin,
    speedMax,
    wind,
    windVariation,
    sizeMin,
    sizeMax,
    opacityMin,
    opacityMax,
    direction,
    color,
    style,
    className = "",
  } = mergedProps;

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const cfg = useRef({ color, wind, windVariation });
  cfg.current = { color, wind, windVariation };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    const cont = containerRef.current;
    if (!canvas || !cont) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cv = canvas;
    const box = cont;
    const g = ctx;

    let raf = 0;
    let W = 0;
    let H = 0;
    let isVisible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let flakes = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const dirSign = direction === "up" ? -1 : 1;
    const sLo = Math.min(speedMin, speedMax);
    const sHi = Math.max(speedMin, speedMax);
    const rLo = Math.min(sizeMin, sizeMax);
    const rHi = Math.max(sizeMin, sizeMax);
    const oLo = Math.min(opacityMin, opacityMax) / 100;
    const oHi = Math.max(opacityMin, opacityMax) / 100;

    function build(entry) {
      const cr = entry?.contentRect;
      const rw =
        cr?.width || box.clientWidth || box.getBoundingClientRect().width;
      const rh =
        cr?.height || box.clientHeight || box.getBoundingClientRect().height;
      W = Math.max(1, Math.floor(rw) || 1);
      H = Math.max(1, Math.floor(rh) || 1);
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(0, Math.round(count));
      flakes = new Array(n);
      for (let i = 0; i < n; i++) {
        flakes[i] = {
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(rLo, rHi),
          vy: rand(sLo, sHi),
          vx: rand(-1, 1),
          phase: Math.random() * Math.PI * 2,
          sway: rand(0.2, 0.9),
          alpha: rand(oLo, oHi),
        };
      }
    }

    function draw() {
      const { color } = cfg.current;
      g.clearRect(0, 0, W, H);
      g.fillStyle = color;
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        g.globalAlpha = f.alpha;
        g.beginPath();
        g.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
    }

    function loop(t) {
      if (isVisible) {
        const { wind: wBase, windVariation: wVar } = cfg.current;
        for (let i = 0; i < flakes.length; i++) {
          const f = flakes[i];
          f.y += f.vy * dirSign;
          f.x += wBase + f.vx * wVar + Math.sin(t * 0.0012 + f.phase) * f.sway;
          if (dirSign > 0 && f.y - f.r > H) {
            f.y = -f.r;
            f.x = Math.random() * W;
          } else if (dirSign < 0 && f.y + f.r < 0) {
            f.y = H + f.r;
            f.x = Math.random() * W;
          }
          if (f.x < -f.r) f.x = W + f.r;
          else if (f.x > W + f.r) f.x = -f.r;
        }
        draw();
      }
      raf = requestAnimationFrame(loop);
    }

    build();
    draw();
    raf = requestAnimationFrame(loop);

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
            },
            { threshold: 0.02 },
          )
        : null;

    if (observer) observer.observe(box);

    const ro = new ResizeObserver((entries) => {
      build(entries[0]);
      draw();
    });
    ro.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      ro.disconnect();
    };
  }, [
    count,
    speedMin,
    speedMax,
    sizeMin,
    sizeMax,
    opacityMin,
    opacityMax,
    direction,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 80,
        minHeight: 80,
        overflow: "hidden",
        background: "transparent",
        borderRadius: 0,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
      />
    </div>
  );
}
