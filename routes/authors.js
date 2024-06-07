const express = require('express');
const AuthorsModel = require('../models/authors');
const authors = express.Router();
const { authorsCloudUpload } = require('../cloud/myCloud');

authors.get('/authors', async (req, res, next) => {
    try {
        const authors = await AuthorsModel.find().limit(2).skip(2 * (req.query.page - 1));
        res.status(200).send(authors);
    } catch (error) {
        next(error);
    }
})

authors.get('/authors/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const searchAuthor = await AuthorsModel.findById(id);
        if (!searchAuthor) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'Author not found'
                })
        }
        res.status(200).send(searchAuthor);
    } catch (error) {
        next(error);
    }
})

authors.post('/authors/create', authorsCloudUpload.single('authorAvatar'), async (req, res, next) => {
    const newAuthors = new AuthorsModel({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        dateOfBirthday: req.body.dateOfBirthday,
        avatar: req.file.path,
    })
    try {
        const alreadyExist = await AuthorsModel.findOne({ email: req.body.email })
        if (alreadyExist) {
            return res.status(409)
                .send({
                    statusCode: 409,
                    message: 'This author already exist'
                })
        }
        const saveAuthor = await newAuthors.save();
        res.status(201)
            .send({
                statusCode: 201,
                message: 'Author added to database',
                saveAuthor
            })
    } catch (error) {
        next(error);
    }
})

authors.patch('/authors/:id', async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const options = { new: true }
    const searchAuthor = await AuthorsModel.findById(id);
    if (!searchAuthor) {
        return res.status(404)
            .send({
                statusCode: 404,
                message: 'Author not found'
            })
    }
    try {
        const updateAuthor = await AuthorsModel.findByIdAndUpdate(id, body, options);
        res.status(201)
            .send({
                message: 'Author updated to database',
                updateAuthor
            });
    } catch (error) {
        next(error);
    }
})

authors.delete('/authors/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteAuthor = await AuthorsModel.findByIdAndDelete(id);
        if (!deleteAuthor) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'Author not found'
                })
        }
        res.status(200)
            .send({
                message: 'Author deleted from database'
            });
    } catch (error) {
        next(error);
    }
})

module.exports = authors;
