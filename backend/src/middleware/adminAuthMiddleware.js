
import jwt from "jsonwebtoken";

const adminAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Missing or invalid Authorization header",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is missing in .env",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        req.admin = decoded;

        next();
    } catch (error) {
        console.error("Admin auth error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token",
        });
    }
};

export default adminAuthMiddleware;
