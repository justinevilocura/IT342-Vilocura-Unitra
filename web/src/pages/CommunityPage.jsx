import React, { useState } from 'react';
import { Heart, MessageSquare, MoreHorizontal, Calendar, Star, ExternalLink, Plus } from 'lucide-react';
import './CommunityPage.css';

const CommunityPage = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Marcus Thompson',
      company: 'FoodTech Innovations',
      date: '2/28/2026',
      content: 'Successfully traded our old packaging equipment for restaurant-grade kitchen appliances. This barter system is perfect for SMEs looking to optimize resources without cash flow issues!',
      hasImage: false,
      likes: 45,
      comments: 1,
      linkText: '',
      commentsList: [
        {
          id: 101,
          author: 'Gordon Ramsay',
          company: 'RestaurantSupply Direct',
          content: 'Love seeing successful trades! We have more equipment available if anyone needs.'
        }
      ]
    }
  ]);

  // Close dropdown when clicking outside
  const closeDropdowns = () => setOpenDropdownId(null);

  return (
    <div className="community-layout">
      {/* Background elements */}
      <div className="mesh-gradient mesh-1" style={{ opacity: 0.15 }}></div>
      <div className="mesh-gradient mesh-3" style={{ opacity: 0.1 }}></div>

      <main className="community-main">
        <header className="page-header community-header">
          <div className="header-text">
            <h1>Community Feed</h1>
            <p className="subtitle">Share experiences and connect with other SMEs</p>
          </div>
          <button className="btn-primary create-post-btn">
            Create Post
          </button>
        </header>

        <div className="feed-container" onClick={closeDropdowns}>
          {posts.map((post) => (
            <article key={post.id} className="post-wrapper">
              <div className="post-card glass-panel">
              <div className="post-header">
                <div className="post-author-info">
                  <div className="author-avatar">
                    <span className="avatar-initial">{post.author.charAt(0)}</span>
                  </div>
                  <div className="author-details">
                    <div className="author-name">{post.author}</div>
                    <div className="author-meta">
                      <span className="meta-item"><Star size={12} /> {post.company}</span>
                      <span className="meta-divider">|</span>
                      <span className="meta-item"><Calendar size={12} /> {post.date}</span>
                    </div>
                  </div>
                </div>
                <div className="post-options-container" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="post-options-btn"
                    onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {openDropdownId === post.id && (
                    <div className="post-dropdown glass-panel">
                      <button className="dropdown-item">Edit Post</button>
                      <button className="dropdown-item">Delete Post</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.hasImage && (
                  <div className="post-image-placeholder">
                    <span>img</span>
                  </div>
                )}
              </div>

              {post.linkText && (
                <div className="post-link">
                  <ExternalLink size={14} />
                  <span>{post.linkText}</span>
                </div>
              )}

              <div className="post-footer">
                <div className="interaction-group">
                  <button className="interaction-btn">
                    <Heart size={18} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="interaction-btn">
                    <MessageSquare size={18} />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
              </div>

              {/* Attached Comments Section */}
              <div className="post-comments-section">
                <div className="comment-list">
                  {post.commentsList && post.commentsList.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-author-info">
                         <div className="avatar-initial small-initial">{comment.author.charAt(0)}</div>
                         <span className="comment-author-name">{comment.author}</span>
                         <span className="meta-divider">|</span>
                         <span className="comment-company">{comment.company}</span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  ))}
                </div>
                <div className="comment-input-area">
                  <textarea className="comment-textarea" placeholder="Add comment..."></textarea>
                  <button className="btn-primary post-comment-btn">Post</button>
                </div>
              </div>

            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
