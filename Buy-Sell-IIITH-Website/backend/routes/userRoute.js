import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

// RECAPTCHA
const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: token
            }
        });
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
};

// New user Registration
router.post('/register', async (req, res) => {

    const { firstName, lastName, email, contactNumber, age, password } = req.body;
    try {
        console.log(firstName, lastName, email, contactNumber, age, password);

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            age: age,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.jwt_secret_key);

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    try {
        // Verify reCAPTCHA first
        if (!recaptchaToken) {
            return res.status(400).json({ msg: 'reCAPTCHA token is required' });
        }

        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.status(400).json({ msg: 'reCAPTCHA verification failed' });
        }

        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const userId = user._id;

        const payload = { id: userId };

        const token = jwt.sign(payload, process.env.jwt_secret_key);

        res.status(201).json({ token: token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/get-current-user', authMiddleware, async (req, res) => {
    try {
        console.log('Fetching user with ID:', req.body.id);
        const user = await User.findOne({ _id: req.body.id });
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User fetched successfully', user });
    } catch (err) {
        console.error('Error in get-current-user:', err.message);
        res.status(500).send('Server error');
    }
});


// Update user information
router.put('/update', authMiddleware, async (req, res) => {
    const { firstName, lastName, age, contactNumber, password } = req.body;

    try {
        let user = await User.findById(req.body.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        user.contactNumber = contactNumber || user.contactNumber;

        if (password && password !== user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({ success: true, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



export default router;