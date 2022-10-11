//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://milandsharma:<"enter your password">@cluster0.iypepdn.mongodb.net/logDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

let error = "";
let success = ""; 

const date = new Date();
const logSchema = new mongoose.Schema({
    customerName: String,
    address: String,
    tel: Number,
    billNo: Number,
    amount: Number,
    received: Number,
    receivedDate: String,
    date: String
});
const Log = mongoose.model("Log", logSchema);

app.get("/", function (req, res) {
    res.render("home", {
        date: date.toDateString()
    });
});
app.get("/log", (req, res) => {
    Log.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render("log", {
                Log: foundItems,
                success:success
            });
        }
    });
});


app.post("/", function (req, res) {
    const CustomerName = req.body.customerName;
    const Address = req.body.address;
    const tel = req.body.tel;
    const BillNo = req.body.billNo;
    const Amount = req.body.amount;
    const received = req.body.received;
    const receivedDate = req.body.receivedDate;

    const log = new Log({
        customerName: CustomerName,
        address: Address,
        tel: tel,
        billNo: BillNo,
        amount: Amount,
        received: received,
        receivedDate: receivedDate,
        date: date.toDateString().slice(3, 16)
    });
    Log.insertMany([log], function (err) {
        if (err) {
            console.log(err);

        } else {
            console.log("Successfully added");
        }
    });
    res.redirect("/log");
});


app.get("/update", (req, res) => {
    res.render("update", {
        Date: date.toDateString().slice(3, 16),
        error: error
    });
});

app.get("/error",(req,res)=>{
    res.render("error");
});

app.post("/update", function (req, res) {
    const BillNo = Number(req.body.billNo);
    const updateReceived = Number(req.body.received);
    const updateReceivedDate = req.body.receivedDate;

    Log.find({billNo:BillNo},(err,log)=>{
        if (err){
            console.log(err);
            
        }else{
            if (log.length===0){
                error="Enter valid bill number";
                res.redirect("/update");
            }else{
                let updateAmount = log[0].amount - log[0].received;
            Log.updateOne({billNo:BillNo},{amount:updateAmount},function(err){
                if (err){
                    console.log(err);
                }else{
                    console.log("amount is updated successfully");
                }
            });   
            }
             
        }
    });
    Log.updateMany({billNo:BillNo},{received:updateReceived},{receivedDate:updateReceivedDate},function(err){
        if (err){
            console.log(err);
        }else{
            console.log("update successfully");
            Log.find({billNo:BillNo},(err,log)=>{
                if(err){
                    console.log(err);
                }else{
                    if(log.length === 0){
                        error="No such bill number";
                    }else{
                        success="Updated successfully";
                        res.redirect("/log");
                       
                    }
                }
            });

            
        }
    });
});






app.listen(3000, function () {
    console.log("Server started on port 3000");
});
