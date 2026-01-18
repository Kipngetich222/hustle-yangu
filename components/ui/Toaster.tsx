'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
          },
        },
      }}
    />
  )
}