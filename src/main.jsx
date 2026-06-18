import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Layout.jsx'
import { routes } from './routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/bug-dashboard" replace />} />
          {routes.map((route) => (
            <Route key={route.path} path={route.path === '/bug-dashboard' ? '/bug-dashboard/*' : route.path} element={route.element} />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
