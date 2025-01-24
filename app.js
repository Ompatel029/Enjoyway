const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require('path')
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Enjoyway"
const Review = require('./models/review.js')
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs", ejsMate); 

const sessionOptions = {
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
  console.log(err)
})
    async function main(){
      await mongoose.connect(MONGO_URL);
    }
    app.get('/',(req,res) => {
      res.send("app is work")
  })
app.use((req,res,next) =>{  
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// const validateListing = (req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//         if(error){
//         throw new ExpressError(400, result.error)
//     }
//     else{
//         next();
//     }
// }
// app.get('/testListing',async (req,res) => {
//     let sample = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price:30000,
//     location: "goa beach",
//     country: "india",
//   })
//   await sample.save();
//   console.log("sample was saved")
//   res.send("succesfully saved")
// })
// app.all("*",(req,res,next) =>{
//     next(new ExpressError(404,"Page Not Found!"))
//     res.render("error.ejs",{message})

// })
//Error handling
// app.use((err, req, res, next) =>{
//     let {statusCode=500, message="Something Went wrong"} = err;
//     res.render("error.ejs",{message})
//     //res.status(statusCode).send(message)
//  res.send("something went wrong please fill form ae per required!");
// })


app.listen(3000,()=>{
    console.log("server is listing on 8080")
}) 