import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    telephone: { type: String, required: false },
    avatar: { type: String, required: false },
    towns: { type: [String], required: false },
    id: { type: String }
});

const User = mongoose.model('User', userSchema);

export default User;
