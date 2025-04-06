import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { FaHeart, FaRegHeart, FaThumbsDown, FaRegThumbsDown, FaBookmark, FaRegBookmark, FaShare, FaEye } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import VideoCard from '../components/VideoCard';
import SecondHeader from '../components/SecondHeader';
import FollowedCreators from '../components/FollowedCreators';

function VideoPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('forYou');
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    disliked: false,
    saved: false
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // In a real app, replace with actual API call
        // const response = await axios.get(`/api/content/videos/${id}`);
        // setVideo(response.data.data);
        
        // Mock data for development
        setTimeout(() => {
          setVideo({
            _id: id,
            title: 'Comprehensive React Hooks Tutorial',
            description: 'Learn all about React Hooks including useState, useEffect, useContext, useRef, and custom hooks. This tutorial covers common patterns and best practices for using hooks in your React applications.',
            videoUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
            thumbnailUrl: 'https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg',
            user: {
              _id: 'user123',
              username: 'ReactMaster',
              profilePicture: ''
            },
            views: 15243,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 1240,
            likes: ['user1', 'user2', 'user3'],
            dislikes: ['user4'],
            techTags: ['react', 'javascript', 'web development', 'hooks']
          });
          setLoading(false);
        }, 1000);
        
        // In a real app, fetch related videos and comments
        setTimeout(() => {
          setRelatedVideos([
            {
              _id: 'related1',
              title: 'Building a Complete React Application',
              thumbnailUrl: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',
              user: { username: 'ReactMaster', profilePicture: '' },
              views: 8790,
              createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 980
            },
            {
              _id: 'related2',
              title: 'React Performance Optimization Techniques',
              thumbnailUrl: 'https://i.ytimg.com/vi/YQiHumF1kLo/maxresdefault.jpg',
              user: { username: 'JSNinja', profilePicture: '' },
              views: 6423,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 760
            },
            {
              _id: 'related3',
              title: 'State Management in React with Context and Reducers',
              thumbnailUrl: 'https://i.ytimg.com/vi/35lXWvCuM8o/maxresdefault.jpg',
              user: { username: 'DevGenius', profilePicture: '' },
              views: 4213,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              duration: 635
            }
          ]);
          
          setComments([
            {
              _id: 'comment1',
              user: { _id: 'user324', username: 'TechLearner', profilePicture: '' },
              content: 'This was incredibly helpful! I\'ve been struggling with useEffect dependencies but now it makes sense.',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              likes: ['user1', 'user2']
            },
            {
              _id: 'comment2',
              user: { _id: 'user456', username: 'CodeEnthusiast', profilePicture: '' },
              content: 'Great explanation of custom hooks! Would love to see a follow-up on more advanced patterns.',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              likes: ['user3']
            }
          ]);
        }, 1500);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video. Please try again.');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like videos');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      liked: !prev.liked,
      disliked: false
    }));
    
    // In a real app, call API to update like status
    // axios.put(`/api/content/videos/${id}/like`);
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      alert('Please login to dislike videos');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      disliked: !prev.disliked,
      liked: false
    }));
    
    // In a real app, call API to update dislike status
    // axios.put(`/api/content/videos/${id}/dislike`);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      alert('Please login to save videos');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      saved: !prev.saved
    }));
    
    // In a real app, call API to update save status
    // axios.put(`/api/users/saved`, { contentType: 'video', contentId: id });
  };

  const handleShare = () => {
    // Copy video URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Could not copy link: ', err));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    
    if (!commentText.trim()) return;
    
    // In a real app, call API to post comment
    // axios.post(`/api/content/videos/${id}/comments`, { content: commentText });
    
    // For now, add comment locally
    const newComment = {
      _id: `temp-${Date.now()}`,
      user: {
        _id: user?._id || 'currentUser',
        username: user?.username || 'You',
        profilePicture: user?.profilePicture || ''
      },
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  return (
    <div className="video-page bg-gray-50 min-h-screen">
      {/* Second Header for For You / Following tabs */}
      <SecondHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'following' ? (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-lg shadow p-4">
            <FollowedCreators />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main content */}
              <div className="lg:w-8/12">
                {/* Video player */}
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <div className="aspect-video">
                    <ReactPlayer
                      url={video.videoUrl || 'https://www.youtube.com/watch?v=TNhaISOUy6Q'}
                      width="100%"
                      height="100%"
                      controls
                      playing
                    />
                  </div>
                </div>
                
                {/* Video info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                        {video.user?.profilePicture ? (
                          <img src={video.user.profilePicture} alt={video.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
                            {video.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          to={`/profile/${video.user?._id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {video.user?.username || 'Anonymous'}
                        </Link>
                        <p className="text-sm text-gray-500">
                          <FaEye className="inline mr-1" /> {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button 
                        onClick={handleLike}
                        className={`flex items-center ${userInteractions.liked ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                      >
                        {userInteractions.liked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
                        <span>{video.likes?.length || 0}</span>
                      </button>
                      <button 
                        onClick={handleDislike}
                        className={`flex items-center ${userInteractions.disliked ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                      >
                        {userInteractions.disliked ? <FaThumbsDown className="mr-1" /> : <FaRegThumbsDown className="mr-1" />}
                        <span>{video.dislikes?.length || 0}</span>
                      </button>
                      <button 
                        onClick={handleSave}
                        className={`flex items-center ${userInteractions.saved ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                      >
                        {userInteractions.saved ? <FaBookmark className="mr-1" /> : <FaRegBookmark className="mr-1" />}
                        <span>Save</span>
                      </button>
                      <button 
                        onClick={handleShare}
                        className="flex items-center text-gray-700 hover:text-primary"
                      >
                        <FaShare className="mr-1" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {video.techTags && video.techTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 mb-3">
                      {video.techTags.map((tag, index) => (
                        <Link 
                          key={index} 
                          to={`/search?tag=${tag}`}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-line">{video.description}</p>
                  </div>
                </div>
                
                {/* Comments section */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
                  
                  {isAuthenticated && (
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <div className="flex">
                        <div className="mr-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                            {user?.profilePicture ? (
                              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows="2"
                          ></textarea>
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setCommentText('')}
                              className="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!commentText.trim()}
                              className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                  
                  {/* Comments list */}
                  <div className="space-y-6">
                    {comments.map(comment => (
                      <div key={comment._id} className="flex">
                        <div className="mr-3">
                          <Link to={`/profile/${comment.user?._id}`}>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              {comment.user?.profilePicture ? (
                                <img src={comment.user.profilePicture} alt={comment.user.username} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
                                  {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <Link 
                              to={`/profile/${comment.user?._id}`}
                              className="font-medium mr-2 hover:text-primary transition-colors"
                            >
                              {comment.user?.username || 'Anonymous'}
                            </Link>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <button className="flex items-center mr-4 hover:text-primary">
                              <FaRegHeart className="mr-1" />
                              <span>{comment.likes?.length || 0}</span>
                            </button>
                            <button className="hover:text-primary">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <p className="text-center text-gray-500 py-6">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sidebar - Related videos */}
              <div className="lg:w-4/12">
                <h2 className="text-xl font-bold mb-4">Related Videos</h2>
                <div className="space-y-4">
                  {relatedVideos.map(video => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoPage;
