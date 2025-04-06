import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEye, FaHeart, FaBookmark } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

function ArticleCard({ article }) {
  const { _id, title, content, coverImageUrl, user, views, likes, readTime, createdAt, techTags } = article;

  // Truncate content for preview
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link to={`/article/${_id}`} className="block">
        {coverImageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img 
              src={coverImageUrl || 'https://via.placeholder.com/640x360?text=Tayusa+Article'} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags */}
          {techTags && techTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {techTags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {techTags.length > 3 && (
                <span className="text-xs text-gray-500">+{techTags.length - 3} more</span>
              )}
            </div>
          )}
          
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Content preview */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {truncateContent(content)}
          </p>
          
          {/* Author and stats */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Link to={`/profile/${user?._id}`} className="flex items-center hover:text-gray-700">
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2 bg-gray-200">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.username || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
                </div>
              </Link>
              
              <button className="text-gray-400 hover:text-primary transition-colors">
                <FaBookmark />
              </button>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <div className="flex items-center mr-3">
                <FaClock className="mr-1" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center mr-3">
                <FaEye className="mr-1" />
                <span>{views || 0} views</span>
              </div>
              <div className="flex items-center">
                <FaHeart className="mr-1" />
                <span>{likes?.length || 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ArticleCard;
