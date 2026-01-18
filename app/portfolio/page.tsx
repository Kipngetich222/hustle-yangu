'use client'

import { useState, useEffect } from 'react'
import { Camera, Edit, Trash2, Star, Eye, Download } from 'lucide-react'
import { getPortfolioItems, uploadPortfolioItem } from '@/actions/portfolio'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Image from 'next/image'

interface PortfolioItem {
  id: string
  title: string
  description: string
  mediaUrls: string[]
  category: string
  createdAt: Date
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    files: [] as File[]
  })

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      setIsLoading(true)
      const data = await getPortfolioItems()
      setItems(data)
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData({ ...formData, files: [...formData.files, ...files] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      await uploadPortfolioItem(formData)
      setShowUploadModal(false)
      setFormData({
        title: '',
        description: '',
        category: '',
        files: []
      })
      loadPortfolio()
    } catch (error) {
      console.error('Error uploading portfolio item:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`/api/portfolio/${itemId}`, {
          method: 'DELETE'
        })
        loadPortfolio()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const categories = [
    'All',
    'Cleaning',
    'Construction',
    'Delivery',
    'Gardening',
    'Repair',
    'Tutoring',
    'Other'
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600">Showcase your work to attract better opportunities</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Add Work
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{items.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600">4.8</div>
          <div className="text-sm text-gray-600">Avg. Rating</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">156</div>
          <div className="text-sm text-gray-600">Views</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">89%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              formData.category === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFormData({ ...formData, category })}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No portfolio items yet
          </h3>
          <p className="text-gray-600 mb-6">
            Showcase your work to attract better job opportunities
          </p>
          <Button onClick={() => setShowUploadModal(true)}>
            Add Your First Work
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              {/* Media Preview */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {item.mediaUrls[0] ? (
                  <Image
                    src={item.mediaUrls[0]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span>{item.mediaUrls.length} media</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add Portfolio Item</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., House Renovation, Garden Makeover"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the work you did, challenges faced, and results achieved..."
                    rows={3}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                    Upload Media (Photos/Videos)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop files or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block btn-secondary cursor-pointer"
                    >
                      Choose Files
                    </label>
                    {formData.files.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          {formData.files.length} file(s) selected
                        </p>
                        <ul className="text-sm text-gray-500 mt-2">
                          {formData.files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="btn-primary"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  <span className="text-sm text-gray-600">
                    {selectedItem.category} • {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Media Gallery */}
              {selectedItem.mediaUrls.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {selectedItem.mediaUrls.map((url, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`${selectedItem.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Feature This Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}