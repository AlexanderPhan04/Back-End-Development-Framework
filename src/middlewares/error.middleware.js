export const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message);
    console.error(err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: err.message || "Internal Server Error"
    });
};
