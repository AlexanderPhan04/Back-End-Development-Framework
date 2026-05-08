import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { startApolloServer } = await import("./graphql/index.js");

const {
    notFound,
    errorHandler
} = await import("./middlewares/error.middleware.js");

const PORT = process.env.PORT || 5000;

await connectDB();

await startApolloServer(app);

// Đặt error middleware sau GraphQL
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
});