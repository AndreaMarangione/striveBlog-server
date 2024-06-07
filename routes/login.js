const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthorsModel = require('../models/authors');

login.post('/login', async (req, res, next) => {
    const author = await AuthorsModel.findOne({ email: req.body.email });

    if (!author) {
        return res.status(404).send('Author Not Found');
    }
    try {
        const validPassword = await bcrypt.compare(req.body.password, author.password);
        if (!validPassword) {
            return res.status(403).send('Username or Password Not Valid');
        }
        const token = jwt.sign({
            name: author.name,
            surname: author.surname,
            email: author.email,
            dateOfBirthday: author.dateOfBirthday,
            avatar: author.avatar
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '15m'
            })
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
})

module.exports = login;
