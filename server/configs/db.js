import mongoose from "mongoose";
import dns from "dns";

// Ensure MongoDB SRV records resolve reliably on all networks/environments
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // ignore if restricted
}


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB connected successfully'));
        await mongoose.connect(`${process.env.MONGODB_URI}/mnnitblog`);
    } catch (error) {
        console.error(error.message);
    }
}
export default connectDB;