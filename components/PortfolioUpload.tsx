// app/components/PortfolioUpload.tsx
'use client';

import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function PortfolioUpload({ profileId }: { profileId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          title: 'New Portfolio Item',
          description: 'Added from upload',
          mediaUrls: results,
          category: 'work'
        })
      });
      
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="border1 border-dashed border-gray-300 p-6 rounded-lg">
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : `Upload ${files.length} items`}
      </button>
    </div>
  );
}