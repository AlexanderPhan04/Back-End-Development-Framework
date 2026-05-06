import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { startApolloServer } = await import("./graphql/index.js");

const PORT = process.env.PORT || 5000;

await connectDB();
await startApolloServer(app);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});