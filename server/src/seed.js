import 'dotenv/config';
import mongoose from 'mongoose';
import { seedCareers } from '../../client/src/data/seedData.js';
import { Career } from './models.js';

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI in server/.env before seeding.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || undefined,
  });

  try {
    for (const career of seedCareers) {
      await Career.updateOne(
        { id: career.id },
        {
          $set: {
            ...career,
            slug: career.slug || career.id,
          },
        },
        { upsert: true, runValidators: true }
      );
    }

    console.log(`Imported ${seedCareers.length} career records.`);
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error) => {
  console.error('Career seeding failed:', error);
  process.exitCode = 1;
});