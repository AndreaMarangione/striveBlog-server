// class customError extends Error {
//     constructor(message, statusCode, details) {
//         super(message);
//         this.statusCode = statusCode;
//         this.details = details;
//     }
// }

const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        status,
        message,
        stack: err.stack
    })
}

module.exports = errorHandler;
