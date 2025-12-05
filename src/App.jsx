import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import GameMode from './pages/GameMode';
import PortalMode from './pages/PortalMode';
import Profile from './pages/Profile';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ui';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/portal" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/portal" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/portal" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Fullscreen Game Mode - No Layout */}
          <Route path="/game" element={<GameMode />} />
          
          {/* Routes with Layout (navbar) */}
          <Route element={<Layout />}>
            <Route path="/portal" element={<PortalMode />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
