import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SecondHeader from '../components/SecondHeader';
import { searchContent } from '../store/slices/contentSlice';

function Search() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, searchResults } = useSelector(state => state.content);
  const [activeTab, setActiveTab] = useState('all');
  
  // Get search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';
  
  useEffect(() => {
    if (query) {
      dispatch(searchContent(query));
    }
  }, [dispatch, query]);
  
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
      
      {/* Results */}
      {filteredResults?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(item => (
            item.type === 'video' ? (
              <VideoCard key={item.id} video={item} />
            ) : (
              <ArticleCard key={item.id} article={item} />
            )
          ))}
        </div>
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
