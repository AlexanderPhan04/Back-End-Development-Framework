import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ShopOnline API Running"
    });
});

export default app;