import { BugDashboard } from './App.jsx';
import LpMindmap from './mindMap.tsx';
import HelloWorld from './HelloWorld.tsx';
import BugDashboardByComponent from './bug-dash-by-component.tsx';
import BugDashboardDeepDive from './bug-dash-deep-dive.jsx';
import BugDashboardVersionHeatMap from './bug-dash-version-heat-map.jsx';
import BugDashboardVersionHeatMapJanToMay from './hit-map-by-jan-to-May.jsx';
import AlertEngine from './lp-alert-engine.jsx';


export const routes = [
  { path: '/bug-dashboard', label: 'Bug Dashboard', element: <BugDashboard /> },
  { path: '/lp-mindmap', label: 'LP Mindmap', element: <LpMindmap /> },
  { path: '/hello-world', label: 'Hello World', element: <HelloWorld /> },
  { path: '/bug-component', label: 'Bug by Component', element: <BugDashboardByComponent /> },
  { path: '/bug-deep-dive', label: 'Bug Deep Dive', element: <BugDashboardDeepDive /> },
  { path: '/version-heat-map', label: 'Version Heat Map', element: <BugDashboardVersionHeatMap /> },
  { path: '/version-heat-map-jan-to-may', label: 'Version Heat Map Jan to May', element: <BugDashboardVersionHeatMapJanToMay /> },
  { path: '/alert-engine', label: 'Alert Engine', element: <AlertEngine /> },
];
