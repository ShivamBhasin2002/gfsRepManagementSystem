const express			= require('express'),
	  router			= express.Router(),
	  Record			= require('../models/record'),
	  passport			= require('passport'),
	  User				= require('../models/user');

const order = ["ENGLISH","HINDI","MATHS","SOCIAL STUDIES","SCIENCE","QUANTUM MECHANICS","ASTROPHYSICS"];
const coscholastic = ["Dance","Yoga","PT","ART","MPlanning","Music","GK","Life Skill"];

function rearrange(arr){
	var rearr = [], k=0;
	for(var i=0; i < order.length; i++)
	{
		for(var j=0; j < arr.length; j++)
			if(order[i] == arr[j])
				rearr[k++] = arr[j];
	}
	return(rearr);
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

// NEW ROUTE
router.get("/records/new", isLoggedIn, (req,res) => {
	res.render("records/new", {subjects: order, message:"", clas: "hidden"});				//RENDERS THE NEW INPUT PAGE FORM
});



// CREATE ROUTE
router.post("/records/create", isLoggedIn, (req,res) => {
	req.body.record.subjects = rearrange(req.body.record.subjects);
	Record.countDocuments({admno: req.body.record.admno}, (err,count) => {					//COUNTS THE NUMBER OF DOCUMENTS PRESENT WITH THE
		if(count===0)																			//ENTERED ADMISSION NUMBER
		{
			Record.create(req.body.record, (err,record) => {
				if(err)
					console.log(err);
				else
					res.redirect("/records/"+record.admno);									//REDIRECT AFTER SUBMITTING THE RECORD
			});
		}
		else
			res.render("records/new",{subjects: order, message: "A Record Wtih Admission Number Already exists", clas:""});
																							//RENDER IF THE RECORD IS DUPLICATE
	});
});


// EDIT ROUTE
router.post("/records/edit", isLoggedIn, (req,res) => {
	res.redirect("/records/"+req.body.admno+"/edit");
});
router.get("/records/:admno/edit", isLoggedIn, (req,res) => {
	Record.countDocuments({admno: Number(req.params.admno)}, (err,count) => {					//COUNTS THE NUMBER OF DOCUMENTS PRESENT WITH THE
		if(count===1)																			//ENTERED ADMISSION NUMBER
		{
			Record.findOne({admno: Number(req.params.admno)}, (err,record) => {
				if(err)
					console.log(err);
				else
					res.render("records/edit",{record: record, subjects: order});
			});
		}
		else
			res.render("landing",{hidden: "", msg: "The Required Record Does Not Exist"});		//RENDERS MESSAGE THAT RECORD DOES NOT EXISTS
	});
});



// SHOW ROUTE
router.post("/records/show", isLoggedIn, (req,res) => {														//SHOW REQUEST FOR A WHOLE CLASS
	res.redirect("/records/" + req.body.std + "/" + req.body.sec);
});
router.get("/records/:admno", isLoggedIn, (req,res) => {														//SHOW REQUEST FOR A SINGLE RECORD
	Record.find({admno: Number(req.params.admno)}, (err,record) => {
		if(err)
			console.log(err);
		else
			res.render("records/show", {records: record});
	});
});
router.get("/records/:std/:sec", isLoggedIn, (req,res) => {													//RENDERS THE RECORDS OF THE WHOLE CLASS
	Record.find({std: Number(req.params.std), sec: req.params.sec}).collation({locale:'en',strength: 2}).sort({name: 1}).exec((err,record) => {
		if(err)
			console.log(err);
		else
			res.render("records/show", {records: record});
	});
});



// UPDATE ROUTE
router.put("/records/:admno", isLoggedIn, (req,res) => {														
	req.body.record.subjects = rearrange(req.body.record.subjects);
	Record.findOneAndUpdate({admno: Number(req.params.admno)}, req.body.record, (err,record) => {
		if(err)
			console.log(err);
		else
			res.redirect("/records/"+record.admno);												//RENDERS THE UPDATED RECORD
	});
});



// DESTROY ROUTE
router.delete("/records/:admno", isLoggedIn, (req,res) => {
	Record.findOneAndRemove({admno: Number(req.params.admno)}, (err,record) => {
		res.redirect("/records/"+record.std+"/"+record.sec);									//RENDERS RECORDS OF CLASS OF THE DELETED RECORD
	});
});



// SUBJECTS UPDATE ROUTE
router.get("/subjects", isLoggedIn, (req,res) => {
	res.render("records/sub_edit", {subjects: order});
});
router.put("/subjects", (req,res) => {
	req.body.subjects = rearrange(req.body.subjects);
	Record.updateMany({std: Number(req.body.std), sec: req.body.sec},{subjects: req.body.subjects},(err,record) => {
		if(err)
			console.log(err);
		else
			res.redirect("/records/" + req.body.std + "/" + req.body.sec);						//RENDERS THE RECORDS OF THE WHOLE CLASS
	});
});

module.exports = router;