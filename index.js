import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from  'dotenv';
import postRoutes from './routes/posts.js'

const app = express();
dotenv.config();

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.get('/posts/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })

app.use('/posts', postRoutes);
app.get('/', (req, res)=>{
    res.send('Welcome to the village API')
});
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>app.listen(PORT, ()=> console.log(`Server is running on port: ${PORT}`)))
    .catch((error)=> console.log(error.message));

// mongoose.set('useFindAndModify', false);
