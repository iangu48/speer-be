const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/speer"

const initMongo = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true
        });
        return ("connected to " + uri);
    } catch (e) {
        throw e;
    }
}

module.exports = initMongo;