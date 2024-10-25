import app from "./frameworks/configs/app";
import { createServer } from 'http'
import connectDB from "./frameworks/configs/db";

connectDB()

const server =createServer(app)
const PORT = process.env.PORT || 5000 
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`); 
})