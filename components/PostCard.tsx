// components/postcard.tsx
'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  category: string;
  likes: number;
  comments: number;
  isPromoted: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    profile?: {
      bio?: string;
      skills?: string[];
    };
  };
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [comment, setComment] = useState('');

  const maxContentLength = 300;
  const needsTruncation = post.content.length > maxContentLength && !showFullContent;
  const displayContent = needsTruncation 
    ? post.content.substring(0, maxContentLength) + '...' 
    : post.content;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real app, submit comment to API
      console.log('Comment submitted:', comment);
      setComment('');
      onComment?.(post.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    onShare?.(post.id);
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user.avatar}
              fallback={post.user.name}
              size="md"
            />
            <div>
              <h4 className="font-semibold">{post.user.name}</h4>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                {post.isPromoted && (
                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
                    Promoted
                  </span>
                )}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">
            {displayContent}
            {needsTruncation && (
              <button
                onClick={() => setShowFullContent(true)}
                className="text-blue-600 hover:text-blue-800 ml-2 font-medium"
              >
                Read more
              </button>
            )}
            {showFullContent && (
              <button
                onClick={() => setShowFullContent(false)}
                className="text-blue-600 hover:text-blue-800 ml-2 font-medium"
              >
                Show less
              </button>
            )}
          </p>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {post.category}
          </span>
        </div>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              {post.mediaUrls.slice(0, 4).map((url, index) => (
                <div
                  key={index}
                  className={`${
                    post.mediaUrls!.length === 1
                      ? 'col-span-2 aspect-video'
                      : 'aspect-square'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 3 && post.mediaUrls!.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                      +{post.mediaUrls!.length - 4} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex gap-4">
            <span>{post.likes + (isLiked ? 1 : 0)} likes</span>
            <span>{post.comments} comments</span>
            <span>2 shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex border-t border-b py-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-600 hover:bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">Like</span>
          </button>
          <button
            onClick={() => onComment?.(post.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Comment</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share</span>
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="font-medium">Save</span>
          </button>
        </div>

        {/* Comment Input */}
        <div className="mt-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Avatar
              src={post.user.avatar}
              fallback={post.user.name}
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </form>
        </div>

        {/* Recent Comments */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2">
            <Avatar
              src={post.user.avatar}
              fallback="J"
              size="sm"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-sm">John Doe</span>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="text-sm">Great post! Very helpful information.</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all {post.comments} comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}