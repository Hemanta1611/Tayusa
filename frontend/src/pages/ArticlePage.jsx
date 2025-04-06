import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShare, FaEye, FaClock, FaComment } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import ArticleCard from '../components/ArticleCard';
import SecondHeader from '../components/SecondHeader';
import FollowedCreators from '../components/FollowedCreators';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

function ArticlePage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('forYou');
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    saved: false
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // In a real app, replace with actual API call
        // const response = await axios.get(`/api/content/articles/${id}`);
        // setArticle(response.data.data);
        
        // Mock data for development
        setTimeout(() => {
          setArticle({
            _id: id,
            title: 'Building Modern Web Applications with React and TypeScript',
            content: `
# Building Modern Web Applications with React and TypeScript

In today's web development landscape, creating type-safe applications has become increasingly important. React, combined with TypeScript, offers a powerful solution for building robust web applications.

## Why TypeScript with React?

TypeScript adds static typing to JavaScript, which helps catch errors during development rather than at runtime. When used with React, it provides several benefits:

- **Better developer experience**: Autocompletion and inline documentation
- **Safer refactoring**: TypeScript catches type errors when making changes
- **Self-documenting code**: Types serve as documentation

## Getting Started

First, let's create a new React TypeScript project:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Creating Type-Safe Components

Here's an example of a simple typed component:

\`\`\`tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
\`\`\`

## Working with State

TypeScript makes React's useState hook more powerful:

\`\`\`tsx
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchUser(1).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

## Conclusion

Using TypeScript with React allows you to build more robust applications with fewer runtime errors. The initial setup might require more effort, but the long-term benefits in maintainability and developer experience make it worthwhile.

Remember to keep your types focused and don't over-engineer them. TypeScript is meant to help you, not get in your way!
            `,
            coverImageUrl: 'https://miro.medium.com/max/1400/1*-hxhCUQzz9t_7C7xmNG3zQ.png',
            user: {
              _id: 'user123',
              username: 'ReactMaster',
              profilePicture: ''
            },
            views: 6835,
            likes: ['user1', 'user2', 'user3', 'user4'],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            readTime: 5,
            techTags: ['react', 'typescript', 'web development']
          });
          setLoading(false);
        }, 1000);
        
        // In a real app, fetch related articles and comments
        setTimeout(() => {
          setRelatedArticles([
            {
              _id: 'article1',
              title: 'Understanding React Hooks in Depth',
              content: 'React Hooks provide a way to use state and other React features without writing a class...',
              coverImageUrl: 'https://miro.medium.com/max/1400/1*-ojFAc3Y2T1stcyK0yVm8g.png',
              user: { username: 'ReactMaster', profilePicture: '' },
              views: 3245,
              likes: ['user1', 'user2'],
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: 8,
              techTags: ['react', 'javascript', 'hooks']
            },
            {
              _id: 'article2',
              title: 'TypeScript for JavaScript Developers',
              content: 'TypeScript adds optional static typing to JavaScript, making it easier to develop and maintain large applications...',
              coverImageUrl: 'https://miro.medium.com/max/1400/1*2Y5MWO9xC7cwqQi9MKC8Vw.png',
              user: { username: 'TypeScriptGuru', profilePicture: '' },
              views: 4120,
              likes: ['user3', 'user4', 'user5'],
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              readTime: 6,
              techTags: ['typescript', 'javascript']
            }
          ]);
          
          setComments([
            {
              _id: 'comment1',
              user: { _id: 'user456', username: 'TechLearner', profilePicture: '' },
              content: 'Great article! I\'ve been using TypeScript with React for a year now and it has significantly improved my development experience.',
              createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
              likes: ['user1']
            },
            {
              _id: 'comment2',
              user: { _id: 'user789', username: 'WebDevJunkie', profilePicture: '' },
              content: 'I would love to see a follow-up article about testing TypeScript React components!',
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              likes: []
            }
          ]);
        }, 1500);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again.');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // Initialize Prism for syntax highlighting
  useEffect(() => {
    if (article && !loading) {
      Prism.highlightAll();
    }
  }, [article, loading]);

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like articles');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      liked: !prev.liked
    }));
    
    // In a real app, call API to update like status
    // axios.put(`/api/content/articles/${id}/like`);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      alert('Please login to save articles');
      return;
    }
    
    setUserInteractions(prev => ({
      ...prev,
      saved: !prev.saved
    }));
    
    // In a real app, call API to update save status
    // axios.put(`/api/users/saved`, { contentType: 'article', contentId: id });
  };

  const handleShare = () => {
    // Copy article URL to clipboard
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
    // axios.post(`/api/content/articles/${id}/comments`, { content: commentText });
    
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

  // Convert markdown content to HTML with syntax highlighting
  const renderMarkdown = (content) => {
    if (!content) return '';
    
    // Simple markdown parser (in a real app, use a library like marked)
    let html = content
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => 
        `<pre><code class="language-${language || 'text'}">${code.trim()}</code></pre>`
      )
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-pink-600">$1</code>')
      // Paragraphs
      .replace(/^([^<].*)\n$/gm, '<p class="my-3 leading-relaxed">$1</p>');
    
    return html;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-700 mb-4">Article not found</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="article-page bg-gray-50 min-h-screen">
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-9/12">
              {/* Article header */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                {article.coverImageUrl && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={article.coverImageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                  
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                        {article.user?.profilePicture ? (
                          <img src={article.user.profilePicture} alt={article.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-medium">
                            {article.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          to={`/profile/${article.user?._id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {article.user?.username || 'Anonymous'}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center mr-3">
                            <FaEye className="mr-1" /> {article.views || 0} views
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1" /> {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button 
                        onClick={handleLike}
                        className={`flex items-center ${userInteractions.liked ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                      >
                        {userInteractions.liked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
                        <span>{article.likes?.length || 0}</span>
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
                  {article.techTags && article.techTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.techTags.map((tag, index) => (
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
                </div>
              </div>
              
              {/* Article content */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="p-6">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                  />
                </div>
              </div>
              
              {/* Comments section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <FaComment className="mr-2" /> {comments.length} Comments
                  </h2>
                  
                  {isAuthenticated && (
                    <form onSubmit={handleCommentSubmit} className="mb-8">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows="3"
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
            </div>
            
            {/* Sidebar - Related articles */}
            <div className="lg:w-3/12">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="space-y-4">
                {relatedArticles.map(article => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticlePage;
