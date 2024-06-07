const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirthday: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: 'https://picsum.photos/100/100',
    },
    // role: {
    //     type: String,
    //     enum: ['admin', 'user', 'editor'],
    //     default: 'user'
    // }
}, { timestamps: true, strict: true })

AuthorsSchema.pre('save', async function (next) {
    const password = this.password;
    if (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    }
})

module.exports = mongoose.model('AuthorsModel', AuthorsSchema, 'authors')
