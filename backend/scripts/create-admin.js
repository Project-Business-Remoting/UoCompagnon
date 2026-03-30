const mongoose = require('mongoose');
const User = require('../src/models/User');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.log('Usage: node scripts/create-admin.js <email> <password> [name]');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      console.log('User already exists. Updating to admin...');
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('User updated to admin successfully!');
    } else {
      const newAdmin = new User({
        name,
        email,
        password,
        role: 'admin',
        program: 'Administration',
        arrivalDate: new Date(),
        classStartDate: new Date()
      });
      await newAdmin.save();
      console.log('Admin created successfully!');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
