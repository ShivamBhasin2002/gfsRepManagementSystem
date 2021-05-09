const express 			= require('express'),
	  mongoose			= require('mongoose'),
	  bodyParser		= require('body-parser'),
	  methodOverride	= require('method-override'),
	  path				= require('path'),
	  passport			= require('passport'),
	  LocalStrategy		= require('passport-local'),
	  Record			= require('./models/record'),
	  User				= require('./models/user'),
	  pdfMake 			= require('./pdfmake/pdfmake'),
	  vfsFonts 			= require('./pdfmake/vfs_fonts'),
	  recordsRoutes		= require('./routes/records'),
	  reportsRoutes		= require('./routes/reports'),
	  printRoutes		= require('./routes/print'),
	  indexRoutes		= require('./routes/index'),
	  app				= express();

// APP CONFIG
	app.use(express.static('public'));
	app.set("view engine","ejs");
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(methodOverride("_meth"));

// MONGO SETUP
	mongoose.set('useCreateIndex', true);
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useFindAndModify', false);
	mongoose.connect(process.env.DATABASEURL || "mongodb://localhost:27017/GFS",{useNewUrlParser: true, useUnifiedTopology: true});

// PDF MAKE SETUP
	pdfMake.vfs = vfsFonts.pdfMake.vfs;
	app.use(express.static(path.join(__dirname, 'public')));

//  USER AUTHENTICATION SETUP
	app.use(require('express-session')({
		secret: "Try Me Bitch",
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new  LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

// USING ROUTES
	app.use(recordsRoutes);
	app.use(reportsRoutes);
	// app.use(printRoutes);
	app.use(indexRoutes);

//LISTENS FOR CALLS TO THE WEBSITE
app.listen(process.env.PORT || 3000,process.env.IP,() => {
	console.log(process.env.PORT || 3000);
	console.log("!!SERVER STARTED!!");
});