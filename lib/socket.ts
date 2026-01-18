import { Server } from 'socket.io';
import { createServer } from 'http';
import { prisma } from './prisma';

let io: Server | null = null;

export const initSocket = (server: ReturnType<typeof createServer>) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    path: '/api/socket',
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user room
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join conversation room
    socket.on('join-conversation', (data: { userId: string; receiverId: string }) => {
      const roomId = [data.userId, data.receiverId].sort().join(':');
      socket.join(`conversation:${roomId}`);
      console.log(`User joined conversation room: ${roomId}`);
    });

    // Send message
    socket.on('message', async (data: any) => {
      try {
        const { senderId, receiverId, content } = data;
        
        // Save message to database
        const message = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content,
            isRead: false,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Emit to conversation room
        const roomId = [senderId, receiverId].sort().join(':');
        io?.to(`conversation:${roomId}`).emit('message', message);
        
        // Emit notification to receiver
        io?.to(`user:${receiverId}`).emit('new-message', {
          senderId,
          senderName: message.sender.name,
          content: message.content,
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
      socket.broadcast.to(`user:${data.receiverId}`).emit('typing', {
        userId: socket.id,
        isTyping: data.isTyping,
      });
    });

    // Stop typing
    socket.on('stop-typing', (data: { receiverId: string }) => {
      socket.broadcast.to(`user:${data.receiverId}`).emit('stop-typing', socket.id);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};