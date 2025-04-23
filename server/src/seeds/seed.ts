import db from '../config/connection.js';
import { User } from '../models/index.js';
import userSeeds from './userData.json' assert { type: "json" };
import cleanDB from './cleanDB.js';
import bcrypt from 'bcrypt';

// TODO: Our seeding takes the passwords and stores them as plaintext...
// This is not wise...

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    const users = await Promise.all(userSeeds.map(async user => ({
    ...user,
    password: await bcrypt.hash(user.password, 10)
    })));
    
    await User.insertMany(users);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error seeding database:', error.message);
    } else {
      console.error('Unknown error seeding database');
    }
    process.exit(1);
  }
};

seedDatabase();
