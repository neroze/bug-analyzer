import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from './routes.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const isDashboardPath = location.pathname.startsWith('/bug-dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'DM Mono','Fira Code',monospace", background: '#0a0f1e', minHeight: '100vh', color: '#e2e8f0', position: 'relative' }}>
      {/* <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderBottom: '1px solid #1e3a5f', padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🐛</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>My App</div>
          </div>
        </div>
      </div> */}
      <div style={{ padding: '22px 24px' }}>
        {children}
      </div>
      
      {/* Floating Menu Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px' }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'transform 0.2s'
          }}
        >
          ☰
        </button>
        
        {/* Menu List */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            background: '#0f1729',
            border: '1px solid #1e3a5f',
            borderRadius: '12px',
            padding: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            minWidth: '200px'
          }}>
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 16px',
                  color: (location.pathname === route.path || (route.path === '/bug-dashboard' && isDashboardPath)) ? '#38bdf8' : '#e2e8f0',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: (location.pathname === route.path || (route.path === '/bug-dashboard' && isDashboardPath)) ? 600 : 400,
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  transition: 'background 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {route.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
