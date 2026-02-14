import mongoose from 'mongoose';

const connectDB = async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/taakra';
    const isAtlas = uri.includes('mongodb.net');
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: isAtlas ? 30000 : 5000,
            connectTimeoutMS: isAtlas ? 20000 : 5000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`MongoDB Error: ${error.message}`);
        if (error.message?.includes('ETIMEOUT') && isAtlas) {
            console.error('Tip: DNS/network timeout to Atlas. Check: (1) Internet/VPN, (2) Atlas IP Access List allows your IP, (3) Or use local: MONGO_URI=mongodb://localhost:27017/taakra');
        }
        process.exit(1);
    }
};

export default connectDB;
