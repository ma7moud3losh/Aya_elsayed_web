import cors from "cors";
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// connect db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// routes
app.use('/api', apiRoutes);

// serve frontend build if you choose to build and serve static from backend
// app.use(express.static('../frontend'));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
