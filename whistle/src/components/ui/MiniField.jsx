import React from "react";
import { c } from "../../constants/colors.js";
import { sportConfig } from "../../constants/sports.js";

export function MiniField({ seed, sport }) {
  const fieldColor = sportConfig[sport]?.fieldColor || c.green600;
  const isBasketball = sport === "Basketball";
  const isBaseball = sport === "Baseball";
  const dots = Array.from({ length: 6 }, (_, i) => ({
    cx: 20 + (((typeof seed === 'string' ? seed.charCodeAt(0) * 37 : seed * 37) + i * 53) % 100),
    cy: 15 + (((typeof seed === 'string' ? seed.charCodeAt(0) * 23 : seed * 23) + i * 41) % 60),
    team: i < 3 ? (isBasketball ? "#1d4ed8" : c.green600) : c.rose500,
  }));
  return (
    <svg viewBox="0 0 140 90" style={{ width: "100%", height: 100, borderRadius: 12, background: fieldColor }}>
      {isBasketball ? (<>
        <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <line x1="70" y1="2" x2="70" y2="88" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <circle cx="70" cy="45" r="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </>) : isBaseball ? (<>
        <polygon points="70,75 30,40 70,5 110,40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <circle cx="70" cy="45" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </>) : (<>
        <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="70" y1="2" x2="70" y2="88" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="70" cy="45" r="14" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
      </>)}
      {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r="5" fill={d.team} stroke="white" strokeWidth="1.5" />)}
    </svg>
  );
}
