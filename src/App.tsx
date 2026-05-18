import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/Layout';

// ── Code-split all pages ──────────────────────────────────────────────────────
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Courses = lazy(() => import('./pages/Courses').then((m) => ({ default: m.Courses })));
const Learn = lazy(() => import('./pages/Learn').then((m) => ({ default: m.Learn })));
const Playground = lazy(() => import('./pages/Playground').then((m) => ({ default: m.Playground })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const Onboarding = lazy(() => import('./pages/Onboarding').then((m) => ({ default: m.Onboarding })));

// ── Page transition wrapper ───────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const PageWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const PageSkeleton: React.FC = () => (
  <div className="min-h-screen p-8 space-y-6 max-w-6xl mx-auto">
    {[1, 2].map((i) => (
      <div key={i} className="h-40 rounded-card"
        style={{ background: 'linear-gradient(90deg,#1E293B 25%,#2D3748 50%,#1E293B 75%)', backgroundSize: '200%', animation: 'shimmer 1.5s linear infinite' }} />
    ))}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 rounded-card"
          style={{ background: 'linear-gradient(90deg,#1E293B 25%,#2D3748 50%,#1E293B 75%)', backgroundSize: '200%', animation: 'shimmer 1.5s linear infinite' }} />
      ))}
    </div>
  </div>
);

// ── Layout wrapper as outlet ──────────────────────────────────────────────────
const LayoutOutlet: React.FC = () => (
  <Layout><Outlet /></Layout>
);

// ── Inner router that reads location ─────────────────────────────────────────
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          {/* Auth routes — no Layout wrapper */}
          <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
          <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
          <Route path="/onboarding" element={<PageWrap><Onboarding /></PageWrap>} />

          {/* App routes — wrapped in Layout via Outlet */}
          <Route element={<LayoutOutlet />}>
            <Route path="/" element={<PageWrap><Landing /></PageWrap>} />
            <Route path="/dashboard" element={<PageWrap><Dashboard /></PageWrap>} />
            <Route path="/courses" element={<PageWrap><Courses /></PageWrap>} />
            <Route path="/learn/:mod/:topic" element={<PageWrap><Learn /></PageWrap>} />
            <Route path="/playground" element={<PageWrap><Playground /></PageWrap>} />
            <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
