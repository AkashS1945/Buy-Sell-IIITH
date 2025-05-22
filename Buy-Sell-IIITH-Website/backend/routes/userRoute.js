import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; 
import authMiddleware from '../middlewares/authMiddleware.js'; 


const router = express.Router();

// New user Registration
router.post('/register', async (req, res) => {

    const { firstName, lastName, email, contactNumber, age, password } = req.body;
    try {
        console.log(firstName,lastName,email,contactNumber,age,password);

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

        user.save();

        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload,process.env.jwt_secret_key);
  
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
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

        const payload = {id: userId};

        const token = jwt.sign(payload,process.env.jwt_secret_key);

        res.status(201).json({ token:token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/get-current-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'User fetched successfully', user });
    } catch (err) {
        console.error(err.message);
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

        if (password) {
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