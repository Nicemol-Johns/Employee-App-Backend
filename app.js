// Task1: initiate app and run server at 3000

const express = require('express');                                           //import express
const app = express();                                                        //create express application

require("dotenv").config();                                                   //import dotenv and load environment variables from .env
const PORT = process.env.PORT;                                                //assign the PORT at which server is initialised

app.listen(PORT,()=>{                                                         //initialise the server @ PORT
    try{
        console.log(`Server is running on ${PORT}`);                          //log success message if server is initalised
    }catch(error){
        console.log(`Sever cannot be reached`)                                //log error message if server is not initialised
    }      
})

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 

const mongoose = require('mongoose');                                         //import mongoose to connect to mongoDB

const ConnectionString = process.env.connectionString;                        //assign CONNECTION STRING value from .env file
mongoose.connect(ConnectionString)                                            //connect to MongoDB Atlas using the connection string
.then(()=>{                                                                   //log success message if connection is successful
    console.log(`Connection to Database is successful`);
})
.catch((error)=>{
    console.log(`Cannot connect to Database ${error.message}`);               //log failure message if connection failed
})

const Schema = mongoose.Schema({                                              //create schema for the collection
    name:{
        type:String,                                                          //name is string type and cannot be empty
        required:true
    },
    location:{
        type:String,                                                          //location is string and cannot be empty
        required:true
    },
    position:{
        type:String,                                                          //position is string and cannot be empty
        required:true
    },
    salary:{                                                                  //salary is number type and field cannot be empty
        type:Number,
        require:true
    }
});

const documentData = mongoose.model('employeedetails',Schema);                //create a model and schema is applied to the collection

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

const router = express.Router();                                              //import Router for GET, POST, PUT, DELETE methods
router.use(express.json());                                                   //parse to valid json
router.use(express.urlencoded({extended:true}));                              //parse urlencoded format in req.body

app.use('/api',router);                                                       //binding middleware to express application

//TODO: get data from db  using api '/api/employeelist'

router.get("/employeelist", async (req, res) => {                             //GET request 
    try {
        const data = await documentData.find();                               //wait till the documents are loaded
        res.status(200).json(data);                                           //if success then STATUS = 200
    } catch (error) {
        res.status(400).json("Cannot /GET data");                             //if error then STATUS = 400
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'

router.get("/employeelist/:id",async (req,res) => {                           //GET a single document
    let id=req.params.id;                                                     //get the id of the document
    try{
        const data = await documentData.findById(id);                         //wait till the document is fetched using Id
        res.status(200).json(data);                                           //if success then status = 200
    }catch(error){
        res.status(400).json("Cannot /GET data");                             //if error then STATUS = 400
    }
})


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

router.post("/employeelist",async (req,res)=>{                                //POST request 
    try{
        const item = req.body;                                                //assign the body of request to a variable
        const newdata = new documentData(item);                               //create a new instance of model and instantiate with the values
        const saveData = await newdata.save();                                //wait till the document is saved
        res.status(200).json("POST Successful");                              //if success then STATUS = 200
        console.log(req.body)                                                 //console the new json data
    }catch(error){
        res.status(400).json("Cannot /POST data");                            //if error then STATUS = 400
        console.log(`Cannot POST data`);                                      //console error message
    }
})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

router.delete("/employeelist/:id",async (req,res)=>{                          //DELETE request
    const _id = req.params.id;                                                //get the id of document
    try{
        const deleteOne = await documentData.findByIdAndDelete({_id});        //wait till the document is deleted
        res.status(200).json("DELETE Successful");                            //if success, STATUS = 200
        console.log(`DELETE Successful`);                                     //console the message
    }catch(error){
        res.status(400).json("Cannot /DELETE data")                           //if error, STATUS = 400
        console.log(`Cannot delete data`);                                    //console error message
    }
})


//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

router.put("/employeelist", async (req,res)=>{                                //PUT request
    try{
        const index = req.body._id;                                           //get the id of document
        const {name,location,position,salary} = req.body;                     //get the fields of the document

        if (!name || !location || !position || !salary) {                     //check if the fields are empty 
            return res.status(400).json("Empty Field");                       //return error if true
        }
                                                                              //executes if the 'if' condition is false
        const modifyData = await documentData.findOneAndUpdate(               //find the document with id and update the fields
            { "_id": index },
            { $set: { "name": name, "location": location, "position": position, "salary": salary } }
          );

        res.status(200).json(modifyData);                                     //if success, then STATUS = 200
    }catch(error){
        res.status(400).json("Cannot /UPDATE data")                           //if error, then STATUS = 400
    }
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



