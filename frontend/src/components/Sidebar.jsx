import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaNewspaper, 
  FaVideo,
  FaPlayCircle, 
  FaUpload, 
  FaBookmark,
  FaUser
} from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const { sidebarOpen } = useSelector(state => state.ui);

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/articles' && location.pathname.includes('/articles'));
  };

  // Navigation items
  const navItems = [
    { path: '/articles', icon: <FaNewspaper />, text: 'Article Space' },
    { path: '/shorts', icon: <FaVideo />, text: 'Shorts' },
    { path: '/videos', icon: <FaPlayCircle />, text: 'Videos' },
    { path: '/upload', icon: <FaUpload />, text: 'Upload' },
    { path: '/saved', icon: <FaBookmark />, text: 'Saved Content' },
    { path: '/profile', icon: <FaUser />, text: 'Profile', divider: true }
  ];

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
