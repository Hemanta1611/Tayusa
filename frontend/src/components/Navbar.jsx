import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaUserCircle, FaBell, FaUpload, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar } from '../store/slices/uiSlice';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md h-14 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="mr-3 text-gray-600 hover:text-primary md:hidden"
        >
          <FaBars size={20} />
        </button>
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-primary">TAYUSA</h1>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            placeholder="Search tech content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button 
            type="submit" 
            className="bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
          >
            <FaSearch className="text-gray-600" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="text-gray-600 hover:text-primary">
              <FaUpload size={20} />
            </Link>
            <Link to="/notifications" className="text-gray-600 hover:text-primary">
              <FaBell size={20} />
            </Link>
            <div className="relative group">
              <div className="cursor-pointer flex items-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.username} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle size={30} className="text-gray-600" />
                )}
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <div className="py-2">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-1.5 text-primary border border-primary rounded-full hover:bg-blue-50">
              Login
            </Link>
            <Link to="/register" className="px-4 py-1.5 bg-primary text-white rounded-full hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
