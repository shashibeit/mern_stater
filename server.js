const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const singin=require("./routes/api/signin");

const app = express();

// body parser middleware
app.use(bodyParser.json());

// db config
const db = require("./config/keys").mongoURI;

mongoose.connect(db)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

    
app.use("/",singin);

const port = process.env.PORT || 5000;

app.listen(port, () => (console.log(`Server Started at ${port}`)));