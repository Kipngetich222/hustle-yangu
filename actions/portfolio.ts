// actions/portfolio.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPortfolio(userId: string) {
  try {
    const portfolio = await prisma.portfolio.findMany({
      where: { profile: { userId } },
      orderBy: { createdAt: 'desc' }
    });

    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
}

export async function createPortfolioItem(data: {
  profileId: string;
  title: string;
  description: string;
  mediaUrls: string[];
  category: string;
}) {
  try {
    const portfolio = await prisma.portfolio.create({
      data
    });

    revalidatePath('/portfolio');
    return portfolio;
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    throw error;
  }
}

export async function updatePortfolioItem(id: string, data: {
  title?: string;
  description?: string;
  mediaUrls?: string[];
  category?: string;
}) {
  try {
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data
    });

    revalidatePath('/portfolio');
    return portfolio;
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    throw error;
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    await prisma.portfolio.delete({
      where: { id }
    });

    revalidatePath('/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    throw error;
  }
}