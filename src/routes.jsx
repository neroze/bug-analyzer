import { BugDashboard } from './App.jsx';
import LpMindmap from './mindMap.tsx';
import HelloWorld from './HelloWorld.tsx';
import BugDashboardByComponent from './bug-dash-by-component.tsx';
import BugDashboardDeepDive from './bug-dash-deep-dive.jsx';
import BugDashboardVersionHeatMap from './bug-dash-version-heat-map.jsx';


export const routes = [
  { path: '/bug-dashboard', label: 'Bug Dashboard', element: <BugDashboard /> },
  { path: '/lp-mindmap', label: 'LP Mindmap', element: <LpMindmap /> },
  { path: '/hello-world', label: 'Hello World', element: <HelloWorld /> },
  { path: '/bug-component', label: 'Bug by Component', element: <BugDashboardByComponent /> },
  { path: '/bug-deep-dive', label: 'Bug Deep Dive', element: <BugDashboardDeepDive /> },
  { path: '/version-heat-map', label: 'Version Heat Map', element: <BugDashboardVersionHeatMap /> },
];
