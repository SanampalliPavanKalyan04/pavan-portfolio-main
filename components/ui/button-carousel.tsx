"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from "react";
import { ExternalLink } from "lucide-react";

export interface ProjectCarouselItem {
  num: string;
  category: string;
  title: string;
  desc: string;
  url: string;
  thumb: string;
  tags: string[];
  accent: string;
}

export interface KlarnaCarouselProps {
  items?: ProjectCarouselItem[];
  imageWidth?: number;
  imageHeight?: number;
  buttonCount?: number;
  buttonSize?: number;
  buttonRadius?: number;
  curve?: number;
  gap?: number;
  backgroundColor?: string;
  style?: CSSProperties;
}

const DEFAULT_PROJECTS: ProjectCarouselItem[] = [
  {
    num: "01",
    title: "Plant Disease Detection and Classification",
    thumb: "/images/projects/Plant Disease Detection.jpeg",
    category: "MACHINE LEARNING PLATFORM",
    desc: "A machine learning project that detects and classifies plant diseases from images.",
    url: "https://github.com/SanampalliPavanKalyan04/Plant-disease-detection",
    tags: ["Python", "TensorFlow", "ResNet50", "CNN", "FastAPI", "Streamlit"],
    accent: "from-blue-500/20 to-cyan-500/20",
  },
  {
    num: "02",    
    title: "Citizen Connect",
    thumb:  "/images/projects/Citizen-Connect.png",
    category: "SMART CITY PLATFORM",
    desc: "Web application for citizens to report issues and connect with local authorities.",
    url: "https://github.com/SanampalliPavanKalyan04/citizen-connect",
    tags: ["Python", "React", "Vite", "Flask", "PostgreSQL"],
    accent: "from-purple-500/20 to-violet-500/20",
  },
  {
    num: "03",
    title: "Personal Portfolio",
    thumb: "/images/projects/Personal Potfolio.png",
    category: "PERSONAL BRANDING",
    desc: "Responsive portfolio website showcasing my projects and skills.",
    url: "https://sanampallipavankalyan04.github.io/Pavan_Portfolio/",
    tags: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    num: "04",
    title: "E-commerce Sales Data Analytics Dashboard",
    thumb: "/images/projects/E-commerce Dashboard.png",
    category: "FINANCIAL PLATFORM",
    desc: "An interactive dashboard for visualizing and analyzing e-commerce sales data.",
    url: "https://github.com/SanampalliPavanKalyan04/E-commerce-sales-analytics-dashboard",
    tags: ["Python", "SQL", "Power BI", "DAX"],
    accent: "from-orange-500/20 to-amber-500/20",
  },
  {
    num: "05",
    title: "Festival Sales Dashboard",
    thumb: "/images/projects/Festival Sales.png",
    category: "BUSINESS PLATFORM",
    desc: "An interactive dashboard for visualizing and analyzing festival sales data.",
    url: "https://github.com/SanampalliPavanKalyan04/Festival-sales-dashboard",
    tags: ["Python", "Pandas", "HTML", "CSS", "JavaScript"],
    accent: "from-amber-500/20 to-yellow-500/20",
  },
];

function modIdx(i: number, n: number) {
  return ((i % n) + n) % n;
}

