import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(409).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Somwthing went wrong' });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exist.' });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: 'Somwthing went wrong' });
    }
};

export const update = async (req, res) => {
    const { id: _id } = req.params;
    const user = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that id');
    console.log({ ...user });
    const updatedUser = await User.findByIdAndUpdate(_id, { avatar: user.avatar, towns: user.towns, telephone: user.telephone, email: user.email, name: `${user.firstName} ${user.lastName}`, _id }, { new: true });

    const token = jwt.sign({ email: updatedUser.email, id: updatedUser._id }, 'test', { expiresIn: '1h' });
    console.log(updatedUser);

    res.status(200).json({ result: updatedUser, token });
};

export const deleteUser = async (req, res) => {
    console.log('DELETE');
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with that id');

    await User.findByIdAndRemove(id);

    res.json({ message: 'User deleted successfully' });
};
