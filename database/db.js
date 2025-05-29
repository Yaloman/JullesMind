const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB tilkoblet');
  } catch (err) {
    console.error('❌ Kunne ikke koble til MongoDB:', err.message);
    process.exit(1); // Stopp boten hvis databasen ikke funker
  }
};

module.exports = connectDB;