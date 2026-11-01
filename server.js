const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const client = new MongoClient(process.env.MONGODB_URI);
let db;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to D & P FEAST Backend!"
    });
});

app.post("/api/orders", async (req, res) => {
    try {
        const order = req.body;

       await db.collection("orders").insertOne({
    ...order,
    createdAt: new Date()
});

        console.log("New Order Received:", order);

        res.json({
            success: true,
            message: "Your order has been saved successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Could not save your order."
        });
    }
});

async function startServer() {
    try {
        await client.connect();
        db = client.db("foodie");

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`D & P FEAST running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
}

startServer();