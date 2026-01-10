import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';   
dotenv.config();
import mongoose from 'mongoose';
const app= express();
import { Server } from 'socket.io'; 
const server=http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
import authRoutes from './routes/authRoutes.js'; // Adjust the path as necessary
import postRoutes from './routes/postRoutes.js'; // Ensure you have this route set up
import commentRoutes from './routes/commentRoutes.js'; // Ensure you have this route set up
import userRoutes from './routes/userRoutes.js'; // Ensure you have this route set up

const io = new Server(server, {              
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  socket.on('send-message', (data) => {
    // Broadcast to ALL connected users
    io.emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:');
  });
});




mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to local MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT||5000 ;

app.use(cors({
  origin: true,
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/comments', commentRoutes); // Ensure you have this route set up
app.use('/api/users', userRoutes);


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    
});
