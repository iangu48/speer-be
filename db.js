const mongoose = require("mongoose");

const env = process.env.NODE_ENV === "test" ? "speer_test" : "speer"
const uri = "mongodb://localhost:27017/" + env

if (process.env.NODE_ENV !== "test")
    console.log(`Connecting to ${uri}`)

const initMongo = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true
        });
        return ("Connected to " + uri);
    } catch (e) {
        throw e;
    }
}

module.exports = initMongo;