if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log(process.env.SECRECT)
console.log(process.API_KEY)
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
// const Joi = require('joi');
const passport = require('passport');
const LocalStratrgy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require ('connect-mongo');(session);
// const helmet = require ('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true,})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
})


app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecrect!';
const store = new MongoDBStore({
    mongoUrl:dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e){
    console.log("SESSION STORE ERROR",e )
})
const sessionConfig = {
    store,
    name:'session',
    secret,
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now() + 1000 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
//   );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratrgy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{

    res.locals.currentUser = req.user;
res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
next();
})
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('Home')
});


app.all('*',(req,res,next)=>{
next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500}= err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
   
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});
