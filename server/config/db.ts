import mongoose from "mongoose"
const connectDB = async()=>{
    try {
        mongoose.connection.on('connected', ()=>console.log('MongoDB is connected'))
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.error("Error Connecting to MongoDB", error)
    }
}
export default connectDB;