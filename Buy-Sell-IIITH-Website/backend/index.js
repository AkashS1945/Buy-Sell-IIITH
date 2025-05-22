import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Config/dbConfig.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoutes.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import supportRoute from './routes/supportRoute.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoute); 
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/support", supportRoute);

app.listen(port, () => console.log(`Server started on port ${port}`));