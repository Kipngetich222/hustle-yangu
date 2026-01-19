// app/api/portfolio/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, mediaUrls, category } = data;

    // Check if portfolio item exists and user owns it
    const portfolioItem = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: { profile: true }
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    if (portfolioItem.profile.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this portfolio item' },
        { status: 403 }
      );
    }

    const updatedItem = await prisma.portfolio.update({
      where: { id: params.id },
      data: {
        title,
        description,
        mediaUrls,
        category
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if portfolio item exists and user owns it
    const portfolioItem = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: { profile: true }
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    if (portfolioItem.profile.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this portfolio item' },
        { status: 403 }
      );
    }

    await prisma.portfolio.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
}