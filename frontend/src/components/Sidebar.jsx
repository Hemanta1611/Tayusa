import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaHome, 
  FaVideo,
  FaNewspaper, 
  FaUpload, 
  FaUser, 
  FaBookmark, 
  FaHistory,
  FaPlayCircle
} from 'react-icons/fa';
import { MdSubscriptions } from 'react-icons/md';

function Sidebar() {
  const location = useLocation();
  const { sidebarOpen } = useSelector(state => state.ui);
  const { isAuthenticated } = useSelector(state => state.auth);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Common navigation items for all users
  const commonNavItems = [
    { path: '/', icon: <FaHome />, text: 'Home' },
    { path: '/shorts', icon: <FaVideo />, text: 'Shorts' },
    { path: '/subscriptions', icon: <MdSubscriptions />, text: 'Subscriptions' }
  ];
  
  // Navigation items only for authenticated users
  const authNavItems = [
    { path: '/your-videos', icon: <FaPlayCircle />, text: 'Your Videos' },
    { path: '/history', icon: <FaHistory />, text: 'History' },
    { path: '/saved', icon: <FaBookmark />, text: 'Saved' },
    { path: '/upload', icon: <FaUpload />, text: 'Upload', divider: true },
    { path: '/profile', icon: <FaUser />, text: 'Your Channel' }
  ];

  // Combine nav items based on authentication status
  const navItems = isAuthenticated 
    ? [...commonNavItems, ...authNavItems]
    : commonNavItems;

  return (
    <div className={`bg-white h-full w-64 border-r border-gray-200 flex-shrink-0 fixed left-0 top-14 bottom-0 overflow-y-auto ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
      <div className="py-4">
        {navItems.map((item, index) => (
          <div key={item.path}>
            <Link 
              to={item.path} 
              className={`flex items-center px-6 py-3 text-sm ${
                isActive(item.path) 
                  ? 'bg-gray-100 text-primary font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
            {item.divider && <hr className="my-2 border-gray-200" />}
          </div>
        ))}
      </div>
      
      <div className="mt-auto px-6 py-4 text-xs text-gray-500 border-t border-gray-200">
        <p>&#169; 2025 TAYUSA</p>
        <p className="mt-1">Tech Learning Platform</p>
      </div>
    </div>
  );
}

export default Sidebar;
