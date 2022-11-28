require("dotenv").config();
const express = require("express");
const colors = require("colors");
const router = require("../routers/router");
const mongoose = require("mongoose");

// establishing connection with DB.

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    } catch (error) {
        console.log(`Connection to Database failed. error: ${error}`.red.underline);
    }
}
connection();


const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT;

app.get("/", router);

app.listen(port, (req, res) => {
    console.log(`listening at port ${port}`);
});
