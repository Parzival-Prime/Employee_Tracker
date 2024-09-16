import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.router.js'

//rest object
const app = express()

//middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: 'include',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}))
app.use(express.json())
app.use(express.static("public"))
app.use(morgan('dev'))
app.use(cookieParser())

// app.options('/health', cors());

//routes
app.use('/api/v1/auth', authRoute)

// HealthCheck endpoint config
// app.get('/health', (req, res) => {
//   try {
//     res.set('Cache-Control', 'no-store');
//     return res.status(200).send('OK');
//   } catch (error) {
//     res.set('Cache-Control', 'no-store');
//     res.status(500).send('Error');
//   }
// });

export { app }