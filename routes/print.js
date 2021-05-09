// const express				= require('express'),
// 	  router				= express.Router(),
// 	  path					= require('path'),
// 	  pdfMake 				= require('../pdfmake/pdfmake'),
// 	  vfsFonts 				= require('../pdfmake/vfs_fonts'),
// 	  Record				= require('../models/record'),
// 	  passport				= require('passport'),
// 	  User					= require('../models/user');

// const coscholastic = ["Dance","Yoga","PT","ART","MPlanning","Music","GK","Life Skill"];

// // PDF MAKE SETUP
// 	pdfMake.vfs = vfsFonts.pdfMake.vfs;
// 	router.use(express.static(path.join(__dirname, 'public')));

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated())
// 		return next();
// 	res.redirect("/login");
// }

// function getGrade(total)
// {
// 	if(total>90 && total<=100)
// 		return("A1");
// 	if(total>80 && total<=90)
// 		return("A2");
// 	if(total>70 && total<=80)
// 		return("B1");
// 	if(total>60 && total<=70)
// 		return("B2");
// 	if(total>50 && total<=60)
// 		return("C1");
// 	if(total>40 && total<=50)
// 		return("C2");
// 	if(total>32 && total<=40)
// 		return("D");
// 	if(total>=0 && total<=32)
// 		return("E");	;
// }

// router.post("/print", isLoggedIn, (req,res) =>{
// 	Record.find({std: Number(req.body.std), sec: req.body.sec}, (err,recs) => {
// 		if(err)
// 			console.log(err);
// 		else
// 		{
// 			var records = [];
// 			for(var i=0; i<recs.length; i++)
// 				for(var j=0; j<recs[i].reports.length; j++)
// 					if(recs[i].reports[j]!=null)
// 						if(recs[i].reports[j].term==req.body.term)
// 							records.push(recs[i]);
// 			res.render("index/print",{records: records,term:req.body.term});	
// 		}
// 	});
// });

// router.get("/print/:admno/:term", isLoggedIn, (req,res) => {
// 	var body = [[{text: 'SCHOLASTIC',style: 'tableHeader',colSpan: 7,alignment: 'center',fillColor: '#cccccc'},{},{},{},{},{},{}],[{text: req.params.term,style: 'tableHeader',colSpan: 7,alignment: 'center',fillColor: '#cccccc'},{},{},{},{},{},{}],[{text: 'SUBJECTS',alignment: 'center',fontSize: 10,margin: [0,10,0,0]},{text: 'PERODIC TEST',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,10,0,0]},{text: 'NOTEBOOK SUBMISIION',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,4,0,0]},{text: 'SUBJECT ENRICHMENT',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,4,0,0]},{text: 'HALF YEARLY',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,10,0,0]},{text: 'MARKS OBTAINED',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,4,0,0]},{text: 'GRADE',alignment: 'center',fillColor: '#cccccc',fontSize: 10, margin: [0,10,0,0]}]];
	
