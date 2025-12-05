import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { 
  useTheme,
  EditIcon, PostIcon, SpinnerIcon, MaskIcon, UserIcon, 
  LocationIcon, CommentIcon, CloseIcon, REACTION_ICONS
} from '../ui';

const Feed = () => {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get('/posts', { params });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await api.post('/posts', {
        content: newPost,
        isAnonymous,
        displayName: isAnonymous ? displayName || 'Anonymous' : user?.nickname,
        type: 'general'
      });
      
      setPosts([response.data.post, ...posts]);
      setNewPost('');
      setDisplayName('');
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      await api.post(`/posts/${postId}/reaction`, { type });
      fetchPosts();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  // Reactions use the REACTION_ICONS from icons.jsx

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowCreatePost(true)}
        className="w-full p-4 rounded-xl mb-6 flex items-center gap-4 transition"
        style={{ background: theme.colorPalette.surface }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})` }}
        >
          <EditIcon size={20} color="#fff" />
        </div>
        <span style={{ color: theme.colorPalette.text.muted }}>Share something with the campus...</span>
      </motion.button>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'general', 'confession', 'question', 'meme'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full whitespace-nowrap transition"
            style={{
              background: filter === f 
                ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                : theme.colorPalette.surface,
              color: filter === f ? '#fff' : theme.colorPalette.text.secondary,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12">
          <SpinnerIcon size={40} color={theme.colorPalette.primary} />
          <p className="mt-2" style={{ color: theme.colorPalette.text.muted }}>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div 
          className="text-center py-12 rounded-xl"
          style={{ background: theme.colorPalette.surface }}
        >
          <PostIcon size={40} color={theme.colorPalette.text.muted} className="mx-auto mb-2" />
          <p style={{ color: theme.colorPalette.text.muted }}>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id || post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4"
              style={{ background: theme.colorPalette.surface }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})` }}
                >
                  {post.isAnonymous ? <MaskIcon size={20} color="#fff" /> : <UserIcon size={20} color="#fff" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: theme.colorPalette.text.primary }}>
                    {post.isAnonymous ? post.displayName || 'Anonymous' : post.author?.nickname || 'Unknown'}
                  </div>
                  <div className="text-sm flex items-center gap-2" style={{ color: theme.colorPalette.text.muted }}>
                    <span>{getTimeAgo(post.createdAt)}</span>
                    {post.location?.zoneName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <LocationIcon size={14} color={theme.colorPalette.text.muted} />
                          {post.location.zoneName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {post.type && post.type !== 'general' && (
                  <span 
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                      background: theme.colorPalette.primary + '20',
                      color: theme.colorPalette.primary,
                    }}
                  >
                    {post.type}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="mb-4 whitespace-pre-wrap" style={{ color: theme.colorPalette.text.primary }}>{post.content}</p>

              {/* Reactions */}
              <div className="flex items-center gap-2 flex-wrap">
                {REACTION_ICONS.map((reaction, idx) => {
                  const ReactionIcon = reaction.icon;
                  const count = (post.reactions || []).filter(r => r.type === reaction.label).length;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleReaction(post.id || post._id, reaction.label)}
                      className="px-3 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 hover:scale-105"
                      style={{
                        background: count > 0 ? theme.colorPalette.primary + '20' : theme.colorPalette.background,
                        color: count > 0 ? theme.colorPalette.primary : theme.colorPalette.text.muted,
                      }}
                      title={reaction.label}
                    >
                      <ReactionIcon size={16} color={count > 0 ? reaction.color : theme.colorPalette.text.muted} />
                      {count > 0 && <span>{count}</span>}
                    </button>
                  );
                })}
                <button 
                  className="px-3 py-1.5 rounded-full text-sm transition flex items-center gap-1.5"
                  style={{ 
                    background: theme.colorPalette.background,
                    color: theme.colorPalette.text.muted,
                  }}
                >
                  <CommentIcon size={16} color={theme.colorPalette.text.muted} />
                  {(post.comments || []).length}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="rounded-2xl p-6 max-w-lg w-full"
              style={{ background: theme.colorPalette.surface }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: theme.colorPalette.text.primary }}>Create Post</h2>
                <button 
                  onClick={() => setShowCreatePost(false)}
                  style={{ color: theme.colorPalette.text.muted }}
                  className="hover:opacity-70 p-1"
                >
                  <CloseIcon size={20} color={theme.colorPalette.text.muted} />
                </button>
              </div>

              <form onSubmit={handleCreatePost}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-4 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 mb-4"
                  style={{ 
                    background: theme.colorPalette.background,
                    color: theme.colorPalette.text.primary,
                    borderColor: theme.colorPalette.primary,
                  }}
                  autoFocus
                />

                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: theme.colorPalette.primary }}
                    />
                    <span style={{ color: theme.colorPalette.text.muted }}>Post anonymously</span>
                    <MaskIcon size={20} color={theme.colorPalette.text.muted} />
                  </label>
                </div>

                {isAnonymous && (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Anonymous display name (optional)"
                    className="w-full p-3 rounded-xl mb-4 focus:outline-none focus:ring-2"
                    style={{ 
                      background: theme.colorPalette.background,
                      color: theme.colorPalette.text.primary,
                      borderColor: theme.colorPalette.primary,
                    }}
                  />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="flex-1 py-3 rounded-xl font-semibold transition"
                    style={{ 
                      background: theme.colorPalette.background,
                      color: theme.colorPalette.text.secondary,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="flex-1 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`,
                      color: '#fff',
                    }}
                  >
                    Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
