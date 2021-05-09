const express			= require('express'),
	  router			= express.Router(),
	  Record			= require('../models/record'),
	  passport			= require('passport'),
	  User				= require('../models/user'),
	  Report			= require('../models/reports');


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

// INDEX ROUTE
router.get("/", isLoggedIn, (req,res) => {
	res.render("landing",{hidden: "hidden", msg: ""});
});

//======================================================PROMOTE ROUTE=========================================================//
router.get("/promote", isLoggedIn, (req,res) => {
	res.render("index/promote");
});
router.put("/promote", isLoggedIn, (req,res) => {
	req.body.admnos.forEach(admno => {
		Record.countDocuments({admno: admno}, (err,count) => {
			if(count===1)
			{
				Record.findOne({admno: Number(admno)}, (err,record) => {
					record.std = Number(req.body.std);
					record.sec = req.body.sec;
					Record.create(record);
				});
				Report.deleteMany({admno: Number(admno)});
			}
		});
	});
	setTimeout(() => { res.redirect("/records/"+req.body.std+"/"+req.body.sec); }, 1500);
});

//======================================================AUTH ROUTES===============================================================//
router.get("/register", isLoggedIn, (req,res) => {
	res.render("index/register");
});
router.post("/register", isLoggedIn, (req,res) => {
	User.register(new User({username: req.body.username}),req.body.password, (err,user) => {
		if(err){
			console.log(err);
			return res.render("index/register");
		}
		passport.authenticate("local")(req,res,()=>{
			res.redirect("/");
		});
	});
});
router.get("/login", (req,res) => {
	res.render("index/login");
});
router.post("/login", passport.authenticate("local", {successRedirect: "/", faliureRedirect: "/login"}), (req,res) =>{});

router.get("/logout", isLoggedIn, (req,res) => {
	req.logout();
	res.redirect("/login")
});

//REDIRECT TO HOMEPAGE FOR ALL THE ROUTES
router.get("*", (req,res) => {
	res.redirect("/");
});

module.exports = router;