const express = require('express');
const home = express.Router();

home.get('/', async (req, res, next) => {
    res.status(200).send('Strive Blog');
})

module.exports = home;
