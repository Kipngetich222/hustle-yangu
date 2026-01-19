// components/portfoliogrid.tsx
'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, Image, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrls: string[];
  category: string;
  createdAt: string;
}

interface PortfolioGridProps {
  portfolio?: PortfolioItem[];
  editable?: boolean;
}

export default function PortfolioGrid({ portfolio = [], editable = false }: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample portfolio items if none provided
  const samplePortfolio: PortfolioItem[] = [
    {
      id: '1',
      title: 'House Renovation',
      description: 'Complete kitchen and bathroom renovation project',
      mediaUrls: ['/api/placeholder/400/300'],
      category: 'Construction',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Landscape Design',
      description: 'Garden design and maintenance for residential property',
      mediaUrls: ['/api/placeholder/400/300'],
      category: 'Gardening',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Office Cleaning',
      description: 'Commercial office space deep cleaning service',
      mediaUrls: ['/api/placeholder/400/300'],
      category: 'Cleaning',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '4',
      title: 'Event Setup',
      description: 'Wedding venue decoration and setup',
      mediaUrls: ['/api/placeholder/400/300'],
      category: 'Event Staff',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  const displayPortfolio = portfolio.length > 0 ? portfolio : samplePortfolio;

  const getMediaIcon = (mediaUrl: string) => {
    if (mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="h-5 w-5" />;
    } else if (mediaUrl.match(/\.(mp4|mov|avi|webm)$/i)) {
      return <Video className="h-5 w-5" />;
    } else {
      return <FileText className="h-5 w-5" />;
    }
  };

  const handleViewDetails = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <>
      {displayPortfolio.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Portfolio Items Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Showcase your work to attract more clients
          </p>
          {editable && (
            <Button>
              Add Your First Portfolio Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPortfolio.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-shadow"
            >
              {/* Media Preview */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {item.mediaUrls[0] ? (
                  <img
                    src={item.mediaUrls[0]}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {editable && (
                    <>
                      <button
                        className="p-2 bg-white/90 rounded-full hover:bg-white"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 bg-white/90 rounded-full hover:bg-white"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Media Count */}
                {item.mediaUrls.length > 1 && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                    +{item.mediaUrls.length - 1} more
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {item.mediaUrls.slice(0, 3).map((url, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 flex items-center justify-center text-gray-500"
                      >
                        {getMediaIcon(url)}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Item */}
      {editable && (
        <div className="mt-8">
          <Button className="w-full">
            Add New Portfolio Item
          </Button>
        </div>
      )}

      {/* Modal for viewing details */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedItem.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
                {selectedItem.mediaUrls[0] ? (
                  <img
                    src={selectedItem.mediaUrls[0]}
                    alt={selectedItem.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Image className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedItem.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedItem.category}
                </span>
              </div>
              
              {selectedItem.mediaUrls.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedItem.mediaUrls.map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`${selectedItem.title} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            {getMediaIcon(url)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-end gap-3">
                {editable && (
                  <>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}