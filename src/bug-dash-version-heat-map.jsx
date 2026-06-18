import { useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const VERSIONS = [
  "7.5.0","7.5.1.0",
  "7.6.0","7.6.0.0","7.6.0.3","7.6.1.0",
  "7.7.0","7.7.0.0","7.7.0.1","7.7.0.2","7.7.0.3","7.7.1.0",
  "7.8.0","7.8.0.1","7.8.0.2","7.8.1.0","7.8.2.0","7.8.3.0","7.8.4.0",
  "7.9.0","7.9.0.0","7.9.0.1","7.9.0.2","7.9.0.3","7.9.0.4","7.9.1.0","7.9.2.0",
];

const VER_GROUPS = [
  { label:"7.5", span:2 },
  { label:"7.6", span:4 },
  { label:"7.7", span:6 },
  { label:"7.8", span:7 },
  { label:"7.9", span:8 },
];

const COMPONENTS = [
  "Build & Deployment",
  "Web Configuration",
  "Data Analytics",
  "Alert & Incidents",
  "Data Pipeline",
  "Collection",
  "UEBA Integration",
  "SOAR Integration",
  "UX Analytics",
  "LPSM",
];

const COMP_COLOR = {
  "Build & Deployment":  "#38bdf8",
  "Web Configuration":   "#f97316",
  "Data Analytics":      "#34d399",
  "Alert & Incidents":   "#f59e0b",
  "Data Pipeline":       "#818cf8",
  "Collection":          "#fb923c",
  "UEBA Integration":    "#a78bfa",
  "SOAR Integration":    "#e879f9",
  "UX Analytics":        "#4ade80",
  "LPSM":                "#64748b",
};

const HEATMAP   = {"Build & Deployment": {"7.7.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 4, "k": ["LP-74949"]}, "7.7.0.3": {"b": 3, "o": 0, "c": 0, "h": 1, "m": 2, "l": 0, "z": 2, "k": ["LP-70392", "LP-70465", "LP-74977"]}, "7.7.1.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 1, "k": ["LP-70462"]}, "7.8.0": {"b": 4, "o": 0, "c": 1, "h": 0, "m": 3, "l": 0, "z": 8, "k": ["LP-70219", "LP-70392", "LP-70431", "LP-74949"]}, "7.8.0.2": {"b": 5, "o": 1, "c": 0, "h": 4, "m": 1, "l": 0, "z": 4, "k": ["LP-70394", "LP-73406", "LP-75020", "LP-75149", "LP-76019"]}, "7.8.1.0": {"b": 3, "o": 0, "c": 0, "h": 0, "m": 3, "l": 0, "z": 2, "k": ["LP-70219", "LP-70462", "LP-73330"]}, "7.8.2.0": {"b": 6, "o": 0, "c": 2, "h": 1, "m": 2, "l": 1, "z": 27, "k": ["LP-70204", "LP-70210", "LP-70312", "LP-73497", "LP-75196", "LP-75952"]}, "7.8.3.0": {"b": 6, "o": 0, "c": 3, "h": 2, "m": 1, "l": 0, "z": 26, "k": ["LP-70393", "LP-70430", "LP-70431", "LP-73497", "LP-75196", "LP-75952"]}, "7.8.4.0": {"b": 12, "o": 4, "c": 2, "h": 8, "m": 1, "l": 1, "z": 33, "k": ["LP-70460", "LP-73301", "LP-73497", "LP-75039", "LP-75149", "LP-75196", "LP-75952", "LP-75965"]}, "7.9.0": {"b": 2, "o": 0, "c": 1, "h": 0, "m": 1, "l": 0, "z": 5, "k": ["LP-75839", "LP-76033"]}, "7.9.0.0": {"b": 2, "o": 0, "c": 2, "h": 0, "m": 0, "l": 0, "z": 0, "k": ["LP-70314", "LP-70391"]}, "7.9.0.1": {"b": 3, "o": 0, "c": 1, "h": 1, "m": 0, "l": 1, "z": 16, "k": ["LP-74964", "LP-75665", "LP-75952"]}, "7.9.0.2": {"b": 2, "o": 0, "c": 1, "h": 0, "m": 0, "l": 1, "z": 2, "k": ["LP-75479", "LP-75665"]}, "7.9.0.3": {"b": 2, "o": 0, "c": 1, "h": 0, "m": 0, "l": 1, "z": 15, "k": ["LP-75665", "LP-75952"]}, "7.9.0.4": {"b": 3, "o": 1, "c": 1, "h": 2, "m": 0, "l": 0, "z": 20, "k": ["LP-75952", "LP-76043", "LP-76212"]}, "7.9.2.0": {"b": 2, "o": 0, "c": 2, "h": 0, "m": 0, "l": 0, "z": 4, "k": ["LP-76329", "LP-76330"]}}, "Web Configuration": {"7.6.0": {"b": 2, "o": 1, "c": 0, "h": 0, "m": 2, "l": 0, "z": 1, "k": ["LP-75834", "LP-76092"]}, "7.6.0.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 1, "k": ["LP-70283"]}, "7.6.1.0": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-75611"]}, "7.7.0": {"b": 9, "o": 1, "c": 1, "h": 5, "m": 3, "l": 0, "z": 6, "k": ["LP-70303", "LP-73287", "LP-73422", "LP-74881", "LP-75083", "LP-75829", "LP-75830", "LP-75834"]}, "7.7.0.2": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 0, "l": 1, "z": 1, "k": ["LP-75717"]}, "7.7.0.3": {"b": 4, "o": 1, "c": 0, "h": 0, "m": 4, "l": 0, "z": 4, "k": ["LP-70615", "LP-73405", "LP-75085", "LP-75658"]}, "7.7.1.0": {"b": 3, "o": 2, "c": 0, "h": 0, "m": 2, "l": 1, "z": 1, "k": ["LP-73328", "LP-76075", "LP-76076"]}, "7.8.0": {"b": 18, "o": 2, "c": 1, "h": 3, "m": 13, "l": 1, "z": 8, "k": ["LP-70308", "LP-70600", "LP-70601", "LP-70602", "LP-70670", "LP-73299", "LP-73341", "LP-73422"]}, "7.8.0.1": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 1, "l": 0, "z": 0, "k": ["LP-70260"]}, "7.8.0.2": {"b": 9, "o": 0, "c": 0, "h": 4, "m": 5, "l": 0, "z": 4, "k": ["LP-70283", "LP-70303", "LP-73287", "LP-73405", "LP-73428", "LP-74882", "LP-75050", "LP-75107"]}, "7.8.1.0": {"b": 2, "o": 0, "c": 0, "h": 0, "m": 1, "l": 1, "z": 6, "k": ["LP-73328", "LP-73329"]}, "7.8.2.0": {"b": 2, "o": 0, "c": 0, "h": 1, "m": 1, "l": 0, "z": 1, "k": ["LP-70211", "LP-70283"]}, "7.8.4.0": {"b": 5, "o": 1, "c": 0, "h": 3, "m": 1, "l": 1, "z": 6, "k": ["LP-73397", "LP-74879", "LP-74967", "LP-75480", "LP-76159"]}, "7.9.0": {"b": 13, "o": 3, "c": 2, "h": 5, "m": 4, "l": 2, "z": 11, "k": ["LP-73361", "LP-75175", "LP-75714", "LP-75717", "LP-75826", "LP-75829", "LP-75830", "LP-75834"]}, "7.9.0.0": {"b": 8, "o": 0, "c": 0, "h": 5, "m": 3, "l": 0, "z": 0, "k": ["LP-70352", "LP-70362", "LP-70478", "LP-73428", "LP-73488", "LP-74882", "LP-74883", "LP-75110"]}, "7.9.0.1": {"b": 2, "o": 0, "c": 0, "h": 0, "m": 2, "l": 0, "z": 0, "k": ["LP-73428", "LP-75272"]}, "7.9.0.2": {"b": 3, "o": 0, "c": 1, "h": 2, "m": 0, "l": 0, "z": 0, "k": ["LP-75106", "LP-75107", "LP-75170"]}, "7.9.0.4": {"b": 6, "o": 3, "c": 0, "h": 3, "m": 2, "l": 1, "z": 6, "k": ["LP-75917", "LP-75996", "LP-76073", "LP-76159", "LP-76202", "LP-76241"]}, "7.9.1.0": {"b": 1, "o": 1, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-76241"]}, "7.9.2.0": {"b": 3, "o": 1, "c": 0, "h": 1, "m": 2, "l": 0, "z": 1, "k": ["LP-75846", "LP-75847", "LP-76241"]}}, "Data Analytics": {"7.5.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 2, "k": ["LP-70434"]}, "7.7.0": {"b": 4, "o": 0, "c": 2, "h": 2, "m": 0, "l": 0, "z": 6, "k": ["LP-70315", "LP-70434", "LP-73339", "LP-73496"]}, "7.7.0.3": {"b": 3, "o": 0, "c": 0, "h": 1, "m": 2, "l": 0, "z": 6, "k": ["LP-70262", "LP-70584", "LP-73396"]}, "7.7.1.0": {"b": 2, "o": 1, "c": 0, "h": 0, "m": 2, "l": 0, "z": 2, "k": ["LP-70350", "LP-76277"]}, "7.8.0": {"b": 4, "o": 1, "c": 3, "h": 0, "m": 0, "l": 1, "z": 5, "k": ["LP-70434", "LP-75848", "LP-76015", "LP-76108"]}, "7.8.0.2": {"b": 3, "o": 1, "c": 0, "h": 0, "m": 3, "l": 0, "z": 6, "k": ["LP-70584", "LP-75010", "LP-76143"]}, "7.8.1.0": {"b": 3, "o": 0, "c": 0, "h": 1, "m": 1, "l": 1, "z": 3, "k": ["LP-70479", "LP-70583", "LP-73339"]}, "7.8.4.0": {"b": 2, "o": 0, "c": 1, "h": 0, "m": 1, "l": 0, "z": 3, "k": ["LP-73396", "LP-73496"]}, "7.9.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 0, "l": 1, "z": 0, "k": ["LP-75840"]}, "7.9.0.0": {"b": 6, "o": 1, "c": 1, "h": 3, "m": 1, "l": 1, "z": 4, "k": ["LP-70315", "LP-73313", "LP-73338", "LP-73339", "LP-75591", "LP-76221"]}, "7.9.0.2": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 0, "k": ["LP-75125"]}, "7.9.0.3": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 0, "l": 1, "z": 0, "k": ["LP-76057"]}, "7.9.0.4": {"b": 2, "o": 0, "c": 1, "h": 0, "m": 1, "l": 0, "z": 4, "k": ["LP-76108", "LP-76194"]}}, "Alert & Incidents": {"7.7.0": {"b": 2, "o": 0, "c": 0, "h": 0, "m": 2, "l": 0, "z": 2, "k": ["LP-73764", "LP-74921"]}, "7.7.0.0": {"b": 1, "o": 1, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-76041"]}, "7.7.0.1": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 2, "k": ["LP-70664"]}, "7.7.0.2": {"b": 2, "o": 0, "c": 0, "h": 2, "m": 0, "l": 0, "z": 2, "k": ["LP-73302", "LP-75811"]}, "7.7.0.3": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 0, "k": ["LP-73302"]}, "7.8.0": {"b": 7, "o": 0, "c": 2, "h": 3, "m": 1, "l": 1, "z": 10, "k": ["LP-70276", "LP-70480", "LP-74903", "LP-75801", "LP-75843", "LP-75880", "LP-76021"]}, "7.8.0.2": {"b": 3, "o": 0, "c": 0, "h": 0, "m": 3, "l": 0, "z": 1, "k": ["LP-74921", "LP-75008", "LP-75804"]}, "7.8.4.0": {"b": 5, "o": 1, "c": 0, "h": 3, "m": 2, "l": 0, "z": 5, "k": ["LP-70664", "LP-73302", "LP-73764", "LP-75190", "LP-75595"]}, "7.9.0": {"b": 2, "o": 0, "c": 1, "h": 1, "m": 0, "l": 0, "z": 6, "k": ["LP-75683", "LP-75880"]}, "7.9.0.0": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-75676"]}, "7.9.0.2": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-75676"]}, "7.9.0.3": {"b": 2, "o": 0, "c": 0, "h": 2, "m": 0, "l": 0, "z": 7, "k": ["LP-75801", "LP-75811"]}, "7.9.0.4": {"b": 2, "o": 1, "c": 0, "h": 1, "m": 1, "l": 0, "z": 1, "k": ["LP-75804", "LP-76041"]}, "7.9.2.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 0, "k": ["LP-75804"]}}, "Data Pipeline": {"7.5.0": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-70472"]}, "7.7.0.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 1, "k": ["LP-70228"]}, "7.7.1.0": {"b": 2, "o": 0, "c": 0, "h": 1, "m": 1, "l": 0, "z": 2, "k": ["LP-70400", "LP-70472"]}, "7.8.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 6, "k": ["LP-73311"]}, "7.8.0.2": {"b": 3, "o": 1, "c": 0, "h": 0, "m": 2, "l": 1, "z": 2, "k": ["LP-70228", "LP-75120", "LP-76314"]}, "7.8.3.0": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-70472"]}, "7.8.4.0": {"b": 3, "o": 0, "c": 0, "h": 2, "m": 0, "l": 1, "z": 4, "k": ["LP-73360", "LP-74968", "LP-75120"]}, "7.9.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 0, "k": ["LP-70213"]}, "7.9.0.0": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 1, "l": 0, "z": 0, "k": ["LP-70213"]}, "7.9.0.4": {"b": 1, "o": 0, "c": 0, "h": 0, "m": 0, "l": 1, "z": 1, "k": ["LP-76058"]}}, "Collection": {"7.6.0": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 0, "l": 1, "z": 1, "k": ["LP-75828"]}, "7.6.0.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 2, "k": ["LP-75034"]}, "7.7.0.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 2, "k": ["LP-75034"]}, "7.7.1.0": {"b": 1, "o": 1, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-75127"]}, "7.8.0.2": {"b": 3, "o": 2, "c": 1, "h": 0, "m": 1, "l": 1, "z": 3, "k": ["LP-70386", "LP-75034", "LP-75866"]}, "7.8.1.0": {"b": 1, "o": 1, "c": 0, "h": 1, "m": 0, "l": 0, "z": 1, "k": ["LP-75127"]}, "7.8.4.0": {"b": 2, "o": 1, "c": 1, "h": 0, "m": 0, "l": 1, "z": 3, "k": ["LP-75034", "LP-76224"]}, "7.9.0": {"b": 3, "o": 2, "c": 0, "h": 1, "m": 1, "l": 1, "z": 2, "k": ["LP-75712", "LP-75827", "LP-75828"]}, "7.9.0.2": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 0, "k": ["LP-75141"]}, "7.9.0.3": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 1, "l": 0, "z": 1, "k": ["LP-75866"]}}, "UEBA Integration": {}, "SOAR Integration": {"7.8.4.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 3, "k": ["LP-73489"]}}, "UX Analytics": {"7.8.4.0": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 0, "l": 1, "z": 1, "k": ["LP-76189"]}, "7.9.0.0": {"b": 1, "o": 0, "c": 0, "h": 1, "m": 0, "l": 0, "z": 0, "k": ["LP-73312"]}, "7.9.0.4": {"b": 1, "o": 1, "c": 0, "h": 0, "m": 0, "l": 1, "z": 1, "k": ["LP-76189"]}}, "LPSM": {"7.9.0": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 2, "k": ["LP-76000"]}, "7.9.0.4": {"b": 1, "o": 0, "c": 1, "h": 0, "m": 0, "l": 0, "z": 2, "k": ["LP-76000"]}}};
const VER_TOT   = {"7.5.0": {"bugs": 2, "open": 0, "crit": 1, "high": 1, "zd": 3}, "7.5.1.0": {"bugs": 0, "open": 0, "crit": 0, "high": 0, "zd": 0}, "7.6.0": {"bugs": 3, "open": 2, "crit": 0, "high": 0, "zd": 2}, "7.6.0.0": {"bugs": 2, "open": 0, "crit": 1, "high": 0, "zd": 3}, "7.6.0.3": {"bugs": 0, "open": 0, "crit": 0, "high": 0, "zd": 0}, "7.6.1.0": {"bugs": 1, "open": 0, "crit": 0, "high": 1, "zd": 1}, "7.7.0": {"bugs": 16, "open": 1, "crit": 3, "high": 7, "zd": 18}, "7.7.0.0": {"bugs": 3, "open": 1, "crit": 1, "high": 1, "zd": 4}, "7.7.0.1": {"bugs": 1, "open": 0, "crit": 0, "high": 1, "zd": 2}, "7.7.0.2": {"bugs": 3, "open": 0, "crit": 0, "high": 2, "zd": 3}, "7.7.0.3": {"bugs": 11, "open": 1, "crit": 0, "high": 3, "zd": 12}, "7.7.1.0": {"bugs": 9, "open": 4, "crit": 0, "high": 2, "zd": 7}, "7.8.0": {"bugs": 34, "open": 3, "crit": 8, "high": 6, "zd": 37}, "7.8.0.1": {"bugs": 1, "open": 1, "crit": 0, "high": 0, "zd": 0}, "7.8.0.2": {"bugs": 26, "open": 5, "crit": 1, "high": 8, "zd": 20}, "7.8.1.0": {"bugs": 9, "open": 1, "crit": 0, "high": 2, "zd": 12}, "7.8.2.0": {"bugs": 8, "open": 0, "crit": 2, "high": 2, "zd": 28}, "7.8.3.0": {"bugs": 7, "open": 0, "crit": 3, "high": 3, "zd": 27}, "7.8.4.0": {"bugs": 31, "open": 8, "crit": 5, "high": 16, "zd": 58}, "7.9.0": {"bugs": 23, "open": 5, "crit": 5, "high": 7, "zd": 26}, "7.9.0.0": {"bugs": 19, "open": 1, "crit": 3, "high": 10, "zd": 5}, "7.9.0.1": {"bugs": 5, "open": 0, "crit": 1, "high": 1, "zd": 16}, "7.9.0.2": {"bugs": 8, "open": 0, "crit": 2, "high": 5, "zd": 3}, "7.9.0.3": {"bugs": 6, "open": 2, "crit": 1, "high": 2, "zd": 23}, "7.9.0.4": {"bugs": 16, "open": 6, "crit": 3, "high": 6, "zd": 35}, "7.9.1.0": {"bugs": 1, "open": 1, "crit": 0, "high": 1, "zd": 1}, "7.9.2.0": {"bugs": 6, "open": 1, "crit": 2, "high": 1, "zd": 5}};
const COMP_TOT  = {"Build & Deployment": {"bugs": 51, "open": 6, "zd": 71, "crit": 13, "high": 21}, "Web Configuration": {"bugs": 85, "open": 11, "zd": 41, "crit": 6, "high": 25}, "Data Analytics": {"bugs": 33, "open": 5, "zd": 27, "crit": 5, "high": 8}, "Alert & Incidents": {"bugs": 28, "open": 2, "zd": 25, "crit": 7, "high": 12}, "Data Pipeline": {"bugs": 11, "open": 1, "zd": 14, "crit": 1, "high": 3}, "Collection": {"bugs": 10, "open": 7, "zd": 7, "crit": 1, "high": 3}, "UEBA Integration": {"bugs": 2, "open": 0, "zd": 1, "crit": 0, "high": 1}, "SOAR Integration": {"bugs": 1, "open": 0, "zd": 3, "crit": 1, "high": 0}, "UX Analytics": {"bugs": 2, "open": 1, "zd": 1, "crit": 0, "high": 1}, "LPSM": {"bugs": 1, "open": 0, "zd": 2, "crit": 1, "high": 0}};
const MAX_BUGS  = 18;