function easeCubicInOut(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

export default function KlarnaCarousel(props: KlarnaCarouselProps) {
  const {
    items = DEFAULT_PROJECTS,
    imageWidth = 520,
    imageHeight = 440,
    buttonCount = 7,
    buttonSize = 54,
    buttonRadius = 27,
    curve = 5,
    gap = 20,
    backgroundColor = "transparent",
    style,
  } = props;

  const list = items?.length ? items : DEFAULT_PROJECTS;
  const M = list.length;

  const posRef = useRef(0);
  const [posDisplay, setPosDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const animRef = useRef({ startPos: 0, targetPos: 0, startTime: 0 });
  const [dir, setDir] = useState(1);

  const active = modIdx(Math.round(posDisplay), M);
  const half = Math.floor(Math.min(Math.max(1, buttonCount), M) / 2);
  const buffer = half + 1;

  const t = Math.max(0.0001, Math.min(10, curve) / 10);
  const step = buttonSize + gap;
  const dPsi = ((Math.PI * 2) / M) * t;
  const R = step / (2 * Math.sin(dPsi / 2));
  const baseTop = buttonSize * 0.9;
  const fadeInner = Math.max(0, half - 0.4);
  const fadeEnd = half + 0.6;
  const maxPsi = Math.min(Math.PI, fadeEnd * dPsi);
  const stripHeight = baseTop + R * (1 - Math.cos(maxPsi)) + buttonSize / 2 + 16;

  const select = useCallback(
    (itemIdx: number) => {
      const currentActive = modIdx(Math.round(posRef.current), M);
      if (itemIdx === currentActive) return;

      let delta = itemIdx - Math.round(posRef.current);
      delta = ((delta % M) + M) % M;
      if (delta > M / 2) delta -= M;
      setDir(Math.sign(delta));

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      animRef.current = {
        startPos: posRef.current,
        targetPos: posRef.current + delta,
        startTime: performance.now(),
      };

      const DURATION = 380;
      function tick(now: number) {
        const { startPos, targetPos, startTime } = animRef.current;
        const progress = Math.min(1, (now - startTime) / DURATION);
        posRef.current =
          startPos + (targetPos - startPos) * easeCubicInOut(progress);
        setPosDisplay(posRef.current);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          posRef.current = targetPos;
          setPosDisplay(targetPos);
          rafRef.current = null;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [M]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const center = Math.round(posDisplay);
  const renderItems: number[] = [];
  const seen = new Set<number>();
  for (let s = -buffer; s <= buffer; s++) {
    const idx = modIdx(center + s, M);
    if (!seen.has(idx)) {
      seen.add(idx);
      renderItems.push(idx);
    }
  }

  function getVisualSlot(itemIdx: number): number {
    let slot = itemIdx - posDisplay;
    slot = slot % M;
    if (slot > M / 2) slot -= M;
    if (slot < -M / 2) slot += M;
    return slot;
  }

  function slotStyle(slot: number) {
    const angle = slot * dPsi;
    const x = R * Math.sin(angle);
    const y = R * (1 - Math.cos(angle));
    const deg = (angle * 180) / Math.PI;
    const absSlot = Math.abs(slot);
    const depth = Math.max(0, 1 - (0.55 * absSlot) / Math.max(1, half));
    const scale = 0.55 + 0.45 * depth;
    const opacity =
      absSlot <= fadeInner
        ? 1
        : absSlot >= fadeEnd
        ? 0
        : 1 - (absSlot - fadeInner) / (fadeEnd - fadeInner);
    const zIndex = Math.round(depth * 100) + (absSlot < 0.5 ? 100 : 0);
    return { x, y, deg, scale, opacity, zIndex };
  }

  const imgSweep = 300,
    imgDip = 120;
  const cardVariants = {
    enter: (d: number) => ({
      x: d * imgSweep,
      y: imgDip,
      opacity: 0,
      scale: 0.84,
      rotate: d * 6,
    }),
    center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
    exit: (d: number) => ({
      x: -d * imgSweep,
      y: imgDip,
      opacity: 0,
      scale: 0.84,
      rotate: -d * 6,
    }),
  };

  const activeProject = list[active];

  return (
    <div
      style={{
        ...(style || {}),
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        overflow: "visible",
        boxSizing: "border-box",
        background: backgroundColor,
      }}
    >
      {/* Main Active Project Card Showcase */}
      <div
        className="relative max-w-full"
        style={{
          width: imageWidth,
          height: imageHeight,
          flex: "0 0 auto",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 rounded-3xl bg-[#0d0d0d] border border-white/10 shadow-[0_30px_90px_-20px_rgba(0,85,255,0.35)] overflow-hidden flex flex-col justify-between"
          >
            {/* Project Image Preview */}
            <div className={`relative h-[240px] w-full bg-gradient-to-br ${activeProject.accent} overflow-hidden`}>
              <img
                src={activeProject.thumb}
                alt={activeProject.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover opacity-90 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/30 to-transparent z-[1]" />

              {/* Top Bar Badge & Action */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[3]">
                <span className="font-mono text-[10px] tracking-[0.2em] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/80 border border-white/10 uppercase">
                  {activeProject.category}
                </span>
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0055ff] border border-[#0055ff] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
                  aria-label={`Open ${activeProject.title}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <span className="absolute bottom-3 left-5 font-mono text-sm font-semibold text-white/50 z-[3]">
                {activeProject.num}
              </span>
            </div>

            {/* Project Card Content */}
            <div className="flex flex-col gap-3.5 p-6 md:p-7 flex-1 justify-between bg-[#0d0d0d]">
              <div>
                <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                  {activeProject.title}
                </h3>
                <p className="text-white/45 text-xs md:text-sm font-light leading-relaxed">
                  {activeProject.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] text-white/60 border border-white/[0.06]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-[#0055ff] uppercase hover:underline"
                  >
                    <span>Launch Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="font-mono text-xs text-white/30 uppercase">
                    {String(active + 1).padStart(2, "0")} / {String(M).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arched Button Dial Strip Below */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: stripHeight,
          overflow: "visible",
          flex: "0 0 auto",
        }}
      >
        {renderItems.map((itemIdx) => {
          const slot = getVisualSlot(itemIdx);
          const { x, y, deg, scale, opacity, zIndex } = slotStyle(slot);
          const isActive = itemIdx === active;
          const item = list[itemIdx];

          return (
            <div
              key={itemIdx}
              style={{
                position: "absolute",
                left: "50%",
                top: baseTop,
                marginLeft: -buttonSize / 2,
                marginTop: -buttonSize / 2,
                width: buttonSize,
                height: buttonSize,
                transform: `translate(${x}px, ${y}px) rotate(${deg}deg) scale(${scale})`,
                transformOrigin: "center",
                opacity,
                zIndex,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: buttonRadius,
                  overflow: "hidden",
                  position: "relative",
                  transform: `rotate(${-deg}deg)`,
                  transformOrigin: "center",
                  border: isActive
                    ? "2px solid #0055ff"
                    : "1px solid rgba(255,255,255,0.15)",
                  boxShadow: isActive
                    ? "0 0 24px rgba(0,85,255,0.8)"
                    : "0 4px 12px rgba(0,0,0,0.5)",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.3s ease",
                }}
                onClick={() => select(itemIdx)}
                title={item.title}
              >
                <img
                  src={item.thumb}
                  alt={item.title}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: isActive ? 1 : 0.65,
                    filter: isActive ? "none" : "grayscale(30%)",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
