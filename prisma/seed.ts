// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.message.deleteMany();
  await prisma.location.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const jobSeekers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'SEEKER',
        profile: {
          create: {
            bio: 'Experienced handyman with 5+ years of experience in various repair and maintenance tasks.',
            skills: ['Carpentry', 'Plumbing', 'Electrical', 'Painting'],
            experience: ['Home Renovation Specialist', 'Apartment Maintenance'],
            rating: 4.8,
            reviewCount: 24,
          },
        },
        location: {
          create: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'SEEKER',
        profile: {
          create: {
            bio: 'Professional cleaner with attention to detail and eco-friendly cleaning solutions.',
            skills: ['Deep Cleaning', 'Organization', 'Window Cleaning', 'Sanitization'],
            experience: ['Residential Cleaning', 'Office Cleaning'],
            rating: 4.9,
            reviewCount: 18,
          },
        },
        location: {
          create: {
            latitude: 40.7580,
            longitude: -73.9855,
            address: '456 Broadway',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike@example.com',
        name: 'Mike Wilson',
        password: hashedPassword,
        role: 'SEEKER',
        profile: {
          create: {
            bio: 'Landscaper and gardener with expertise in sustainable gardening practices.',
            skills: ['Landscaping', 'Gardening', 'Tree Trimming', 'Irrigation'],
            experience: ['Commercial Landscaping', 'Residential Gardening'],
            rating: 4.7,
            reviewCount: 15,
          },
        },
        location: {
          create: {
            latitude: 40.7510,
            longitude: -73.9945,
            address: '789 Park Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
  ]);

  const employers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'business@example.com',
        name: 'Business Corp',
        password: hashedPassword,
        role: 'EMPLOYER',
        profile: {
          create: {
            bio: 'Property management company seeking reliable contractors for various projects.',
            skills: ['Project Management', 'Contracting'],
            experience: ['Property Management', 'Construction'],
            rating: 4.5,
            reviewCount: 32,
          },
        },
        location: {
          create: {
            latitude: 40.7306,
            longitude: -73.9352,
            address: '101 Corporate Blvd',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'homeowner@example.com',
        name: 'David Miller',
        password: hashedPassword,
        role: 'EMPLOYER',
        profile: {
          create: {
            bio: 'Homeowner looking for reliable help with household tasks and maintenance.',
            skills: ['Home Maintenance', 'DIY'],
            experience: ['Home Renovation'],
            rating: 4.6,
            reviewCount: 8,
          },
        },
        location: {
          create: {
            latitude: 40.7831,
            longitude: -73.9712,
            address: '202 Central Park West',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
  ]);

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Apartment Painting',
        description: 'Looking for an experienced painter to paint a 2-bedroom apartment. All supplies provided. Must have own tools. Clean and professional work required.',
        employerId: employers[0].id,
        category: 'Painting',
        jobType: 'CASUAL',
        status: 'AVAILABLE',
        payAmount: 800,
        payType: 'FIXED',
        startTime: new Date('2024-12-20T09:00:00Z'),
        endTime: new Date('2024-12-22T17:00:00Z'),
        location: {
          create: {
            latitude: 40.7210,
            longitude: -73.9900,
            address: '123 Spring St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.job.create({
      data: {
        title: 'Office Deep Cleaning',
        description: 'Weekly deep cleaning for a small office (1500 sq ft). Must be available every Friday afternoon. Eco-friendly cleaning products preferred.',
        employerId: employers[0].id,
        category: 'Cleaning',
        jobType: 'LONG_TERM',
        status: 'AVAILABLE',
        payAmount: 25,
        payType: 'HOURLY',
        startTime: new Date('2024-12-15T14:00:00Z'),
        endTime: new Date('2024-12-15T18:00:00Z'),
        location: {
          create: {
            latitude: 40.7505,
            longitude: -73.9934,
            address: '456 Madison Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.job.create({
      data: {
        title: 'Garden Maintenance',
        description: 'Need help with weekly garden maintenance including weeding, pruning, and general upkeep. About 2-3 hours per week.',
        employerId: employers[1].id,
        category: 'Gardening',
        jobType: 'LONG_TERM',
        status: 'AVAILABLE',
        payAmount: 30,
        payType: 'HOURLY',
        startTime: new Date('2024-12-16T10:00:00Z'),
        endTime: new Date('2024-12-16T12:00:00Z'),
        location: {
          create: {
            latitude: 40.7850,
            longitude: -73.9685,
            address: '789 Riverside Dr',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.job.create({
      data: {
        title: 'Furniture Assembly',
        description: 'Quick furniture assembly job. Need someone to assemble 3 pieces of IKEA furniture. Should take 2-3 hours.',
        employerId: employers[1].id,
        category: 'Assembly',
        jobType: 'ONE_TIME',
        status: 'AVAILABLE',
        payAmount: 120,
        payType: 'FIXED',
        startTime: new Date('2024-12-18T13:00:00Z'),
        endTime: new Date('2024-12-18T16:00:00Z'),
        location: {
          create: {
            latitude: 40.7320,
            longitude: -73.9895,
            address: '101 Houston St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
    prisma.job.create({
      data: {
        title: 'Moving Help',
        description: 'Need 2 strong individuals to help move furniture from a 3rd floor apartment to a moving truck. Heavy lifting required.',
        employerId: employers[1].id,
        category: 'Moving',
        jobType: 'ONE_TIME',
        status: 'AVAILABLE',
        payAmount: 200,
        payType: 'FIXED',
        startTime: new Date('2024-12-17T08:00:00Z'),
        endTime: new Date('2024-12-17T12:00:00Z'),
        location: {
          create: {
            latitude: 40.7450,
            longitude: -73.9820,
            address: '202 5th Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
          },
        },
      },
    }),
  ]);

  // Create sample applications
  await Promise.all([
    prisma.application.create({
      data: {
        jobId: jobs[0].id,
        seekerId: jobSeekers[0].id,
        status: 'PENDING',
        message: 'I have 5 years of professional painting experience and can start immediately.',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[1].id,
        seekerId: jobSeekers[1].id,
        status: 'PENDING',
        message: 'I specialize in eco-friendly cleaning and have references available.',
      },
    }),
    prisma.application.create({
      data: {
        jobId: jobs[2].id,
        seekerId: jobSeekers[2].id,
        status: 'ACCEPTED',
        message: 'I love gardening and have experience with both residential and commercial properties.',
      },
    }),
  ]);

  // Create sample calendar events
  await prisma.calendarEvent.create({
    data: {
      userId: jobSeekers[2].id,
      jobId: jobs[2].id,
      title: 'Garden Maintenance',
      description: 'Weekly garden maintenance at David Miller\'s residence',
      startTime: new Date('2024-12-16T10:00:00Z'),
      endTime: new Date('2024-12-16T12:00:00Z'),
      status: 'SCHEDULED',
    },
  });

  // Create sample portfolio items
  await Promise.all([
    prisma.portfolio.create({
      data: {
        profileId: jobSeekers[0].profile!.id,
        title: 'Complete Home Renovation',
        description: 'Full renovation of a 3-bedroom house including painting, flooring, and kitchen remodel.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w-800',
        ],
        category: 'Renovation',
      },
    }),
    prisma.portfolio.create({
      data: {
        profileId: jobSeekers[1].profile!.id,
        title: 'Office Deep Cleaning',
        description: 'Complete deep cleaning of a corporate office space.',
        mediaUrls: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
        ],
        category: 'Cleaning',
      },
    }),
  ]);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: jobSeekers[0].id,
        title: 'Tips for Painting Like a Pro',
        content: 'After 5 years in the painting business, here are my top tips:\n1. Always prep surfaces properly\n2. Invest in quality brushes\n3. Use painter\'s tape for clean edges\n4. Work in thin, even coats\n5. Clean tools immediately after use',
        mediaUrls: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        category: 'Tips & Advice',
      },
    }),
    prisma.post.create({
      data: {
        userId: employers[1].id,
        title: 'Looking for Reliable Handyman',
        content: 'I need recommendations for a reliable handyman in the NYC area. I have several small projects around the house.',
        mediaUrls: [],
        category: 'Community Help',
      },
    }),
  ]);

  // Create sample comments and likes
  await Promise.all([
    prisma.comment.create({
      data: {
        postId: posts[0].id,
        userId: jobSeekers[1].id,
        content: 'Great tips! I would add: always use drop cloths to protect floors.',
      },
    }),
    prisma.like.create({
      data: {
        postId: posts[0].id,
        userId: jobSeekers[2].id,
      },
    }),
    prisma.like.create({
      data: {
        postId: posts[0].id,
        userId: employers[0].id,
      },
    }),
  ]);

  // Create sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: jobSeekers[0].id,
        receiverId: employers[0].id,
        content: 'Hi, I saw your painting job posting. I have extensive experience and would love to discuss the project.',
        isRead: true,
      },
    }),
    prisma.message.create({
      data: {
        senderId: employers[0].id,
        receiverId: jobSeekers[0].id,
        content: 'Thanks for reaching out! Can you share some examples of your previous work?',
        isRead: true,
      },
    }),
    prisma.message.create({
      data: {
        senderId: jobSeekers[0].id,
        receiverId: employers[0].id,
        content: 'Absolutely! I\'ve attached some photos of my recent projects to my portfolio on my profile.',
        isRead: false,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log(`Created: 
    - ${jobSeekers.length} job seekers
    - ${employers.length} employers
    - ${jobs.length} jobs
    - ${posts.length} posts
  `);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });