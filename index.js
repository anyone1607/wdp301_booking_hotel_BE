import express from "express";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from "cookie-parser";
import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'
import hotelRoute from './routes/hotels.js'
import itineraryRoute from './routes/itinerary.js'
import restaurantRoute from './routes/restaurants.js'
import paymentRoute from './routes/paymentRoute.js'; // Import paymentRoute
import emailRoute from './routes/email.js';
import contactRoute from './routes/contact.js';


dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOptions = {
   origin: true,
   credentials: true
}

mongoose.set("strictQuery", false)
const connect = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      })

      console.log('MongoDB connected')
   } catch (error) {
      console.log('MongoDB connected failed')
   }
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/tours", tourRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/review", reviewRoute)
app.use("/api/v1/booking", bookingRoute)
app.use("/api/v1/hotels", hotelRoute)
app.use("/api/v1/itinerary", itineraryRoute)
app.use("/api/v1/restaurants", restaurantRoute)
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/booking", emailRoute)
app.use('/api/v1/contact', contactRoute);

app.listen(port, () => {
   connect()
   console.log('server listening on port', port)
})