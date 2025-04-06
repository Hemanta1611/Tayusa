import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

function ShortVideoCard({ video }) {
  const { _id, title, thumbnailUrl, user, likes, comments, createdAt } = video;

  // Format the date to "x days/hours/minutes ago"
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <Link 
        to={`/shorts/${_id}`} 
        className="block relative overflow-hidden"
        style={{ aspectRatio: '9/16' }} // Short video aspect ratio
      >
        <img 
          src={thumbnailUrl || 'https://via.placeholder.com/360x640?text=Tayusa+Short'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-primary bg-opacity-80 flex items-center justify-center">
            <FaPlay className="text-white ml-1" />
          </div>
        </div>
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{title}</h3>
          
          <div className="flex items-center justify-between">
            <Link to={`/profile/${user?._id}`} className="flex items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <span className="text-xs truncate max-w-[80px]">{user?.username || 'Anonymous'}</span>
            </Link>
            
            <span className="text-xs opacity-80">{formatDate(createdAt)}</span>
          </div>
        </div>
      </Link>
      
      {/* Interaction buttons */}
      <div className="flex justify-around p-2 text-gray-600">
        <button className="flex flex-col items-center px-2 py-1 hover:text-primary transition-colors">
          <FaHeart />
          <span className="text-xs mt-1">{likes?.length || 0}</span>
        </button>
        <button className="flex flex-col items-center px-2 py-1 hover:text-primary transition-colors">
          <FaComment />
          <span className="text-xs mt-1">{comments?.length || 0}</span>
        </button>
        <button className="flex flex-col items-center px-2 py-1 hover:text-primary transition-colors">
          <FaShare />
          <span className="text-xs mt-1">Share</span>
        </button>
      </div>
    </div>
  );
}

export default ShortVideoCard;