// ── Cell ───────────────────────────────────────────────────────────────────────
function HeatCell({ comp, version, onHover, isHovered }) {
  const cell = (HEATMAP[comp] || {})[version];
  const color = COMP_COLOR[comp];

  if (!cell || cell.b === 0) {
    return (
      <div style={{
        height: 38, borderRadius: 3,
        background: "#080d1a",
        border: "1px solid #0d1526",
      }}/>
    );
  }

  const pct      = cell.b / MAX_BUGS;
  const alpha    = 0.12 + pct * 0.78;
  const hex      = color.replace("#","");
  const rr       = parseInt(hex.slice(0,2),16);
  const gg       = parseInt(hex.slice(2,4),16);
  const bb       = parseInt(hex.slice(4,6),16);
  const bgColor  = "rgba("+rr+","+gg+","+bb+","+alpha.toFixed(2)+")";

  const hasCrit  = cell.c > 0;
  const hasOpen  = cell.o > 0;
  const borderC  = hasCrit ? "#dc2626" : hasOpen ? "#f97316" : "rgba("+rr+","+gg+","+bb+",0.35)";
  const borderW  = (hasCrit || isHovered) ? "2px" : "1px";

  return (
    <div
      onMouseEnter={() => onHover({ comp, version, cell })}
      onMouseLeave={() => onHover(null)}
      style={{
        height: 38, borderRadius: 3, cursor: "pointer",
        background: bgColor,
        border: borderW + " solid " + borderC,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 1,
        transform: isHovered ? "scale(1.15)" : "scale(1)",
        zIndex: isHovered ? 20 : 1,
        position: "relative",
        boxShadow: isHovered ? ("0 0 10px rgba("+rr+","+gg+","+bb+",0.7)") : "none",
        transition: "all 0.1s",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{cell.b}</span>
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {cell.c > 0 && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#dc2626" }}/>}
        {cell.h > 0 && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f97316" }}/>}
        {cell.o > 0 && <span style={{ fontSize: 7, color: "#fb923c", fontWeight: 700, letterSpacing: "-0.02em" }}>OPEN</span>}
      </div>
    </div>
  );
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
function Tooltip({ data }) {
  if (!data) return null;
  const { comp, version, cell } = data;
  const color = COMP_COLOR[comp];
  const sevMap = [
    { label:"Critical", count:cell.c, color:"#dc2626" },
    { label:"High",     count:cell.h, color:"#f97316" },
    { label:"Medium",   count:cell.m, color:"#eab308" },
    { label:"Low",      count:cell.l, color:"#64748b" },
  ].filter(s => s.count > 0);

  return (
    <div style={{
      position:"fixed", top:16, right:16, width:340,
      background:"#0e1628", border:"1px solid "+color,
      borderRadius:10, padding:14, zIndex:9999,
      boxShadow:"0 8px 40px rgba(0,0,0,0.7)",
      pointerEvents:"none",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ width:8,height:8,borderRadius:2,background:color,display:"inline-block",flexShrink:0 }}/>
        <span style={{ fontSize:12,fontWeight:700,color:color,flex:1 }}>{comp}</span>
        <span style={{ fontSize:11,color:"#7dd3fc",background:"#1e3a5f",padding:"2px 8px",borderRadius:4,fontWeight:600 }}>v{version}</span>
      </div>
      <div style={{ display:"flex",gap:10,marginBottom:10,padding:"8px",background:"#080d1a",borderRadius:6 }}>
        {[["Bugs",cell.b,"#f1f5f9"],["Open",cell.o,cell.o>0?"#f97316":"#22c55e"],["ZD",cell.z,"#8b5cf6"]].map(([l,v,c2])=>(
          <div key={l} style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:20,fontWeight:700,color:c2}}>{v}</div>
            <div style={{fontSize:10,color:"#64748b"}}>{l}</div>
          </div>
        ))}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:3,justifyContent:"center"}}>
          {sevMap.map(s=>(
            <div key={s.label} style={{fontSize:10,color:s.color,fontWeight:600}}>
              {s.count+" "+s.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{fontSize:10,color:"#475569",marginBottom:6,fontWeight:600,letterSpacing:"0.06em"}}>JIRA KEYS</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {cell.k.map(k=>(
          <a key={k} href={"https://logpoint.atlassian.net/browse/"+k} target="_blank" rel="noreferrer"
            style={{fontSize:10,color:"#38bdf8",background:"#1e3a5f",padding:"2px 6px",borderRadius:4,textDecoration:"none",fontWeight:600}}>
            {k}
          </a>
        ))}
        {cell.b > cell.k.length && (
          <span style={{fontSize:10,color:"#475569",padding:"2px 6px"}}>+{cell.b - cell.k.length} more</span>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [hovered, setHovered]       = useState(null);
  const [selComp, setSelComp]       = useState(null);
  const [selVer, setSelVer]         = useState(null);
  const [colorMode, setColorMode]   = useState("component"); // component | severity | density
  const [showSmall, setShowSmall]   = useState(false);

  const visibleComps = showSmall
    ? COMPONENTS
    : COMPONENTS.filter(c => (COMP_TOT[c] || {}).bugs >= 5);

  // Filtered column: if a version has 0 bugs across all visible comps, hide it
  const activeCols = VERSIONS.filter(v =>
    visibleComps.some(c => ((HEATMAP[c] || {})[v] || {}).b > 0)
  );

  // Version group spans for active cols
  const buildGroups = (cols) => {
    const groups = [];
    VER_GROUPS.forEach(g => {
      const span = cols.filter(v => v.startsWith(g.label+".") || v === g.label).length;
      if (span > 0) groups.push({ label: g.label, span });
    });
    return groups;
  };
  const activeGroups = buildGroups(activeCols);

  const totalBugs = Object.values(COMP_TOT).reduce((s,t)=>s+(t.bugs||0),0);
  const totalOpen = Object.values(COMP_TOT).reduce((s,t)=>s+(t.open||0),0);
  const worstVer  = Object.entries(VER_TOT).sort((a,b)=>b[1].bugs-a[1].bugs)[0];

  const COL_W = Math.max(34, Math.floor(700 / activeCols.length));

  return (
    <div style={{ fontFamily:"'DM Mono','Fira Code',monospace", background:"#080d1a", minHeight:"100vh", color:"#e2e8f0", padding:20 }}>

      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:10, color:"#475569", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:5 }}>
          LogPoint · All Bugs · Jan–May 2026 · Subgrouped by Component
        </div>
        <div style={{ fontSize:20, fontWeight:700, color:"#f8fafc", marginBottom:3 }}>Affected Version Heatmap</div>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:14 }}>
          Rows = components · Columns = affected versions · Cell = bug count · Hover for details & Jira links
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            [totalBugs+"","total bugs","#3b82f6"],
            [totalOpen+"","still open","#ef4444"],
            [worstVer[0],"hottest version ("+worstVer[1].bugs+" bugs)","#f97316"],
            ["7.8.0","most affected version (cumulative)","#f59e0b"],
          ].map(([v,l,col])=>(
            <div key={l} style={{padding:"6px 14px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid "+col+"30"}}>
              <div style={{fontSize:18,fontWeight:700,color:col}}>{v}</div>
              <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
            </div>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            <label style={{fontSize:11,color:"#64748b",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <input type="checkbox" checked={showSmall} onChange={e=>setShowSmall(e.target.checked)}
                style={{accentColor:"#3b82f6"}}/>
              Show all components
            </label>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ background:"#0f1729", border:"1px solid #1e3a5f", borderRadius:12, padding:"16px 16px 12px", overflowX:"auto" }}>

        {/* Release group headers */}
        <div style={{ display:"grid", gridTemplateColumns:"180px repeat("+activeCols.length+","+COL_W+"px)", gap:3, marginBottom:2 }}>
          <div/>
          {activeGroups.map(g=>(
            <div key={g.label} style={{
              gridColumn:"span "+g.span, textAlign:"center",
              fontSize:10, fontWeight:700, color:"#475569",
              padding:"3px 0", borderBottom:"1px solid #1e3a5f",
              letterSpacing:"0.08em"
            }}>{g.label}</div>
          ))}
        </div>

        {/* Version labels */}
        <div style={{ display:"grid", gridTemplateColumns:"180px repeat("+activeCols.length+","+COL_W+"px)", gap:3, marginBottom:8 }}>
          <div style={{fontSize:10,color:"#334155",display:"flex",alignItems:"flex-end",paddingBottom:4}}>Component</div>
          {activeCols.map(v=>{
            const t    = VER_TOT[v] || {};
            const hot  = t.bugs >= 10;
            const warm = t.bugs >= 5;
            const hasO = t.open > 0;
            const isSel = selVer === v;
            return (
              <div key={v} onClick={()=>setSelVer(isSel?null:v)}
                style={{textAlign:"center",cursor:"pointer",paddingBottom:2}}>
                <div style={{
                  fontSize:8, fontWeight: hot?700:warm?600:400,
                  color: isSel?"#38bdf8":hot?"#ef4444":warm?"#f97316":hasO?"#f59e0b":"#334155",
                  transform:"rotate(-50deg)", transformOrigin:"50% 100%",
                  whiteSpace:"nowrap", display:"block", marginBottom:2,
                  lineHeight:1,
                }}>
                  {v.replace("7.","7.")}
                </div>
                {t.bugs > 0 && (
                  <div style={{
                    fontSize:10,fontWeight:700,
                    color:hot?"#ef4444":warm?"#f97316":"#475569",
                    background:hot?"rgba(239,68,68,0.12)":warm?"rgba(249,115,22,0.08)":"transparent",
                    borderRadius:3, padding:"1px 2px",
                  }}>{t.bugs}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Component rows */}
        {visibleComps.map(comp => {
          const ct = COMP_TOT[comp] || {};
          const isSel = selComp === comp;
          return (
            <div key={comp} style={{ display:"grid", gridTemplateColumns:"180px repeat("+activeCols.length+","+COL_W+"px)", gap:3, marginBottom:3 }}>
              {/* Row label */}
              <div onClick={()=>setSelComp(isSel?null:comp)}
                style={{
                  display:"flex", alignItems:"center", gap:6, cursor:"pointer",
                  padding:"2px 6px 2px 0",
                  opacity: selComp && !isSel ? 0.4 : 1, transition:"opacity 0.15s"
                }}>
                <span style={{width:7,height:7,borderRadius:2,background:COMP_COLOR[comp],flexShrink:0,display:"inline-block"}}/>
                <div style={{overflow:"hidden"}}>
                  <div style={{fontSize:11,fontWeight:isSel?700:500,color:isSel?COMP_COLOR[comp]:"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {comp}
                  </div>
                  <div style={{display:"flex",gap:6,fontSize:9,color:"#334155"}}>
                    <span style={{color:"#475569"}}>{ct.bugs||0}b</span>
                    {ct.open>0&&<span style={{color:"#f97316"}}>{ct.open}o</span>}
                    {ct.crit>0&&<span style={{color:"#dc2626"}}>{ct.crit}c</span>}
                    {ct.zd>0&&<span style={{color:"#8b5cf6"}}>{ct.zd}zd</span>}
                  </div>
                </div>
              </div>
              {/* Cells */}
              {activeCols.map(v=>(
                <HeatCell key={v} comp={comp} version={v}
                  onHover={setHovered}
                  isHovered={hovered && hovered.comp===comp && hovered.version===v}
                />
              ))}
            </div>
          );
        })}

        {/* Column totals footer */}
        <div style={{ display:"grid", gridTemplateColumns:"180px repeat("+activeCols.length+","+COL_W+"px)", gap:3, marginTop:8, paddingTop:8, borderTop:"1px solid #1e3a5f" }}>
          <div style={{fontSize:9,color:"#334155",fontWeight:700,display:"flex",alignItems:"center"}}>
            TOTAL (all comps)
          </div>
          {activeCols.map(v=>{
            const t = VER_TOT[v] || {};
            const n = t.bugs || 0;
            const hot  = n >= 15;
            const warm = n >= 8;
            const hasO = t.open > 0;
            const hasCrit = t.crit > 0;
            return (
              <div key={v} style={{
                textAlign:"center", padding:"4px 2px", borderRadius:3,
                background: hot?"rgba(239,68,68,0.15)":warm?"rgba(249,115,22,0.1)":n>0?"rgba(59,130,246,0.06)":"transparent",
                border: hasCrit?"1px solid rgba(220,38,38,0.4)":hasO?"1px solid rgba(249,115,22,0.3)":"1px solid transparent",
              }}>
                {n>0&&<div style={{fontSize:11,fontWeight:700,color:hot?"#ef4444":warm?"#f97316":"#475569"}}>{n}</div>}
                {hasO&&<div style={{fontSize:8,color:"#f97316"}}>{t.open}o</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{fontSize:10,color:"#334155",fontWeight:700,letterSpacing:"0.06em"}}>LEGEND</span>
        {[
          ["Closed (dim cell)","rgba(56,189,248,0.15)","rgba(56,189,248,0.4)","1px"],
          ["Has open bugs","rgba(249,115,22,0.3)","#f97316","1px"],
          ["Has Critical bug","rgba(220,38,38,0.3)","#dc2626","2px"],
        ].map(([l,bg,bc,bw])=>(
          <span key={l} style={{fontSize:10,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:14,height:14,borderRadius:3,background:bg,border:bw+" solid "+bc,display:"inline-block"}}/>
            {l}
          </span>
        ))}
        <span style={{fontSize:10,color:"#64748b"}}>Darker = more bugs</span>
        <div style={{marginLeft:"auto",display:"flex",gap:10,flexWrap:"wrap"}}>
          {COMPONENTS.slice(0,6).map(c=>(
            <span key={c} style={{fontSize:10,color:"#64748b",display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:7,height:7,borderRadius:2,background:COMP_COLOR[c],display:"inline-block"}}/>{c.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{fontSize:10,fontWeight:700,color:"#475569",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>
          Key Insights
        </div>
        {[
          {color:"#38bdf8",icon:"🔵",text:"Web Configuration and Build & Deployment dominate every release line. Web Config's 7.8.0 cell has 18 bugs — the single hottest cell in the entire heatmap."},
          {color:"#f97316",icon:"🟠",text:"7.8.4.0 is the most impacted patch overall: 31 total bugs across 5 components, 5 of which are still open. It is the single riskiest version in the dataset."},
          {color:"#ef4444",icon:"🔴",text:"Build & Deployment has the most ZD tickets (71) and 13 Critical-severity bugs — highest customer pain per bug of any component. 7.8.2.0 and 7.8.3.0 are its worst patches."},
          {color:"#34d399",icon:"🟢",text:"Data Analytics bugs concentrate in 7.7.0 and 7.8.0 — earlier releases. Its 7.9.x exposure is low, suggesting the component is stabilising in newer releases."},
          {color:"#f59e0b",icon:"🟡",text:"Collection has only 10 bugs but 7 are still open — a 70% open rate. Every open Collection bug appears in 7.8.4.0 or 7.9.x, meaning recent releases have introduced new instability there."},
          {color:"#fb923c",icon:"🟣",text:"Alert & Incidents bugs cluster in 7.7.0 and 7.8.0 with Critical severity. The 7.9.x exposure is growing month-on-month, flagging this component as an emerging risk."},
        ].map((ins,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"9px 13px",background:"#0f1729",borderRadius:8,border:"1px solid "+ins.color+"33",borderLeft:"3px solid "+ins.color}}>
            <span style={{fontSize:14,flexShrink:0}}>{ins.icon}</span>
            <span style={{fontSize:11,color:"#94a3b8",lineHeight:1.7}}>{ins.text}</span>
          </div>
        ))}
      </div>

      <Tooltip data={hovered}/>
    </div>
  );
}