const express = require('express');
const BlogPostModel = require('../models/blogPost');
const blogPost = express.Router();
const { blogCloudUpload } = require('../cloud/myCloud');
const verifyToken = require('../middlewares/verifyToken');

blogPost.get('/blogPost', async (req, res, next) => {
    try {
        const blogPost = await BlogPostModel.find().limit(2).skip(2 * (req.query.page - 1));
        res.status(200).send(blogPost);
    } catch (error) {
        next(error);
    }
})

blogPost.get('/blogPost/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const searchBlogPost = await BlogPostModel.findById(id);
        if (!searchBlogPost) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'Blog post not found'
                })
        }
        res.status(200).send(searchBlogPost);
    } catch (error) {
        next(error);
    }
})

blogPost.post('/blogPost/create', [verifyToken, blogCloudUpload.single('blogImage')], async (req, res, next) => {
    const newBlogPost = new BlogPostModel({
        category: req.body.category,
        title: req.body.title,
        cover: req.file.path,
        author: "Dummy"//req.body.author
    })
    try {
        const alreadyExist = await BlogPostModel.findOne({ title: req.body.title })
        if (alreadyExist) {
            return res.status(409)
                .send({
                    statusCode: 409,
                    message: 'This blog post already exist'
                })
        }
        const saveBlogPost = await newBlogPost.save();
        res.status(201)
            .send({
                statusCode: 201,
                message: 'Blog post added to database',
                saveBlogPost
            })
    } catch (error) {
        next(error);
    }
})

blogPost.patch('/blogPost/:id', async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const options = { new: true }
    const searchBlogPost = await BlogPostModel.findById(id);
    if (!searchBlogPost) {
        return res.status(404)
            .send({
                statusCode: 404,
                message: 'Blog post not found'
            })
    }
    try {
        const updateBlogPost = await BlogPostModel.findByIdAndUpdate(id, body, options);
        res.status(201)
            .send({
                message: 'Blog post updated to database',
                updateBlogPost
            });
    } catch (error) {
        next(error);
    }
})

blogPost.delete('/blogPost/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteBlogPost = await BlogPostModel.findByIdAndDelete(id);
        if (!deleteBlogPost) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: 'Blog post not found'
                })
        }
        res.status(200)
            .send({
                message: 'Blog post deleted from database'
            });
    } catch (error) {
        next(error);
    }
})

module.exports = blogPost;
