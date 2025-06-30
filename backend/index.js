import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';   
dotenv.config();
import mongoose from 'mongoose';
const app= express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
import authRoutes from './routes/authRoutes.js'; // Adjust the path as necessary
import postRoutes from './routes/postRoutes.js'; // Ensure you have this route set up
import commentRoutes from './routes/commentRoutes.js'; // Ensure you have this route set up
import userRoutes from './routes/userRoutes.js'; // Ensure you have this route set up

mongoose.connect("mongodb://localhost:27017/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to local MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT||5000 ;

app.use(cors({
  origin: 'http://localhost:5173',  // your frontend URL
  credentials: true,                 // allow cookies to be sent
}));
app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/comments', commentRoutes); // Ensure you have this route set up
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    
});
