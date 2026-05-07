import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, MoreHorizontal, Calendar, Star, X } from 'lucide-react';
import './CommunityPage.css';

const CommunityPage = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostData, setNewPostData] = useState({ content: '' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPosts();
    if (userId) fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentUser({
          displayName: data.profile?.displayName || "User",
          company: data.businessProfile?.companyName || "",
          isSme: data.roleId === 1
        });
      }
    } catch (error) { console.error("Error fetching user:", error); }
  };

  const fetchPosts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/posts');
      if (response.ok) {
        const data = await response.json();
        const postsWithComments = await Promise.all(data.map(async (post) => {
          try {
            const commRes = await fetch(`http://localhost:8080/api/comments/post/${post.id}`);
            const commData = commRes.ok ? await commRes.json() : [];
            return { ...post, commentsList: commData };
          } catch (e) {
            return { ...post, commentsList: [] };
          }
        }));
        setPosts(postsWithComments);
        // If comment modal is open, update the selected post with new comments
        if (selectedPost) {
          const updatedSelected = postsWithComments.find(p => p.id === selectedPost.id);
          if (updatedSelected) setSelectedPost(updatedSelected);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const openCommentModal = async (post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
    console.log("Opening modal for post:", post.id);
    // Fetch latest comments for this specific post to ensure it's fresh
    try {
      const response = await fetch(`http://localhost:8080/api/comments/post/${post.id}`);
      if (response.ok) {
        const commData = await response.json();
        console.log("Fetched comments for modal:", commData);
        setSelectedPost(prev => ({ ...prev, commentsList: commData }));
        // Also update the main posts list
        setPosts(prevPosts => prevPosts.map(p => 
          p.id === post.id ? { ...p, commentsList: commData } : p
        ));
      } else {
        console.error("Failed to fetch comments for modal. Status:", response.status);
      }
    } catch (error) { console.error("Error refreshing comments:", error); }
  };

  const closeDropdowns = () => setOpenDropdownId(null);

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) { fetchPosts(true); setOpenDropdownId(null); }
      } catch (error) { console.error(error); }
    }
  };

  const handleLikePost = async (id) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
    try {
      await fetch(`http://localhost:8080/api/posts/${id}/like`, { method: 'POST' });
    } catch (error) { fetchPosts(true); }
  };

  const handlePostComment = async (postId, content) => {
    if (!content.trim()) return;
    if (!userId) {
      alert("Please log in to post a comment.");
      return;
    }

    try {
      // Optimistic Update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          const newCommentObj = {
            id: Date.now(),
            author: currentUser?.displayName || "You",
            company: currentUser?.company || "",
            content: content,
            date: "Just now",
            isSme: currentUser?.isSme || false
          };
          const updatedPost = {
            ...post,
            commentsList: [...(post.commentsList || []), newCommentObj],
            comments: (post.comments || 0) + 1
          };
          if (selectedPost?.id === postId) setSelectedPost(updatedPost);
          return updatedPost;
        }
        return post;
      }));

      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId,
          userId: parseInt(userId),
          content: content
        })
      });

      if (response.ok) {
        fetchPosts(true);
      } else {
        const errText = await response.text();
        alert("Failed to post comment: " + errText);
        fetchPosts(true); // Rollback optimistic UI
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      fetchPosts(true);
    }
  };

  return (
    <div className="community-layout">
      <main className="community-main">
        <header className="page-header community-header">
          <div className="header-text">
            <h1>Community Feed</h1>
            <p className="subtitle">Share experiences and connect with other SMEs</p>
          </div>
          <button className="create-post-btn" onClick={() => setIsCreateModalOpen(true)}>
            Create Post
          </button>
        </header>

        <div className="feed-container" onClick={closeDropdowns}>
          {loading ? (
            <div className="status-message">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="status-message">No posts yet.</div>
          ) : (
            posts.map((post) => (
                <article key={post.id} className="post-wrapper">
                  <div className="post-header">
                    <div className="post-author-info">
                      <div className="author-avatar">
                        {post.avatar ? (
                          <img src={post.avatar} alt={post.author} className="avatar-img" />
                        ) : (
                          (post.author || "?").charAt(0)
                        )}
                      </div>
                      <div className="author-details">
                        <div className="author-name">{post.author}</div>
                        <div className="author-meta">
                          <span className="meta-item">
                            <Star size={14} /> {post.isSme ? (post.company || 'Entrepreneur') : 'Customer'}
                          </span>
                          <span className="meta-divider">|</span>
                          <span className="meta-item">
                            <Calendar size={14} /> {post.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="post-options-container" onClick={(e) => e.stopPropagation()}>
                      <button className="post-options-btn" onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)}>
                        <MoreHorizontal size={20} />
                      </button>
                      {openDropdownId === post.id && (
                        <div className="post-dropdown">
                          <button className="dropdown-item delete-item" onClick={() => handleDeletePost(post.id)}>Delete Post</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div className="post-footer">
                    <button className="interaction-btn" onClick={() => handleLikePost(post.id)}>
                      <Heart size={18} className={post.likes > 0 ? "active-heart" : ""} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="interaction-btn" onClick={() => openCommentModal(post)}>
                      <MessageSquare size={18} />
                      <span>{post.comments}</span>
                    </button>
                  </div>

                  <div className="comments-display-section">
                    {post.commentsList && post.commentsList.slice(-2).map(comment => (
                      <div key={comment.id} className="comment-list-item">
                        <div className="comment-item-avatar">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt={comment.author} className="avatar-img" />
                          ) : (
                            (comment.author || "?").charAt(0)
                          )}
                        </div>
                        <div className="comment-item-content">
                          <div className="comment-item-header">
                            {comment.author} | {comment.isSme ? (comment.company || 'Entrepreneur') : 'Customer'}
                          </div>
                          <p className="comment-item-text">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Integrated Comment Input Bar */}
                  <div className="inline-comment-section">
                    <div className="inline-comment-input">
                      <textarea 
                        id={`inline-comment-${post.id}`}
                        placeholder="Write a comment..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handlePostComment(post.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      ></textarea>
                      <button className="btn-primary" onClick={() => {
                        const textarea = document.getElementById(`inline-comment-${post.id}`);
                        handlePostComment(post.id, textarea.value);
                        textarea.value = '';
                      }}>Post</button>
                    </div>
                  </div>
                </article>
            ))
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Post</h3>
              <button className="close-modal-btn" onClick={() => setIsCreateModalOpen(false)}><X /></button>
            </div>
            <textarea
              rows="4"
              placeholder="What's on your mind?"
              value={newPostData.content}
              onChange={(e) => setNewPostData({ content: e.target.value })}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
              <button className="create-post-btn" onClick={async () => {
                if (!newPostData.content) return;
                try {
                  const response = await fetch('http://localhost:8080/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: parseInt(userId), content: newPostData.content })
                  });
                  if (response.ok) { fetchPosts(); setIsCreateModalOpen(false); setNewPostData({ content: '' }); }
                } catch (error) { console.error(error); }
              }}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {isCommentModalOpen && selectedPost && (
        <div className="modal-overlay" onClick={() => setIsCommentModalOpen(false)}>
          <div className="modal-content comment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post by {selectedPost.author}</h3>
              <button className="close-modal-btn" onClick={() => setIsCommentModalOpen(false)}><X /></button>
            </div>
            
            <div className="modal-post-content">
              <p>{selectedPost.content}</p>
            </div>

            <div className="modal-comments-list">
              {selectedPost.commentsList && selectedPost.commentsList.map(comment => (
                <div key={comment.id} className="comment-list-item">
                  <div className="comment-item-avatar">
                    {comment.avatar ? (
                      <img src={comment.avatar} alt={comment.author} className="avatar-img" />
                    ) : (
                      (comment.author || "?").charAt(0)
                    )}
                  </div>
                  <div className="comment-item-content">
                    <div className="comment-item-header">
                      {comment.author} | {comment.isSme ? (comment.company || 'Entrepreneur') : 'Customer'}
                    </div>
                    <p className="comment-item-text">{comment.content}</p>
                  </div>
                </div>
              ))}
              {(!selectedPost.commentsList || selectedPost.commentsList.length === 0) && (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>

            <div className="modal-comment-input">
               <div className="inline-comment-input">
                  <textarea 
                    id="modal-comment-input-field"
                    placeholder="Write a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePostComment(selectedPost.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  ></textarea>
                  <button className="btn-primary" onClick={() => {
                    const textarea = document.getElementById('modal-comment-input-field');
                    handlePostComment(selectedPost.id, textarea.value);
                    textarea.value = '';
                  }}>Post</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
