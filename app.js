//require
const express = require("express");
const mongoose = require("mongoose");

//this is for views file
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//for parsing req.body(in post request)
app.use(express.urlencoded({ extended: true }));

//mongoose stuff
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
});

//ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//method-override for put,delete requests
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//campground model
const campground = require("./models/campground");

//display all campgrounds
app.get("/campgrounds", async (req, res) => {
    const camp = await campground.find({});
    res.render("campgrounds/index", { camp });
});

//add new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
    const camp = new campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
});

//details of a campground
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campgrounds/show", { camp });
});

//edit a campground
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campgrounds/edit", { camp });
});
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = req.body.campground;
    await campground.findByIdAndUpdate(id, camp, {
        new: true,
        runValidators: true,
    });
    res.redirect(`/campgrounds/${id}`);
});

//delete a campground
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.listen(3000, () => {
    console.log("Serving on Port 3000");
});
