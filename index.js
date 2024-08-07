const express = require('express');
const app = express()
const ejs = require('ejs');
const mongoose = require('mongoose');
// const expressSession = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const Product = require('./models/Product');




// require('dotenv').config();
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({extended:false}));
// app.use(express.json());

// app.use(expressSession({
//     secret: "node secret", 
//     saveUninitialized: true,
//     resave: false,
//  })
//  );

require('dotenv').config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(
//   expressSession({
//     secret: process.env.SESSION_SECRET || 'default_secret',
//     saveUninitialized: true,
//     resave: false,
//   })
// );

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  secret: 'keyboard cat',
  saveUninitialized: false, // Add this line
}))

 app.set('view engine','ejs')

 app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;  // <-- Corrected: 'message' instead of 'massage'
  next();
});


mongoose.Promise = global.Promise;

//database1
// const db = mongoose.connection;
// db.on('error',(error)=>console.log(error));
// db.once('open',()=>console.log('Database Already'))

// //connectdatabase
// mongoose.connect('mongodb+srv://nicekrubma10:kulab12345@cluster0.uqjxafb.mongodb.net/?retryWrites=true&w=majority',
// {useNewUrlParser: true})


// app.listen(3000,() => {
//     console.log("App listening on port 3000")
// })

//database2
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Already'));
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nicekrubma10:kulab12345@cluster0.uqjxafb.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
});

app.use(express.static('public'))
app.use(flash())
global.loggedIn = null
app.use("*",(req,res,next)=>{
    loggedIn = req.session.userId
    next()
})


//require
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')
const homeController = require('./controllers/homeController')
const errorController = require('./controllers/errorController')
const productController = require('./controllers/productController')
const employeeController = require('./controllers/employeeController')
const index_productController = require('./controllers/index_productController')
const orderController = require('./controllers/orderController')
const rawController = require('./controllers/rawController')
const editprofileUController  = require('./controllers/editprofileUController');
const editprofileAController  = require('./controllers/editprofileAController');
const editproductUController  = require('./controllers/editproductUController');
const editrawUController  = require('./controllers/editrawUController');
const bomController = require('./controllers/bomController');

//middleware
const redirectAuth = require('./middleware/redirectAuth')
const authMiddleware = require('./middleware/authMiddleware')

//get directory
// app.get('/', indexController) test
app.get('/index',indexController)
app.get('/', loginController)
app.get('/home',authMiddleware,homeController)
app.get('/login', redirectAuth,loginController)
app.get('/employee',authMiddleware,employeeController)
app.post('/user/login', redirectAuth,loginUserController)
app.get('/error',errorController)
app.get('/logout',logoutController)
app.get('/index_product',authMiddleware,index_productController)
app.get('/product',authMiddleware,productController)
app.get('/order',authMiddleware,orderController)
app.get('/raw',authMiddleware,rawController)
app.get('/bom',authMiddleware,bomController)
app.get('/raw',authMiddleware,rawController)

//editpage (post)
app.post('products/editU',authMiddleware,editproductUController)
app.post('raws/editU',authMiddleware,editrawUController)

//editpage (get)
app.get('/editproductU',authMiddleware,editproductUController)
app.get('/editprofileA',authMiddleware,editprofileAController)
app.get('/editprofileU',authMiddleware,editprofileUController)
app.get('/editrawU',authMiddleware,editrawUController)


//get user
// app.get('/editproductU',authMiddleware,productUController)

//Api add Products
const products = require('./routes/products')
app.use('/products',products);

const typepros = require('./routes/typepros')
app.use('/typepros',typepros);


//Api add User
const users = require('./routes/users')
app.use('/users',users);

//Api add Raw
const raws = require('./routes/raws')
app.use('/raws',raws);


