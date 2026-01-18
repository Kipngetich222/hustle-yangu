'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Heart, Share2, MoreVertical, Filter } from 'lucide-react'
import { getPosts, createPost } from '@/actions/posts'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Post {
  id: string
  title: string
  content: string
  mediaUrls: string[]
  category: string
  likes: number
  comments: number
  user: {
    name: string
    profile?: {
      bio: string
    }
  }
  createdAt: Date
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    mediaUrls: [] as string[]
  })

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getPosts(selectedCategory)
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async () => {
    try {
      await createPost(newPost)
      setShowCreateModal(false)
      setNewPost({
        title: '',
        content: '',
        category: '',
        mediaUrls: []
      })
      loadPosts()
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
      loadPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const categories = [
    'All',
    'Success Stories',
    'Tips & Advice',
    'Job Updates',
    'Community Help',
    'Showcase',
    'Questions'
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Community Hub
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with other hustlers, share experiences, ask questions, and support each other
        </p>
      </div>

      {/* Create Post Button */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 text-left p-3 border rounded-lg hover:bg-gray-50"
          >
            Share something with the community...
          </button>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Post
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to share something with the community
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Create First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card p-6">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">{post.user.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Media */}
              {post.mediaUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {post.mediaUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Footer */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                  >
                    <Heart className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <MessageSquare className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Comments Preview */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 input-field text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Create Post</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="What's your post about?"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Share your thoughts, experiences, or questions..."
                    rows={6}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Media (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-2">
                      Drag & drop images or videos here
                    </p>
                    <Button variant="outline">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>
                    Post to Community
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}