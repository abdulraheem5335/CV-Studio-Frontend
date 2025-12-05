import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../../store/chatStore';
import { useTheme } from '../../ui/ThemeProvider';

const ChatOverlay = ({ isOpen, onToggle }) => {
  const { theme } = useTheme();
  // Map colorPalette to simpler color names
  const colors = {
    surface: theme?.colorPalette?.surface || '#1F2937',
    background: theme?.colorPalette?.background || '#111827',
    border: theme?.colorPalette?.border || '#374151',
    shadow: theme?.colorPalette?.shadow || 'rgba(0,0,0,0.3)',
    text: theme?.colorPalette?.text?.primary || '#F9FAFB',
    textMuted: theme?.colorPalette?.text?.muted || '#9CA3AF',
    primary: theme?.colorPalette?.primary || '#3B82F6',
    buttonText: '#FFFFFF',
  };
  const { messages, nearbyPlayers, sendMessage, isConnected } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && isConnected) {
      sendMessage(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    // Prevent game controls from triggering
    e.stopPropagation();
  };

  const nearbyCount = nearbyPlayers?.size || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-80 z-50 flex flex-col"
          style={{
            background: `linear-gradient(180deg, ${colors.surface}F0 0%, ${colors.background}F5 100%)`,
            borderLeft: `1px solid ${colors.border}`,
            boxShadow: `-4px 0 20px ${colors.shadow}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: isConnected ? '#22C55E' : '#EF4444',
                }}
              />
              <div>
                <h3
                  className="font-bold text-sm"
                  style={{ color: colors.text }}
                >
                  Proximity Chat
                </h3>
                <p
                  className="text-xs"
                  style={{ color: colors.textMuted }}
                >
                  {nearbyCount} player{nearbyCount !== 1 ? 's' : ''} nearby
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg transition-colors hover:opacity-80"
              style={{ backgroundColor: colors.surface }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke={colors.textMuted}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nearby Players List */}
          {nearbyCount > 0 && (
            <div
              className="px-4 py-2 border-b"
              style={{ borderColor: colors.border }}
            >
              <p
                className="text-xs mb-2"
                style={{ color: colors.textMuted }}
              >
                Players in range:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(nearbyPlayers.values()).map((player) => (
                  <div
                    key={player.socketId}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: player.avatar?.color || colors.primary,
                      color: '#FFFFFF',
                    }}
                  >
                    <span className="font-medium">{player.nickname}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div
                className="text-center py-8"
                style={{ color: colors.textMuted }}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">
                  Walk near other players to chat!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  colors={colors}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <div
              className="flex gap-2 rounded-xl p-1"
              style={{ backgroundColor: colors.background }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  nearbyCount > 0
                    ? 'Type a message...'
                    : 'No players nearby...'
                }
                disabled={nearbyCount === 0 || !isConnected}
                maxLength={200}
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                style={{ color: colors.text }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || nearbyCount === 0 || !isConnected}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.buttonText || '#FFFFFF',
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            {nearbyCount === 0 && (
              <p
                className="text-xs mt-2 text-center"
                style={{ color: colors.textMuted }}
              >
                Move closer to other players to send messages
              </p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, colors }) => {
  const isOwn = message.isOwn;
  const timeAgo = getTimeAgo(message.timestamp);
  // Backend sends: senderName, senderAvatar, message (text)
  const nickname = message.senderName || message.nickname || 'Unknown';
  const avatar = message.senderAvatar || message.avatar;
  const text = message.message || message.text || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
    >
      {!isOwn && (
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              backgroundColor: avatar?.color || colors.primary,
            }}
          >
            {nickname?.[0]?.toUpperCase() || '?'}
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: colors.textMuted }}
          >
            {nickname}
          </span>
        </div>
      )}
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl ${
          isOwn ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          backgroundColor: isOwn ? colors.primary : colors.surface,
          color: isOwn ? colors.buttonText || '#FFFFFF' : colors.text,
        }}
      >
        <p className="text-sm break-words">{text}</p>
      </div>
      <span
        className="text-xs mt-1 px-1"
        style={{ color: colors.textMuted }}
      >
        {timeAgo}
      </span>
    </motion.div>
  );
};

// Helper function for time ago
function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return 'Yesterday';
}

export default ChatOverlay;
