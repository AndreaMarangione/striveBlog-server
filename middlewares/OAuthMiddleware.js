const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthorsModel = require('../models/authors');
const jwt = require('jsonwebtoken');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3030/auth/callback"
},
    async function (accessToken, refreshToken, profile, passportNext) {
        try {
            const { email, given_name, family_name, picture } = profile._json;
            const author = await AuthorsModel.findOne({ email });

            if (author) {
                const token = jwt.sign(
                    {
                        name: author.name,
                        surname: author.surname,
                        email: author.email,
                        dateOfBirthday: author.dateOfBirthday,
                        avatar: author.avatar
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '15m'
                    });
                passportNext(null, { token })
            } else {
                const newAuthor = new AuthorsModel({
                    name: given_name,
                    surname: family_name,
                    email: email,
                    password: 'prova',
                    dateOfBirthday: 'none',
                    avatar: picture,
                })
                const createAuthor = await newAuthor.save();
                const token = jwt.sign(
                    {
                        name: createAuthor.name,
                        surname: createAuthor.surname,
                        email: createAuthor.email,
                        dateOfBirthday: createAuthor.dateOfBirthday,
                        avatar: createAuthor.avatar
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '15m'
                    });
                passportNext(null, { token })
            }
            return passportNext(null, {});
        } catch (error) {
            passportNext(error);
        }
    });

module.exports = googleStrategy;
