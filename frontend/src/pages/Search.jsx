import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SecondHeader from '../components/SecondHeader';
import { searchContent } from '../store/slices/contentSlice';
import { isTechRelated } from '../utils/techValidation';

function Search() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, searchResults, error } = useSelector(state => state.content);
  const [activeTab, setActiveTab] = useState('all');
  const [isNonTech, setIsNonTech] = useState(false);
  const [sourceType, setSourceType] = useState('local'); // 'local' or 'youtube'
  
  // Get search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';
  
  useEffect(() => {
    if (query) {
      // Check if query is tech-related before searching
      const techRelated = isTechRelated(query);
      setIsNonTech(!techRelated);
      
      if (techRelated) {
        dispatch(searchContent(query));
      }
    }
  }, [dispatch, query]);
  
  // Determine source type when results change
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      // Check if these are YouTube results
      if (searchResults[0].isYouTube) {
        setSourceType('youtube');
      } else {
        setSourceType('local');
      }
    }
  }, [searchResults]);
  
  // Filter results based on active tab
  const filteredResults = searchResults?.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <SecondHeader title={`Search Results for: ${query}`} icon={<FaSearch />} />
      
      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 font-medium ${activeTab === 'video' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
        >
          Videos
        </button>
        <button 
          onClick={() => setActiveTab('article')}
          className={`px-4 py-2 font-medium ${activeTab === 'article' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
        >
          Articles
        </button>
      </div>
      
      {/* Source indicator */}
      {filteredResults?.length > 0 && sourceType === 'youtube' && (
        <div className="mb-6 flex items-center justify-center bg-red-50 py-2 rounded-lg">
          <FaYoutube className="text-red-600 mr-2 text-xl" />
          <p className="text-gray-700">Showing YouTube results for <span className="font-semibold">"{query}"</span></p>
        </div>
      )}
      
      {/* Results */}
      {isNonTech ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaSearch className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Non-Tech Content Not Available</h2>
          <p className="text-gray-600 text-lg">Your search for "{query}" appears to be non-tech related.</p>
          <p className="text-gray-500 mt-2">Tayusa is focused on technology content. Try searching for programming languages, frameworks, or other tech topics.</p>
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Popular tech searches:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'Python', 'JavaScript', 'Machine Learning', 'Web Development'].map(suggestion => (
                <Link 
                  key={suggestion} 
                  to={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="px-3 py-1 bg-white text-primary border border-primary rounded-full hover:bg-blue-50"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : filteredResults?.length > 0 ? (
        <div className="w-full">
          {/* YouTube-like search results */}
          {sourceType === 'youtube' && activeTab !== 'article' ? (
            <div className="flex flex-col space-y-4">
              {filteredResults
                .filter(item => item.type === 'video' || activeTab === 'all')
                .map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row border-b pb-4 last:border-b-0">
                    {/* Thumbnail with duration */}
                    <div className="relative flex-shrink-0 sm:w-64 w-full h-48 sm:h-36 mb-2 sm:mb-0 overflow-hidden">
                      <a 
                        href={item.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Video duration */}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                          {item.duration || '10:25'}
                        </div>
                      </a>
                    </div>
                    
                    {/* Video details */}
                    <div className="sm:ml-4 flex-grow">
                      <a 
                        href={item.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="font-medium text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                      </a>
                      
                      {/* Meta information */}
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <span>{item.views?.toLocaleString() || '1.2M'} views</span>
                        <span className="mx-1">•</span>
                        <span>{item.publishedAt || '3 months ago'}</span>
                      </div>
                      
                      {/* Channel information */}
                      <div className="flex items-center mt-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                          {item.user?.profilePicture ? (
                            <img 
                              src={item.user.profilePicture} 
                              alt={item.user.username} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-xs">
                              {item.user?.username?.[0] || 'Y'}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{item.user?.username || 'TechChannel'}</span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2 mt-2">{item.description}</p>
                      
                      {/* YouTube badge */}
                      <div className="flex items-center mt-2">
                        <FaYoutube className="text-red-600 mr-1" />
                        <span className="text-xs text-gray-500">YouTube</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map(item => {
                if (item.type === 'video') {
                  return item.isYouTube ? (
                    <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      <a 
                        href={item.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block relative"
                      >
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs flex items-center">
                          <FaYoutube className="mr-1" />
                          YouTube
                        </div>
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-lg line-clamp-2 mb-2 flex justify-between">
                            <span>{item.title}</span>
                            <FaExternalLinkAlt className="text-gray-400 text-sm mt-1 ml-2" />
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
                          <div className="flex justify-between text-gray-500 text-sm">
                            <span>{item.user.username}</span>
                            <span>{item.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <VideoCard key={item.id} video={item} />
                  );
                } else {
                  return <ArticleCard key={item.id} article={item} />;
                }
              })}
            </div>
          )}
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">No results found for "{query}"</p>
          <p className="text-gray-500 mt-2">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
}

export default Search;
