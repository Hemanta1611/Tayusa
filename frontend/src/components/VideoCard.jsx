import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaEye, FaClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

function VideoCard({ video }) {
  const { _id, title, thumbnailUrl, user, views, createdAt, duration } = video;

  // Format views (e.g., 1.5K, 1.2M)
  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  // Format the date to "x days/hours/minutes ago"
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <Link to={`/video/${_id}`} className="block relative aspect-video overflow-hidden">
        <img 
          src={thumbnailUrl || 'https://via.placeholder.com/640x360?text=Tayusa'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-primary bg-opacity-80 flex items-center justify-center">
            <FaPlay className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded flex items-center">
          <FaClock className="mr-1 text-xs" />
          <span>{formatDuration(duration || 0)}</span>
        </div>
      </Link>
      
      <div className="p-3 flex flex-1 flex-col">
        <Link to={`/video/${_id}`} className="block">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary transition-colors">{title}</h3>
        </Link>
        
        <div className="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500">
          <Link to={`/profile/${user?._id}`} className="flex items-center hover:text-gray-700">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-200">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <span className="truncate max-w-[120px]">{user?.username || 'Anonymous'}</span>
          </Link>
          
          <div className="flex items-center">
            <div className="flex items-center mr-2" title={`${views} views`}>
              <FaEye className="mr-1 text-xs" />
              <span>{formatViews(views || 0)}</span>
            </div>
            <span title={createdAt ? new Date(createdAt).toLocaleString() : ''}>
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
