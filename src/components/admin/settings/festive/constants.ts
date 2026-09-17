import React from "react";

export const FESTIVE_GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  sunset: "linear-gradient(to right, #F5576C, #F093FB)",
  neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
  forest: "linear-gradient(to right, #11998e, #38ef7d)",
};

export const ROTATION_KEYFRAMES = `
@keyframes rot-slide-up   { from { opacity:0; transform: translateY(60px);  } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-down { from { opacity:0; transform: translateY(-60px); } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-left { from { opacity:0; transform: translateX(80px);  } to { opacity:1; transform: translateX(0); } }
@keyframes rot-slide-right{ from { opacity:0; transform: translateX(-80px); } to { opacity:1; transform: translateX(0); } }
@keyframes rot-fade       { from { opacity:0;                                } to { opacity:1;                         } }
@keyframes rot-zoom       { from { opacity:0; transform: scale(0.6);         } to { opacity:1; transform: scale(1);   } }
@keyframes rot-flip       { from { opacity:0; transform: rotateX(90deg);     } to { opacity:1; transform: rotateX(0); } }
`;

export const ROTATION_ANIMATION_STYLE: Record<string, React.CSSProperties> = {
  "slide-up": { animation: "rot-slide-up    0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-down": { animation: "rot-slide-down  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-left": { animation: "rot-slide-left  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-right": { animation: "rot-slide-right 0.35s cubic-bezier(0.22,1,0.36,1) both" },
  fade: { animation: "rot-fade        0.35s ease both" },
  zoom: { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
  flip: {
    animation: "rot-flip        0.5s  cubic-bezier(0.22,1,0.36,1) both",
    perspective: "400px",
  },
};

export const PRESET_COLORS = [
  { name: "Default Black", hex: "#000000" },
  { name: "Deep Saffron", hex: "#E65100" },
  { name: "Festival Red", hex: "#D32F2F" },
  { name: "Royal Gold", hex: "#D4AF37" },
  { name: "Festive Purple", hex: "#7B1FA2" },
  { name: "Emerald Green", hex: "#2E7D32" },
  { name: "Electric Blue", hex: "#1565C0" },
];
