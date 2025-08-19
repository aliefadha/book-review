import { PrismaClient } from '@prisma/client';
import { sampleBooks } from './data/books';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if books already exist to avoid duplicates
  const existingBooks = await prisma.book.count();

  if (existingBooks === 0) {
    console.log('📚 Seeding books...');
    await prisma.book.createMany({
      data: sampleBooks,
    });
    console.log(`✅ Created ${sampleBooks.length} books`);
  } else {
    console.log('📚 Books already exist, skipping...');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
