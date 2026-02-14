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
        const msg = error?.message ?? '';
        console.error(`MongoDB Error: ${msg}`);
        if ((msg.includes('querySrv') && msg.includes('ECONNREFUSED')) || (msg.includes('querySrv') && msg.includes('ETIMEOUT'))) {
            console.error('');
            console.error('DNS SRV lookup failed (common on some networks/VPNs or Node 24 on Windows).');
            console.error('Fix: Use the STANDARD connection string instead of SRV:');
            console.error('  1. In MongoDB Atlas: Database → Connect → Connect your application.');
            console.error('  2. Choose "Drivers" and your driver; look for "Standard connection string" or switch from mongodb+srv to mongodb://.');
            console.error('  3. Or get your cluster hostnames (e.g. taakra-db-shard-00-00.c4y566z.mongodb.net:27017) and set:');
            console.error('     MONGO_URI=mongodb://USER:PASS@taakra-db-shard-00-00.c4y566z.mongodb.net:27017,taakra-db-shard-00-01.c4y566z.mongodb.net:27017,taakra-db-shard-00-02.c4y566z.mongodb.net:27017/taakra?ssl=true&replicaSet=atlas-xxx');
            console.error('  4. For local dev only: MONGO_URI=mongodb://localhost:27017/taakra');
            console.error('');
        } else if (msg.includes('ETIMEOUT') && isAtlas) {
            console.error('Tip: Check (1) Internet/VPN, (2) Atlas Network Access allows your IP, (3) Or use standard URI or local MongoDB.');
        }
        process.exit(1);
    }
};

export default connectDB;
