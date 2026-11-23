import mongooses from "mongoose";
const connectDB =async ()=>{
    try {
        mongooses.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
    } catch (error) {
        console.log("error occred",error);

        
    }

}
export default connectDB;
