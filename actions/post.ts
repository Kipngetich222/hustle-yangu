// actions/posts.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPosts(category?: string) {
  try {
    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                bio: true,
                skills: true
              }
            }
          }
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return posts.map(post => ({
      ...post,
      likes: post.likes.length,
      comments: post.comments.length
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function createPost(userId: string, data: {
  title: string;
  content: string;
  mediaUrls?: string[];
  category: string;
}) {
  try {
    const post = await prisma.post.create({
      data: {
        userId,
        ...data,
        mediaUrls: data.mediaUrls || []
      }
    });

    revalidatePath('/posts');
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function likePost(postId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
    } else {
      await prisma.like.create({
        data: { postId, userId }
      });
    }

    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

export async function addComment(postId: string, userId: string, content: string) {
  try {
    const comment = await prisma.comment.create({
      data: { postId, userId, content },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    revalidatePath('/posts');
    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}