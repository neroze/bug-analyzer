import { useState } from "react";

const VERSIONS = ["7.2.0", "7.4.0", "7.5.0", "7.6.0", "7.6.1", "7.7.0", "7.7.1", "7.8.0", "7.8.1", "7.8.2", "7.8.3", "7.8.4", "7.9.0", "7.9.2"];
const HEATMAP  = {"Build & Deployment": {"7.2.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-70465"]}, "Medium": {"b": 2, "o": 0, "z": 5, "k": ["LP-70392", "LP-74949"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-70462"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.0": {"Critical": {"b": 1, "o": 0, "z": 2, "k": ["LP-70431"]}, "High": {"b": 3, "o": 0, "z": 4, "k": ["LP-70394", "LP-73406", "LP-75149"]}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-70219"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.2": {"Critical": {"b": 2, "o": 0, "z": 19, "k": ["LP-70312", "LP-75952"]}, "High": {"b": 1, "o": 0, "z": 7, "k": ["LP-73497"]}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-75196"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 1, "o": 0, "z": 1, "k": ["LP-70393"]}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-70430"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 1, "o": 0, "z": 5, "k": ["LP-73301"]}, "High": {"b": 5, "o": 4, "z": 5, "k": ["LP-75965", "LP-75966", "LP-75967", "LP-75969", "LP-75973"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.0": {"Critical": {"b": 2, "o": 0, "z": 5, "k": ["LP-75479", "LP-76033"]}, "High": {"b": 3, "o": 1, "z": 7, "k": ["LP-74964", "LP-76043", "LP-76212"]}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-75839"]}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-75665"]}}, "7.9.2": {"Critical": {"b": 1, "o": 0, "z": 4, "k": ["LP-76329"]}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}, "Web Configuration": {"7.2.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 2, "o": 0, "z": 2, "k": ["LP-70283", "LP-75834"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-75611"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 1, "o": 0, "z": 1, "k": ["LP-75083"]}, "High": {"b": 3, "o": 1, "z": 3, "k": ["LP-75829", "LP-75830", "LP-76202"]}, "Medium": {"b": 4, "o": 1, "z": 5, "k": ["LP-70615", "LP-73405", "LP-73422", "LP-75658"]}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-75717"]}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-73328"]}}, "7.8.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 2, "o": 0, "z": 4, "k": ["LP-73341", "LP-75050"]}, "Medium": {"b": 2, "o": 0, "z": 2, "k": ["LP-70308", "LP-75480"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 5, "k": ["LP-73329"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 3, "o": 1, "z": 4, "k": ["LP-73397", "LP-74967", "LP-76159"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-74879"]}}, "7.9.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 1, "z": 1, "k": ["LP-76241"]}, "Medium": {"b": 3, "o": 1, "z": 9, "k": ["LP-75826", "LP-75881", "LP-75917"]}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-75996"]}}, "7.9.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}, "Data Analytics": {"7.2.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 1, "o": 0, "z": 2, "k": ["LP-70434"]}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 1, "o": 0, "z": 3, "k": ["LP-73496"]}, "High": {"b": 2, "o": 0, "z": 3, "k": ["LP-70262", "LP-73339"]}, "Medium": {"b": 1, "o": 0, "z": 4, "k": ["LP-70584"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 2, "k": ["LP-70350"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.0": {"Critical": {"b": 1, "o": 0, "z": 1, "k": ["LP-76108"]}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 3, "o": 1, "z": 5, "k": ["LP-75010", "LP-76143", "LP-76194"]}, "Low": {"b": 1, "o": 1, "z": 2, "k": ["LP-75848"]}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-70479"]}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-70583"]}}, "7.8.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.0": {"Critical": {"b": 1, "o": 0, "z": 2, "k": ["LP-73313"]}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-73338"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}, "Alert & Incidents": {"7.2.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-76140"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 3, "o": 1, "z": 5, "k": ["LP-70664", "LP-75811", "LP-76041"]}, "Medium": {"b": 2, "o": 0, "z": 2, "k": ["LP-73764", "LP-74921"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.0": {"Critical": {"b": 1, "o": 0, "z": 3, "k": ["LP-75880"]}, "High": {"b": 3, "o": 0, "z": 7, "k": ["LP-70480", "LP-75801", "LP-76021"]}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-75166"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-75190"]}, "Medium": {"b": 1, "o": 1, "z": 1, "k": ["LP-75595"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 2, "o": 0, "z": 4, "k": ["LP-75676", "LP-75683"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}, "Data Pipeline": {"7.2.0": {"Critical": {"b": 1, "o": 0, "z": 6, "k": ["LP-73311"]}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-70472"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-70228"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 0, "z": 1, "k": ["LP-70400"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-75120"]}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 2, "o": 0, "z": 3, "k": ["LP-73360", "LP-74968"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 0, "z": 1, "k": ["LP-76058"]}}, "7.9.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}, "Collection": {"7.2.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.5.0": {"Critical": {"b": 1, "o": 0, "z": 2, "k": ["LP-75034"]}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 1, "z": 1, "k": ["LP-75828"]}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 1, "z": 1, "k": ["LP-75127"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 1, "o": 1, "z": 1, "k": ["LP-75866"]}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.3": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.8.4": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 1, "o": 1, "z": 1, "k": ["LP-76224"]}}, "7.9.0": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 1, "o": 0, "z": 1, "k": ["LP-75827"]}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}, "7.9.2": {"Critical": {"b": 0, "o": 0, "z": 0, "k": []}, "High": {"b": 0, "o": 0, "z": 0, "k": []}, "Medium": {"b": 0, "o": 0, "z": 0, "k": []}, "Low": {"b": 0, "o": 0, "z": 0, "k": []}}}};
const VER_TOT  = {"7.2.0": {"Critical": {"b": 1, "o": 0, "z": 6}, "High": {"b": 0, "o": 0, "z": 0}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.4.0": {"Critical": {"b": 0, "o": 0, "z": 0}, "High": {"b": 1, "o": 0, "z": 1}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.5.0": {"Critical": {"b": 2, "o": 0, "z": 4}, "High": {"b": 1, "o": 0, "z": 1}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.6.0": {"Critical": {"b": 0, "o": 0, "z": 0}, "High": {"b": 0, "o": 0, "z": 0}, "Medium": {"b": 2, "o": 0, "z": 2}, "Low": {"b": 1, "o": 1, "z": 1}}, "7.6.1": {"Critical": {"b": 0, "o": 0, "z": 0}, "High": {"b": 1, "o": 0, "z": 1}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.7.0": {"Critical": {"b": 2, "o": 0, "z": 4}, "High": {"b": 9, "o": 2, "z": 12}, "Medium": {"b": 10, "o": 1, "z": 17}, "Low": {"b": 1, "o": 0, "z": 1}}, "7.7.1": {"Critical": {"b": 0, "o": 0, "z": 0}, "High": {"b": 1, "o": 1, "z": 1}, "Medium": {"b": 3, "o": 0, "z": 4}, "Low": {"b": 1, "o": 0, "z": 1}}, "7.8.0": {"Critical": {"b": 3, "o": 0, "z": 6}, "High": {"b": 8, "o": 0, "z": 15}, "Medium": {"b": 8, "o": 2, "z": 10}, "Low": {"b": 2, "o": 1, "z": 3}}, "7.8.1": {"Critical": {"b": 0, "o": 0, "z": 0}, "High": {"b": 0, "o": 0, "z": 0}, "Medium": {"b": 2, "o": 0, "z": 6}, "Low": {"b": 1, "o": 0, "z": 1}}, "7.8.2": {"Critical": {"b": 2, "o": 0, "z": 19}, "High": {"b": 1, "o": 0, "z": 7}, "Medium": {"b": 1, "o": 0, "z": 1}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.8.3": {"Critical": {"b": 1, "o": 0, "z": 1}, "High": {"b": 1, "o": 0, "z": 1}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}, "7.8.4": {"Critical": {"b": 1, "o": 0, "z": 5}, "High": {"b": 11, "o": 5, "z": 13}, "Medium": {"b": 1, "o": 1, "z": 1}, "Low": {"b": 2, "o": 1, "z": 2}}, "7.9.0": {"Critical": {"b": 3, "o": 0, "z": 7}, "High": {"b": 8, "o": 2, "z": 14}, "Medium": {"b": 4, "o": 1, "z": 10}, "Low": {"b": 3, "o": 0, "z": 3}}, "7.9.2": {"Critical": {"b": 1, "o": 0, "z": 4}, "High": {"b": 0, "o": 0, "z": 0}, "Medium": {"b": 0, "o": 0, "z": 0}, "Low": {"b": 0, "o": 0, "z": 0}}};
const COMP_TOT = {"Build & Deployment": {"Critical": {"b": 8, "o": 0, "z": 36}, "High": {"b": 14, "o": 0, "z": 25}, "Medium": {"b": 6, "o": 0, "z": 9}, "Low": {"b": 1, "o": 0, "z": 1}}, "Web Configuration": {"Critical": {"b": 1, "o": 0, "z": 1}, "High": {"b": 10, "o": 0, "z": 13}, "Medium": {"b": 12, "o": 0, "z": 23}, "Low": {"b": 4, "o": 0, "z": 4}}, "Data Analytics": {"Critical": {"b": 4, "o": 0, "z": 8}, "High": {"b": 3, "o": 0, "z": 4}, "Medium": {"b": 6, "o": 0, "z": 12}, "Low": {"b": 2, "o": 0, "z": 3}}, "Alert & Incidents": {"Critical": {"b": 1, "o": 0, "z": 3}, "High": {"b": 10, "o": 0, "z": 18}, "Medium": {"b": 4, "o": 0, "z": 4}, "Low": {"b": 0, "o": 0, "z": 0}}, "Data Pipeline": {"Critical": {"b": 1, "o": 0, "z": 6}, "High": {"b": 3, "o": 0, "z": 4}, "Medium": {"b": 2, "o": 0, "z": 2}, "Low": {"b": 2, "o": 0, "z": 2}}, "Collection": {"Critical": {"b": 1, "o": 0, "z": 2}, "High": {"b": 2, "o": 0, "z": 2}, "Medium": {"b": 1, "o": 0, "z": 1}, "Low": {"b": 2, "o": 0, "z": 2}}};

const COMPONENTS = [
  "Build & Deployment","Web Configuration","Data Analytics",
  "Alert & Incidents","Data Pipeline","Collection",
];
const COMP_COLOR = {
  "Build & Deployment":"#38bdf8","Web Configuration":"#f97316",
  "Data Analytics":"#34d399","Alert & Incidents":"#f59e0b",
  "Data Pipeline":"#818cf8","Collection":"#fb923c",
};
const VER_GROUPS = [
  {label:"7.2-7.6", vers:["7.2.0","7.4.0","7.5.0","7.6.0","7.6.1"]},
  {label:"7.7",     vers:["7.7.0","7.7.1"]},
  {label:"7.8",     vers:["7.8.0","7.8.1","7.8.2","7.8.3","7.8.4"]},
  {label:"7.9",     vers:["7.9.0","7.9.2"]},
];

// severity config
const SEVS       = ["Critical","High","Medium","Low"];
const SEV_COLOR  = {Critical:"#dc2626",High:"#f97316",Medium:"#eab308",Low:"#64748b"};
const SEV_BG     = {Critical:"rgba(220,38,38,0.18)",High:"rgba(249,115,22,0.15)",Medium:"rgba(234,179,8,0.13)",Low:"rgba(100,116,139,0.15)"};
const SEV_BORDER = {Critical:"rgba(220,38,38,0.55)",High:"rgba(249,115,22,0.45)",Medium:"rgba(234,179,8,0.4)",Low:"rgba(100,116,139,0.35)"};

function buildJQL(keys, comp, ver, sev) {
  if (keys && keys.length > 0)
    return 'project = LogPoint AND issuetype = Bug AND key in (' + keys.join(',') + ') ORDER BY "Zendesk Ticket Count[Number]" DESC';
  let jql = 'project = LogPoint AND issuetype = Bug AND component = "' + comp + '" AND "Zendesk Ticket Count[Number]" > 0';
  if (ver) jql += ' AND affectedVersion = "' + ver + '"';
  return jql + ' ORDER BY created ASC';
}
function openJira(jql) {
  window.open("https://logpoint.atlassian.net/issues/?jql=" + encodeURIComponent(jql), "_blank");
}

// ── Sub-cell (one severity band inside a version cell) ────────────────────────
function SubCell({ comp, version, sev, isHovered, onHover }) {
  const data = ((HEATMAP[comp] || {})[version] || {})[sev] || {b:0,o:0,z:0,k:[]};
  if (data.b === 0) {
    return (
      <div onMouseEnter={()=>onHover(null)}
        style={{flex:1,height:40,borderRadius:3,background:"#060b16",border:"1px solid #0c1423"}}/>
    );
  }
  const c   = SEV_COLOR[sev];
  const bg  = SEV_BG[sev];
  const brd = SEV_BORDER[sev];
  const hasOpen = data.o > 0;

  return (
    <div
      onMouseEnter={()=>onHover({comp, version, sev, data})}
      onMouseLeave={()=>onHover(null)}
      onClick={()=>openJira(buildJQL(data.k, comp, version, sev))}
      title={"Click: "+comp+" v"+version+" "+sev+" bugs in Jira"}
      style={{
        flex:1, height:40, borderRadius:3, cursor:"pointer",
        background: isHovered ? (SEV_BG[sev].replace("0.18","0.38").replace("0.15","0.32").replace("0.13","0.28")) : bg,
        border:"1px solid "+(isHovered ? c : (hasOpen ? c : brd)),
        display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:1,
        transform: isHovered ? "scale(1.12)" : "scale(1)",
        zIndex: isHovered ? 20 : 1,
        boxShadow: isHovered ? "0 0 10px "+c+"88" : "none",
        transition:"all 0.1s", position:"relative",
      }}
    >
      <span style={{fontSize:14,fontWeight:700,color:c,lineHeight:1}}>{data.b}</span>
      {hasOpen && <span style={{fontSize:7,color:c,fontWeight:700}}>OPEN</span>}
    </div>
  );
}

// ── Version cell: 4 sub-cells (C/H/M/L) side by side ─────────────────────────
function VersionCell({ comp, version, hovered, onHover }) {
  const verData = (HEATMAP[comp] || {})[version] || {};
  const totalBugs = SEVS.reduce((s,sv)=>s+(verData[sv]||{b:0}).b, 0);

  if (totalBugs === 0) {
    return (
      <div style={{display:"flex",gap:1,height:40}}>
        {SEVS.map(s=>(
          <div key={s} style={{flex:1,height:40,borderRadius:3,background:"#060b16",border:"1px solid #0c1423"}}/>
        ))}
      </div>
    );
  }
  return (
    <div style={{display:"flex",gap:1,height:40}}>
      {SEVS.map(s=>{
        const isHov = hovered && hovered.comp===comp && hovered.version===version && hovered.sev===s;
        return (
          <SubCell key={s} comp={comp} version={version} sev={s}
            isHovered={isHov} onHover={onHover}/>
        );
      })}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({data}) {
  if (!data) return null;
  const {comp, version, sev, data:cell} = data;
  const c = SEV_COLOR[sev];
  const jql = buildJQL(cell.k, comp, version, sev);
  const url = "https://logpoint.atlassian.net/issues/?jql=" + encodeURIComponent(jql);
  return (
    <div style={{
      position:"fixed",top:16,right:16,width:340,zIndex:9999,
      background:"#0e1628",border:"1px solid "+c,
      borderRadius:10,padding:16,
      boxShadow:"0 8px 40px rgba(0,0,0,0.75)",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{width:8,height:8,borderRadius:2,background:COMP_COLOR[comp],display:"inline-block"}}/>
        <span style={{fontSize:11,fontWeight:700,color:COMP_COLOR[comp],flex:1}}>{comp}</span>
        <span style={{fontSize:11,color:"#7dd3fc",background:"#1e3a5f",padding:"2px 8px",borderRadius:4,fontWeight:600}}>v{version}</span>
        <span style={{fontSize:11,fontWeight:700,color:c,background:SEV_BG[sev],padding:"2px 8px",borderRadius:4,border:"1px solid "+SEV_BORDER[sev]}}>{sev}</span>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12,padding:"8px",background:"#060b16",borderRadius:6}}>
        {[["Bugs",cell.b,"#f1f5f9"],["Open",cell.o,cell.o>0?"#f97316":"#22c55e"],["ZD",cell.z,"#8b5cf6"]].map(([l,v,col])=>(
          <div key={l} style={{textAlign:"center",flex:1}}>
            <div style={{fontSize:20,fontWeight:700,color:col}}>{v}</div>
            <div style={{fontSize:10,color:"#475569"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:"#334155",marginBottom:7,fontWeight:600,letterSpacing:"0.06em"}}>JIRA KEYS</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
        {cell.k.map(k=>(
          <a key={k} href={"https://logpoint.atlassian.net/browse/"+k} target="_blank" rel="noreferrer"
            style={{fontSize:10,color:"#38bdf8",background:"#1e3a5f",padding:"2px 7px",borderRadius:4,textDecoration:"none",fontWeight:600}}>
            {k}
          </a>
        ))}
        {cell.b>cell.k.length&&<span style={{fontSize:10,color:"#334155",padding:"2px 5px"}}>+{cell.b-cell.k.length} more</span>}
      </div>
      <a href={url} target="_blank" rel="noreferrer"
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          padding:"9px 14px",background:c+"18",border:"1px solid "+c+"60",
          borderRadius:6,textDecoration:"none",color:c,fontSize:12,fontWeight:700}}>
        {"↗ Open "+cell.b+" bug"+(cell.b>1?"s":"")+" in Jira"}
      </a>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [hovered, setHovered] = useState(null);
  const [selSev,  setSelSev]  = useState(null); // filter to single severity

  const totalBugs = COMPONENTS.reduce((s,c)=>s+SEVS.reduce((ss,sv)=>ss+(COMP_TOT[c]||{})[sv]?.b||0,0),0);
  const totalZD   = COMPONENTS.reduce((s,c)=>s+SEVS.reduce((ss,sv)=>ss+(COMP_TOT[c]||{})[sv]?.z||0,0),0);
  const totalOpen = COMPONENTS.reduce((s,c)=>s+SEVS.reduce((ss,sv)=>ss+(COMP_TOT[c]||{})[sv]?.o||0,0),0);

  function handleCompJira(comp) {
    openJira('project = LogPoint AND issuetype = Bug AND component = "'+comp+'" AND createdDate >= "2026-01-01" AND createdDate <= "2026-05-31" AND "Zendesk Ticket Count[Number]" > 0 ORDER BY "Zendesk Ticket Count[Number]" DESC');
  }
  function handleVerJira(ver) {
    openJira('project = LogPoint AND issuetype = Bug AND createdDate >= "2026-01-01" AND createdDate <= "2026-05-31" AND "Zendesk Ticket Count[Number]" > 0 AND affectedVersion = "'+ver+'" ORDER BY "Zendesk Ticket Count[Number]" DESC');
  }

  const visibleSevs = selSev ? [selSev] : SEVS;

  return (
    <div style={{fontFamily:"'DM Mono','Fira Code',monospace",background:"#060b16",minHeight:"100vh",color:"#e2e8f0",padding:20}}>

      {/* Header */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:"#334155",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>
          LogPoint · ZD-Linked Bugs · Jan–May 2026 · By Component + Severity
        </div>
        <div style={{fontSize:20,fontWeight:700,color:"#f8fafc",marginBottom:3}}>Affected Version Heatmap</div>
        <div style={{fontSize:11,color:"#475569",marginBottom:12,lineHeight:1.6}}>
          Each version column split into 4 severity sub-cells (Critical / High / Medium / Low).
          Only ZD-linked bugs. Version = lowest canonical affected version (3-digit).
          Click any cell to open matching Jira JQL.
        </div>

        {/* KPIs */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {[
            [totalBugs+"","ZD-linked bugs","#3b82f6"],
            [totalZD+"","ZD tickets","#8b5cf6"],
            [totalOpen+"","still open","#ef4444"],
          ].map(([v,l,c])=>(
            <div key={l} style={{padding:"5px 14px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid "+c+"30"}}>
              <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
              <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
            </div>
          ))}
          {/* Severity totals */}
          {SEVS.map(s=>{
            const total = COMPONENTS.reduce((ss,c)=>ss+((COMP_TOT[c]||{})[s]||{b:0}).b,0);
            const open  = COMPONENTS.reduce((ss,c)=>ss+((COMP_TOT[c]||{})[s]||{o:0}).o,0);
            const isSel = selSev===s;
            return (
              <div key={s} onClick={()=>setSelSev(isSel?null:s)}
                style={{padding:"5px 14px",background:isSel?SEV_BG[s]:"rgba(255,255,255,0.02)",
                  borderRadius:8,border:"1px solid "+(isSel?SEV_BORDER[s]:SEV_COLOR[s]+"25"),
                  cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{fontSize:18,fontWeight:700,color:SEV_COLOR[s]}}>{total}</div>
                <div style={{fontSize:10,color:SEV_COLOR[s],opacity:0.7}}>{open>0?open+" open":""}</div>
                <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em"}}>{s}</div>
              </div>
            );
          })}
          {selSev&&(
            <div onClick={()=>setSelSev(null)}
              style={{padding:"5px 12px",background:"rgba(255,255,255,0.03)",borderRadius:8,
                border:"1px solid #334155",cursor:"pointer",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#64748b"}}>Clear filter ×</span>
            </div>
          )}
        </div>

        {/* Sub-cell legend */}
        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"#334155",fontWeight:700,letterSpacing:"0.06em"}}>SEVERITY BANDS:</span>
          {SEVS.map(s=>(
            <span key={s} style={{fontSize:11,display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:14,height:14,borderRadius:3,background:SEV_BG[s],border:"1px solid "+SEV_BORDER[s],display:"inline-block"}}/>
              <span style={{color:SEV_COLOR[s],fontWeight:600}}>{s}</span>
            </span>
          ))}
          <span style={{fontSize:10,color:"#475569",marginLeft:4}}>Each version column has 4 sub-cells left-to-right</span>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:12,padding:"14px 14px 10px",overflowX:"auto"}}>

        {/* Release group headers */}
        <div style={{display:"grid",gridTemplateColumns:"180px repeat(14,1fr)",gap:4,marginBottom:2,minWidth:900}}>
          <div/>
          {VER_GROUPS.map(g=>(
            <div key={g.label} style={{
              gridColumn:"span "+g.vers.length,
              textAlign:"center",fontSize:10,fontWeight:700,color:"#334155",
              padding:"3px 0",borderBottom:"1px solid #1e3a5f",letterSpacing:"0.08em",
            }}>{g.label}</div>
          ))}
        </div>

        {/* Version column labels */}
        <div style={{display:"grid",gridTemplateColumns:"180px repeat(14,1fr)",gap:4,marginBottom:10,minWidth:900}}>
          <div style={{fontSize:9,color:"#1e3a5f",display:"flex",alignItems:"flex-end",paddingBottom:4}}>Component</div>
          {VERSIONS.map(v=>{
            const tot = SEVS.reduce((s,sv)=>s+((VER_TOT[v]||{})[sv]||{b:0}).b, 0);
            const hot = tot>=10, mid = tot>=5;
            return (
              <div key={v} onClick={()=>tot>0&&handleVerJira(v)}
                title={tot>0?"Open v"+v+" bugs in Jira":""}
                style={{textAlign:"center",paddingBottom:2,cursor:tot>0?"pointer":"default"}}>
                <div style={{
                  fontSize:8,fontWeight:hot?700:mid?600:400,
                  color:hot?"#ef4444":mid?"#f97316":tot>0?"#334155":"#1a2235",
                  transform:"rotate(-50deg)",transformOrigin:"50% 100%",
                  whiteSpace:"nowrap",display:"block",marginBottom:3,lineHeight:1,
                }}>{v}</div>
                {tot>0&&(
                  <div style={{fontSize:10,fontWeight:700,
                    color:hot?"#ef4444":mid?"#f97316":"#475569",
                    background:hot?"rgba(239,68,68,0.1)":mid?"rgba(249,115,22,0.07)":"transparent",
                    borderRadius:3,padding:"1px 2px"}}>{tot}</div>
                )}
                {/* Mini severity bar */}
                {tot>0&&(
                  <div style={{display:"flex",height:3,borderRadius:1,overflow:"hidden",marginTop:2,gap:"0.5px"}}>
                    {SEVS.map(s=>{
                      const n = ((VER_TOT[v]||{})[s]||{b:0}).b;
                      return n>0 ? (
                        <div key={s} style={{flex:n,background:SEV_COLOR[s]}}/>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Component rows */}
        {COMPONENTS.map(comp=>{
          const ct    = COMP_TOT[comp] || {};
          const total = SEVS.reduce((s,sv)=>s+(ct[sv]||{b:0}).b,0);
          return (
            <div key={comp} style={{display:"grid",gridTemplateColumns:"180px repeat(14,1fr)",gap:4,marginBottom:5,minWidth:900}}>
              {/* Row label */}
              <div onClick={()=>handleCompJira(comp)}
                title={"Open all "+total+" "+comp+" bugs in Jira"}
                style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",paddingRight:6}}>
                <span style={{width:7,height:7,borderRadius:2,background:COMP_COLOR[comp],flexShrink:0,display:"inline-block"}}/>
                <div>
                  <div style={{fontSize:11,fontWeight:500,color:"#94a3b8",whiteSpace:"nowrap",
                    textDecoration:"underline",textDecorationColor:COMP_COLOR[comp]+"55",
                    textDecorationStyle:"dotted",textUnderlineOffset:"2px"}}>{comp}</div>
                  <div style={{display:"flex",gap:5,fontSize:9,marginTop:1}}>
                    {SEVS.map(s=>{
                      const n = (ct[s]||{b:0}).b;
                      return n>0?(
                        <span key={s} style={{color:SEV_COLOR[s],fontWeight:600}}>{n}{s[0]}</span>
                      ):null;
                    })}
                    {SEVS.reduce((s,sv)=>s+(ct[sv]||{o:0}).o,0)>0&&(
                      <span style={{color:"#f97316"}}>{SEVS.reduce((s,sv)=>s+(ct[sv]||{o:0}).o,0)}o</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Version cells */}
              {VERSIONS.map(v=>(
                <div key={v} style={{display:"flex",gap:1}}>
                  {visibleSevs.map(s=>{
                    const isHov = hovered&&hovered.comp===comp&&hovered.version===v&&hovered.sev===s;
                    return (
                      <SubCell key={s} comp={comp} version={v} sev={s}
                        isHovered={isHov} onHover={setHovered}/>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        {/* Footer totals */}
        <div style={{display:"grid",gridTemplateColumns:"180px repeat(14,1fr)",gap:4,marginTop:8,paddingTop:8,borderTop:"1px solid #1e3a5f",minWidth:900}}>
          <div style={{fontSize:9,color:"#334155",fontWeight:700,display:"flex",alignItems:"center"}}>TOTAL</div>
          {VERSIONS.map(v=>{
            const tot = SEVS.reduce((s,sv)=>s+((VER_TOT[v]||{})[sv]||{b:0}).b,0);
            const ope = SEVS.reduce((s,sv)=>s+((VER_TOT[v]||{})[sv]||{o:0}).o,0);
            const hot = tot>=10, mid = tot>=5;
            return (
              <div key={v} onClick={()=>tot>0&&handleVerJira(v)}
                style={{textAlign:"center",padding:"4px 2px",borderRadius:4,cursor:tot>0?"pointer":"default",
                  background:hot?"rgba(239,68,68,0.12)":mid?"rgba(249,115,22,0.08)":tot>0?"rgba(59,130,246,0.05)":"transparent",
                  border:ope>0?"1px solid rgba(249,115,22,0.3)":"1px solid transparent"}}>
                {tot>0&&<div style={{fontSize:11,fontWeight:700,color:hot?"#ef4444":mid?"#f97316":"#475569"}}>{tot}</div>}
                {ope>0&&<div style={{fontSize:8,color:"#f97316"}}>{ope}o</div>}
                {/* Severity mini-bar */}
                {tot>0&&(
                  <div style={{display:"flex",height:3,borderRadius:1,overflow:"hidden",marginTop:2,gap:"0.5px"}}>
                    {SEVS.map(s=>{
                      const n=((VER_TOT[v]||{})[s]||{b:0}).b;
                      return n>0?<div key={s} style={{flex:n,background:SEV_COLOR[s]}}/>:null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Component legend */}
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:10,color:"#334155",fontWeight:700,letterSpacing:"0.06em"}}>COMPONENTS:</span>
        {COMPONENTS.map(c=>(
          <span key={c} onClick={()=>handleCompJira(c)}
            style={{fontSize:10,color:"#64748b",display:"flex",alignItems:"center",gap:4,cursor:"pointer",
              textDecoration:"underline",textDecorationStyle:"dotted",textDecorationColor:COMP_COLOR[c]+"60",
              textUnderlineOffset:"2px"}}>
            <span style={{width:7,height:7,borderRadius:2,background:COMP_COLOR[c],display:"inline-block"}}/>{c}
          </span>
        ))}
        <span style={{fontSize:10,color:"#38bdf8",fontWeight:600,marginLeft:"auto"}}>
          Click any cell, label, or total to open Jira
        </span>
      </div>

      <Tooltip data={hovered}/>
    </div>
  );
}