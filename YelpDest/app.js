var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    Destination     = require("./models/destination"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
//Requiring Routes
var destinationRoutes = require("./routes/destinations"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/auth");


mongoose.connect("mongodb://localhost/yelp_dest");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
// seedDB(); seed the database


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Programming is awesome!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//This passes the user info to every route
app.use(function(req, res ,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", authRoutes);
app.use("/destinations", destinationRoutes);
app.use("/destinations/:id/comments", commentRoutes);


//Cloud 9 hosting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELPDEST SERVER HAS STARTED!");
});