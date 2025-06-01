import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionINstaance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MONGODB connected !! DB HOST: ${connectionINstaance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection issue" + error);
        process.exit(1);
    }
}

export default connectDB;