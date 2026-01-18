'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getConversations() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    },
    distinct: ['senderId', 'receiverId'],
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return conversations
}

export async function sendMessage(receiverId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return message
}