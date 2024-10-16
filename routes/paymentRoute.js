import express from 'express';
import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js'; // Adjust the path according to your directory structure
import Booking from '../models/Booking.js';
dotenv.config();

const router = express.Router();

const payos = new PayOS(
    "eea8ab60-aa1c-4c0c-a4d1-ab504ad5b582",
    "ea97f7da-d699-4ace-ac9b-3ac977f0c250",
    "bbd5ecde91faba16df941bf37514e4fb67206b7cb1e95aee9d5bcd748a7cc781"
);

router.post('/create-payment-link', async (req, res) => {
    const { amount, bookingId } = req.body;
    const YOUR_DOMAIN = process.env.REACT_URL;

    try {
        const order = {
            amount: amount * 10,
            description: bookingId, // Example description
            orderCode: Math.floor(10000000 + Math.random() * 90000000),
            returnUrl: `${YOUR_DOMAIN}/success`,
            cancelUrl: `${YOUR_DOMAIN}/cancel`,
        };

        const paymentLink = await payos.createPaymentLink(order);

        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error("Error creating payment link:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'confirmed' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
    } catch (error) {
        console.error("Error confirming booking:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to handle payment success
router.get('/payment-success/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'confirmed' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).send('<h1>Booking not found</h1>');
        }

        res.send('<h1>Payment successful!</h1><p>Your booking has been confirmed.</p>');
    } catch (error) {
        console.error("Error confirming booking:", error.message);
        res.status(500).send('<h1>An error occurred while confirming your booking</h1>');
    }
});

// Route to handle payment cancellation
router.get('/payment-cancel/:id', (req, res) => {
    res.send('<h1>Payment cancelled</h1><p>Your booking has not been confirmed.</p>');
});

export default router;
