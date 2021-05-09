const express 			= require('express'),
	  router			= express.Router(),
	  Record			= require('../models/record'),
	  Report			= require('../models/reports'),
	  passport			= require('passport'),
	  User				= require('../models/user');

const order = ["ENGLISH","HINDI","MATHS","SOCIAL STUDIES","SCIENCE","COMPUTER SCIENCE","ART","GK/L-SKILL"];
const coscholastic = ["PT","LIBRARY","YOGA","MUSIC","DANCE","MEAL PLANNING"];

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

function assignRank(std,sec,term)
{
	Report.find({std: Number(std), sec: sec, term: term}, (err,report) => {
		for(var i=0; i < report.length; i++)
		{
			for(var j=0; j < report.length-1; j++)
				if(report[j].per<report[j+1].per)
				{
					var swap = report[j];
					report[j] = report[j+1];
					report[j+1] = swap;
				}
		}
		for(var i=0; i < report.length; i++)
		{
			report[i].secRank = i+1;
			Report.create(report[i]);
		}
	});
	Report.find({std: Number(std), term: term}, (err,report) => {
		for(var i=0; i < report.length; i++)
		{
			for(var j=0; j < report.length-1; j++)
				if(report[j].per<report[j+1].per)
				{
					var swap = report[j];
					report[j] = report[j+1];
					report[j+1] = swap;
				}
		}
		for(var i=0; i < report.length; i++)
		{
			report[i].classRank = i+1;
			Report.create(report[i]);
		}
	});
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
}

// NEW ROUTE
router.post("/reports/new", isLoggedIn, (req,res) => {
	Record.countDocuments({admno: Number(req.body.admno)}, (err,count) => {							//COUNTS THE NUMBER OF DOCUMENTS PRESENT WITH THE
		if(count==1)																				//ENTERED ADMISSION NUMBER
			Report.countDocuments({admno: Number(req.body.admno), term: req.body.term.toUpperCase()}, (err,count) => {
				if(count==0)
					res.redirect("/reports/new/"+req.body.admno+"/"+req.body.term.toUpperCase());
				else
					res.render("landing",{hidden: "", msg: "There Already Exists A Similar Report"});
																						//RENDERS MESSAGE THAT NO SUCH RECORD EXISTS
			});
		else
			res.render("landing",{hidden: "", msg: "There Exists No Such Record, Enter The Record Before Entering Report"});
																				//RENDERS MESSAGE THAT NO SUCH RECORD EXISTS
	});
});
router.get("/reports/new/:admno/:term", isLoggedIn, (req,res) => {
	Record.findOne({admno: Number(req.params.admno)}, (err,record) => {
		if(err)
			console.log(err);
		else
			res.render("reports/new",{record: record, term: req.params.term, co: coscholastic});
	});
});



