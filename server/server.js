import dotenv from 'dotenv'
import connectDB from './db/db.js'
import { app } from './app.js'

//configure env
dotenv.config()

//connect Database
connectDB()

//PORT
const PORT = process.env.PORT

//run listner
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})