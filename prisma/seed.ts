import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing categories/skills to avoid duplicates on multiple seed runs
  await prisma.skill.deleteMany()

  // 1. Seed Skills & Categories
  const skills = [
    // PHYSICAL
    { name: 'Moving Assistance', type: 'PHYSICAL', slug: 'moving-assistance' },
    { name: 'Yard Work', type: 'PHYSICAL', slug: 'yard-work' },
    { name: 'Furniture Assembly', type: 'PHYSICAL', slug: 'furniture-assembly' },
    { name: 'Errands & Delivery', type: 'PHYSICAL', slug: 'errands-delivery' },
    
    // DIGITAL
    { name: 'Graphic Design', type: 'DIGITAL', slug: 'graphic-design' },
    { name: 'Web Development', type: 'DIGITAL', slug: 'web-development' },
    { name: 'Copywriting', type: 'DIGITAL', slug: 'copywriting' },
    { name: 'Data Entry', type: 'DIGITAL', slug: 'data-entry' },
    
    // TUTORING
    { name: 'Math Tutoring', type: 'TUTORING', slug: 'math-tutoring' },
    { name: 'Language Practice', type: 'TUTORING', slug: 'language-practice' },
    { name: 'Music Lessons', type: 'TUTORING', slug: 'music-lessons' }
  ]

  console.log('Creating skills...')
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: skill,
    })
  }

  // Note: We don't seed users or gigs yet because they require valid Clerk IDs 
  // and real relations. We will generate mock users when we have a valid database URL.

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