// 	Record.findOne({admno: Number(req.params.admno)}, (err,record) => {
// 		if(err)
// 			console.log(err);
// 		else
// 		{
// 			var report = {}, notebook_total = 0, enrichment_total = 0, marks_total = 0, total_total = 0;
// 			for(var i = 0; i < record.reports.length; i++)
// 				if(record.reports[i]!=null)
// 					if(record.reports[i].term == req.params.term)
// 						report = record.reports[i];
// 			record.subjects.forEach(sub => {
// 				notebook_total+=Number(report.reports[sub].notebook);
// 				enrichment_total+=Number(report.reports[sub].enrichment);
// 				marks_total+=Number(report.reports[sub].marks);
// 				var total = Number(report.reports[sub].notebook)+Number(report.reports[sub].enrichment)+Number(report.reports[sub].marks);
// 				total_total+=Number(total);
// 				body.push([{text:sub, fontSize:10, bold: true},"",report.reports[sub].notebook,report.reports[sub].enrichment,report.reports[sub].marks, total,getGrade(total)]);
// 			});
// 			body.push(["total","",notebook_total,enrichment_total,marks_total,total_total,getGrade((total_total/(record.subjects.length*100))*100)]);
// 			body.push([{text:"Percentage", bold: true, fontSize: 9}, {text:"", colSpan:6}]);
// 			body.push([{text:"Sec Rank", bold: true, fontSize: 10}, {text:"", colSpan:6}]);
// 			body.push([{text:"Class Rank", bold: true, fontSize: 10}, {text:"", colSpan:6}]);
// 			var gradeBody = [[{bold: true, text:"CO-SCHOLASTIC (on a 3-points A-C grading scale)",colSpan:3, alignment:"center", fillColor:"#cccccc"},{},{}],[{bold: true, text:'S.No.'},{bold: true, text:'Activities', alignment:'center'},{bold: true, text:'GRADE', alignment:'center'}]];
// 			coscholastic.forEach((sub,i) => {gradeBody.push([i+1,{text:sub,alignment:"center"},{text:report.coscholastic[sub],alignment:"center"}]);});
// 			var dd = {
// 				content: [
// 					{text: 'GREEN FIELDS SCHOOL', style:'header', fontSize:25 , alignment:'center', bold: true},
// 					{text: 'A-2 Block, Safdarjung Enclave, India- 110029', style:'header', alignment:'center'},
// 					{text: 'Affiliation No. : 2730037', style:'header', alignment:'center'},
// 					{text: 'Phone : 01126101106', style:'header', alignment:'center'},
// 					{
// 						style:"tableExample",
// 						table:{
// 							widths:[510],
// 							body:[
// 								[{border:[true,true,true], text: 'STUDENT\'S ASSESSMENT REPORT', style:'header', alignment:'center', bold: true, fontSize: 15}],
// 								[{border:[true,false,true,true], text: 'Academic Session : 2019 - 2020', alignment:'center'}]
// 							]
// 						},
// 						margin: [0,2,0,5]
// 					},
// 					{
// 						style:"tableExample",
// 						table:{
// 							widths:[250,250],
// 							body:[
// 								[
// 									{
// 										border:[true,true,false,false],
// 										text: 'Student\'s Name:-    '+record.name,
// 										bold: true,
// 										fontSize: 10
// 									},
// 									{
// 										border:[false,true,true,false],
// 										text: 'Admission Number:-   '+record.admno,
// 										bold: true,
// 										fontSize: 10
// 									}
// 								],
// 								[
// 									{
// 										border:[true,false,false,true],
// 										text: 'Class/Section:-        '+record.std+'-'+record.sec,
// 										bold: true,
// 										fontSize: 10
// 									},
// 									{
// 										border:[false,false,true,true],
// 										text: 'Father\'s Name:-            Aman Bhasin',
// 										bold: true,
// 										fontSize: 10
// 									}
// 								]
// 							]
// 						},
// 						margin: [0,0,0,5]
// 					},
// 					{
// 						style:"tableExample",
// 						table:{
// 							heights: ['auto','auto',30],
// 							widths:[50,70,74,74,74,74,40],
// 							body: body
// 						}
// 					},
// 					{
// 						alignment: 'justify',
// 						columns: [
// 							[{
// 								style: 'tableExample',
// 								table: {
// 									body: [
// 										[{text:"ATTENDANCE",colSpan:5, alignment:"center", bold: true, fillColor:"#cccccc"},{},{},{},{}],
// 										['Particulars','Working Days','Present','Absent','Attendance Percentage'],
// 										['Half Yearly','','','','']
// 									]
// 								}
// 							},
// 							{
// 								style: 'tableExample',
// 								table: {
// 									widths:[80,94,86],
// 									heights: 20,
// 									body: gradeBody
// 								},
// 								margin: [0,10]
// 							}
// 							],
// 							[{

// 								style: 'tableExample',
// 								table: {
// 									body: [
// 										[{text:"SCHOLASTIC",colSpan:2, alignment:"center", bold: true, fillColor:"#cccccc"},{}],
// 										[{text:"GRADES ON 8 POINT GRADE SCALE",colSpan:2, alignment:"center", bold: true, fillColor:"#cccccc"},{}],
// 										[{text:"MARKS RANGE", alignment:"center", bold: true, fillColor:"#cccccc"},{text:"GRADE", alignment:"center", bold: true, fillColor:"#cccccc"}],
// 										[{text:'91-100',alignment:'center'},{text:'A1',alignment:'center'}],
// 										[{text:'81-90',alignment:'center'},{text:'A2',alignment:'center'}],
// 										[{text:'71-80',alignment:'center'},{text:'B1',alignment:'center'}],
// 										[{text:'61-70',alignment:'center'},{text:'B2',alignment:'center'}],
// 										[{text:'51-60',alignment:'center'},{text:'C1',alignment:'center'}],
// 										[{text:'41-50',alignment:'center'},{text:'C2',alignment:'center'}],
// 										[{text:'33-40',alignment:'center'},{text:'D',alignment:'center'}],
// 										[{text:'0-32',alignment:'center'},{text:'E',alignment:'center'}]
// 									]
// 								}
// 							},
// 							{
// 								style: 'tableExample',
// 								table: {
// 									widths:[80,94,86],
// 									heights: 20,
// 									body: [
// 										[{bold: true, text:"CO-SCHOLASTIC (on a 3-points A-C grading scale)",colSpan:3, alignment:"center", fillColor:"#cccccc"},{},{}],
// 										[{bold: true, text:'S.No.'},{bold: true, text:'Activities', alignment:'center'},{bold: true, text:'GRADE', alignment:'center'}]
// 									]
// 								},
// 								margin: [0,10]
// 							}
// 							]
// 						]
// 					}
// 				]
// 			};
// 			const pdfDoc = pdfMake.createPdf(dd);
// 			pdfDoc.getBase64((data)=>{
// 				res.writeHead(200, 
// 				{
// 					'Content-Type': 'application/pdf',
// 					'Content-Disposition':'attachment;filename="filename.pdf"'
// 				});

// 				const download = Buffer.from(data.toString('utf-8'), 'base64');
// 				res.end(download);
// 			});
// 		}
// 	});	
// });

// module.exports = router;