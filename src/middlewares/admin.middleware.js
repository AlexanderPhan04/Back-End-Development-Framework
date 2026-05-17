export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            status: 403,
            success: false,
            message: "Admin access only"
        });
    }
};
