// Task1: initiate app and run server at 3000

const express = require('express');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

app.listen(PORT,()=>{
    try{
        console.log(`Server is running on ${PORT}`);
    }catch(error){
        console.log(`Sever cannot be reached`)
    }      
})

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 

const mongoose = require('mongoose');

const ConnectionString = process.env.connectionString;
mongoose.connect(ConnectionString)
.then(()=>{
    console.log("Connection to Database is successful");
})
.catch((error)=>{
    console.log(`Cannot connect to Database ${error.message}`);
})

const Schema = mongoose.Schema({
    name:String,
    location:String,
    position:String,
    salary:Number
});

const documentData = mongoose.model('employeedetails',Schema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));

app.use('/api',router);

//TODO: get data from db  using api '/api/employeelist'

router.get("/employeelist", async (req, res) => {
    try {
        const data = await documentData.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json("Cannot /GET data");
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'

router.get("/employeelist/:id",async (req,res) => {
    let id=req.params.id;
    try{
        const data = await documentData.findById(id);
        res.status(200).json(data);
    }catch(error){
        res.status(400).json("Cannot /GET data");
    }
})


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

router.post("/employeelist",async (req,res)=>{
    try{
        const item = req.body;
        const newdata = new documentData(item);
        const saveData = await newdata.save();
        res.status(200).json("POST Successful");
        console.log(req.body)
    }catch(error){
        res.status(400).json("Cannot /POST data");
        console.log(`Cannot POST data`);
    }
})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

router.delete("/employeelist/:id",async (req,res)=>{
    const _id = req.params.id;
    console.log(_id)
    try{
        const deleteOne = await documentData.findByIdAndDelete({_id});
        res.status(200).json("DELETE Successful");
        console.log(`DELETE Successful`);
    }catch(error){
        res.status(400).json("Cannot /DELETE data")
        console.log(`Cannot delete data`);
    }
})


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

router.put("/employeelist", async (req,res)=>{
    try{
        const index = req.body._id;
        const modifyData = await documentData.findOneAndUpdate(
            { "_id": index },
            { $set: { "name": req.body.name, "location": req.body.location, "position": req.body.position, "salary": req.body.salary } }
          );
        res.json(modifyData);
    }catch(error){
        res.status(400).json("Cannot /UPDATE data")
    }
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



