import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './store/slices/authSlice';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Articles = lazy(() => import('./pages/Articles'));
const Upload = lazy(() => import('./pages/Upload'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ShortVideoPage = lazy(() => import('./pages/ShortVideoPage'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="app min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="ml-0 md:ml-64 pt-14 min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/shorts" element={<ShortVideoPage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/search" element={<Search />} />
            
            {/* Protected Routes */}
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/saved" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/your-videos" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/subscriptions" element={
              <NotFound />
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
