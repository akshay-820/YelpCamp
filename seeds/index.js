//to add own data
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
});

const campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random50 = Math.floor(Math.random() * 50);
        const randomDesc = Math.floor(Math.random() * 20);
        const randomPlace = Math.floor(Math.random() * 20);
        const camp = new campground({
            location: `${cities[random50].city}, ${cities[random50].state}`,
            title: `${descriptors[randomDesc]} ${places[randomPlace]}`,
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
