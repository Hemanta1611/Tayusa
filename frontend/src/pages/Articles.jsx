import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../store/slices/contentSlice';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

function Articles() {
  const dispatch = useDispatch();
  const { items: articles, loading, error, currentPage, totalPages } = useSelector(state => state.content.articles);
  const [selectedTag, setSelectedTag] = useState('all');
  
  const tags = ['all', 'technology', 'science', 'education', 'lifestyle'];
  
  useEffect(() => {
    const params = {
      page: 1,
      limit: 10,
      tags: selectedTag === 'all' ? undefined : selectedTag
    };
    
    dispatch(getArticles(params));
  }, [dispatch, selectedTag]);
  
  const handleTagChange = (tag) => {
    setSelectedTag(tag);
  };
  
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const params = {
        page: currentPage + 1,
        limit: 10,
        tags: selectedTag === 'all' ? undefined : selectedTag
      };
      
      dispatch(getArticles(params));
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      
      {/* Tags Filter */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagChange(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedTag === tag
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
      
      {loading && articles.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-md text-center">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-gray-600">
            {selectedTag !== 'all'
              ? `No articles found with the tag "${selectedTag}". Try another tag or check back later.`
              : 'No articles have been published yet. Check back later.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
          
          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-md transition duration-300 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <LoadingSpinner size="small" />
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Articles;
