import mongoose from "mongoose";

export default async function connect() {
  const connection_status = await mongoose.connect(
    "mongodb+srv://gavhanebhairu7:1RtxMNTvN5HoM2uE@cluster0.48fq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  if (connection_status) {
    console.log("connected to database");
  } else console.log("failed to connect", connection_status);
}