// CREATE ROUTE
router.post("/reports/create", isLoggedIn, (req,res) => {
	Record.findOne({admno: Number(req.body.report.admno)}, (err,record) => {
		if(err)
			console.log(err);
		else
		{
			var report = req.body.report;
			var num=0,den=0;
			record.subjects.forEach(sub => {
				if((record.std<=8)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
				{
					num += Number(report.reports[sub].notebook) + Number(report.reports[sub].enrichment);
					den += Number(report.total[sub].notebook) + Number(report.total[sub].enrichment);
				}
				else if((record.std>10 && record.std<=12)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
				{
					num += Number(report.reports[sub].practical);
					den += Number(report.total[sub].practical);
				}
				num += Number(report.reports[sub].marks);
				den += Number(report.total[sub].marks);
			});
			report.per = Number(Number.parseFloat((num*100)/den).toFixed(1));
			Report.create(report);
			setTimeout(assignRank,5000,record.std,record.sec,report.term);
			res.redirect("/reports/show/"+record.std+"/"+record.sec+"/"+report.term);
		}
	});
});



// EDIT ROUTE
router.post("/reports/edit", isLoggedIn, (req,res) => {
	Report.findOne({admno: req.body.admno, term:req.body.term.toUpperCase()}, (err,report) => {
		if(err)
			console.log(err);
		else
		{
			if(report==undefined)
				res.render("landing",{hidden:"", msg: "No Such Report Exists"});		//RENDERS MESSAGE THAT NO SUCH REPORT EXISTS
			else
				res.redirect("/reports/"+req.body.admno+"/"+req.body.term.toUpperCase()+"/edit");
		}
	});
});
router.get("/reports/:admno/:term/edit", isLoggedIn, (req,res) => {
	Record.findOne({admno: Number(req.params.admno)}, (err,record) => {
		if(err)
			console.log(err);
		else
		{
			Report.findOne({admno: record.admno, term: req.params.term}, (err,report) => {
				res.render("reports/edit",{record: record, term: req.params.term, report: report, co: coscholastic});	//RENDERS THE EDIT PAGE
			});
		}
	});
});



// UPDATE ROUTE
router.put("/reports/:admno/:term", isLoggedIn, (req,res) => {
	Record.findOne({admno: Number(req.params.admno)}, (err,record) => {
		Report.deleteOne({admno: record.admno, term: req.params.term}, (err,report) => {
			if(err)
				console.log(err);
		});
		report=req.body.report;
		var num=0,den=0;
		record.subjects.forEach(sub => {
			if((record.std<=8)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
			{
				num += Number(report.reports[sub].notebook) + Number(report.reports[sub].enrichment);
				den += Number(report.total[sub].notebook) + Number(report.total[sub].enrichment);
			}
			else if((record.std>10 && record.std<=12)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
			{
				num += Number(report.reports[sub].practical);
				den += Number(report.total[sub].practical);
			}
			num += Number(report.reports[sub].marks);
			den += Number(report.total[sub].marks);
		});
		report.per = Number(Number.parseFloat((num*100)/den).toFixed(1));
		Report.create(report);
		setTimeout(assignRank,5000,record.std,record.sec,report.term);
		setTimeout((res,record,report)=>{
			res.redirect("/reports/show/"+record.std+"/"+record.sec+"/"+report.term);
		},1000,res,record,report);
	});
});


//SHOW REPORT
router.post("/reports", isLoggedIn, (req,res) => {
	res.redirect("/reports/show/"+req.body.std+"/"+req.body.sec+"/"+req.body.term.toUpperCase());
});
router.get("/reports/show/:std/:sec/:term", isLoggedIn, (req,res) => {
	Record.find({std: Number(req.params.std), sec: req.params.sec}).collation({locale:'en',strength: 2}).sort({name: 1}).lean().exec((err,records) => {
		if(err)
			console.log(err);
		else
			if(records!=undefined)
			{
				var recs = records;
				Report.find({std: Number(req.params.std), sec: req.params.sec, term: req.params.term}, (err,reps) => {
					if(reps[0]!=undefined)
					{
						for(var i=0; i < recs.length; i++)
							for(var j=0; j < reps.length; j++)
								if(recs[i].admno==reps[j].admno)
								{
									recs[i].report=reps[j];
								}
						for(var i=0; i < recs.length; i++)
							if(recs[i].report==undefined)
								recs[i]=undefined;
						recs = recs.filter(rec => rec!==undefined);
						var csub = [];
						for(var i=0; i<recs.length; i++){
							for( var j = 0; j < recs[i].subjects.length; j++)
							{
								if(!(csub.includes(recs[i].subjects[j])))
									csub.push(recs[i].subjects[j]);
							}
						}
						csub = rearrange(csub);
						var total = {};
						for(var i=0; i < csub.length; i++)
							for(var j=0; j < reps.length; j++)
								if(reps[j].total[csub[i]]!=undefined && reps[j].total[csub[i]].marks!=0)
								{
									total[csub[i]]=reps[j].total[csub[i]];
									break;
								}
						res.render("reports/show", {records: recs, term: req.params.term, subjects: csub, co: coscholastic, sec: req.params.sec, std: req.params.std, total: total});
					} else{
						res.render("landing",{hidden:"", msg: "No Such Report Exists"});		//RENDERS MESSAGE THAT NO SUCH REPORT EXISTS
					}
				});
			} else{
				res.render("landing",{hidden:"", msg: "No Such Report Exists"});		//RENDERS MESSAGE THAT NO SUCH REPORT EXISTS
			}
	});
});


//CLASS REPORT
router.post("/classreport/new", isLoggedIn, (req,res) => {
	res.redirect("/classreport/new/" + req.body.std + "/" + req.body.sec + "/" + req.body.term.toUpperCase());
});
router.get("/classreport/new/:std/:sec/:term", isLoggedIn, (req,res) => {
	Record.find({std: Number(req.params.std), sec: req.params.sec}).collation({locale:'en',strength: 2}).sort({name: 1}).exec((err,records) => {
		if(err)
			console.log(err);
		else
		{
			if(records!=undefined)
			{
				Report.find({std: Number(req.params.std), sec: req.params.sec},(err,report)=>{
					for(var i=0; i<records.length; i++)
					{
						for(var j=0; j<report.length; j++)
							if(report[j]!=undefined)
								if(report[j].admno==records[i].admno && report[j].term==req.params.term)
								{
									for(var e=i; e<records.length-1; e++)
									{
										var swap = records[e];
										records[e] = records[e+1];
										records[e+1] = swap;
									}
									records.pop();
								}
					}
					var csub = [];
					for(var i=0; i<records.length; i++){
						for( var j = 0; j < records[i].subjects.length; j++)
						{
								if(!(csub.includes(records[i].subjects[j])))
									csub.push(records[i].subjects[j]);
						}
					}
					csub = rearrange(csub);
					res.render("reports/classreport", {records: records, term: req.params.term, subjects: csub, co: coscholastic, sec: req.params.sec, std: req.params.std});
				});
			} else{
				res.render("landing",{hidden:"", msg: "No Such Records Exists"});		//RENDERS MESSAGE THAT NO SUCH REPORT EXISTS
			}
		}
	});
});
router.post("/classreport/create", isLoggedIn, (req,res) => {
	req.body.report.forEach(report => {
		Record.findOne({admno: Number(report.admno)}, (err,record) => {
			if(err)
				console.log(err);
			else
			{
				var flag;
				for(var i =0; i < record.subjects.length; i++)						//CHECKS THAT IF THE REPORT HAS BEEN ENTERED OR NOT
					if(report.reports[record.subjects[i]].marks != 0)
						flag = true;
				if(flag)
				{
					report.total = req.body.total;
					var num=0,den=0;
					record.subjects.forEach(sub => {
						if((record.std<=8)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
						{
							num += Number(report.reports[sub].notebook) + Number(report.reports[sub].enrichment);
							den += Number(report.total[sub].notebook) + Number(report.total[sub].enrichment);
						}
						else if((record.std>10 && record.std<=12)&&(req.body.report.term=="SA1" || req.body.report.term=="SA2"))
						{
							num += Number(report.reports[sub].practical);
							den += Number(report.total[sub].practical);
						}
						num += Number(report.reports[sub].marks);
						den += Number(report.total[sub].marks);
					});
					report.per = Number(Number.parseFloat((num*100)/den).toFixed(1));
					Report.create(report);
				}
			}
		});
	});
	setTimeout(assignRank,5000,req.body.std,req.body.sec,req.body.term);
	setTimeout((res,std,sec,term)=>{
		res.redirect("/reports/show/"+std+"/"+sec+"/"+term);
	},2000,res,req.body.std,req.body.sec,req.body.term);
});

//PRINT REPORT
router.post("/print", (req,res) => {
	Report.count({std: Number(req.body.std), sec: req.body.sec}, (err,count) =>{
		if(err)
			console.log(err);
		else
			if(count!=0)
				res.redirect("/print/"+req.body.std+"/"+req.body.sec+"/"+req.body.term);
			else
				res.render("landing",{hidden: "", msg: "No Such Reports Exist"});
	});
});
router.get("/print/:std/:sec/:term", (req,res) => {
	Record.find({std: Number(req.params.std), sec: req.params.sec}, (err,recs) => {
		res.render("reports/print",{records: recs, term: req.params.term});
	});
});
module.exports = router;