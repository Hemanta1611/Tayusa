import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaSignOutAlt, FaBookmark, FaCog, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import TayusaLogo from '../../assets/ChatGPT Image Apr 8, 2025, 04_36_48 PM.png';

function MainHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Function to close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white h-14 border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={TayusaLogo} alt="Tayusa Logo" className="h-8 mr-2" />
            <h1 className="text-xl font-bold">Tayusa</h1>
          </Link>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tech content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 w-full py-2 pl-10 pr-4 rounded-l-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button 
              type="submit" 
              className="bg-primary text-white px-4 py-2 rounded-r-full border border-primary hover:bg-blue-700 flex items-center"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
        
        {/* Right - Profile */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center focus:outline-none"
          >
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.username} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUser />
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <FaUserCircle className="mr-2" />
                Profile
              </Link>
              <Link 
                to="/saved" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <FaBookmark className="mr-2" />
                Saved Content
              </Link>
              <Link 
                to="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setDropdownOpen(false)}
              >
                <FaCog className="mr-2" />
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
