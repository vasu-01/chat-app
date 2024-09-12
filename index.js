const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat = require("./models/chats.js");//requiring our chats.js file where constraints are defined from models directory
const methodOverride = require("method-override");
const ExpressError=require("./ExpressError.js");
const { nextTick } = require("process");

//setting or constructing path to use templates/ejs files from views folder
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//creating and checking for connection
main()
.then((res)=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');//establishing connection
}

//insering new and first data
// let chat1=new Chat({
//     from:"vasu",
//     to:"nishant",
//     msg:"send me your pic",
//     created_at:new Date()
// });
// chat1.save()//saving data
// .then((res)=>{
//     console.log(res);
// })
// .catch((err)=>{
//     console.log(err);
// });


//Index Route or Main page 
app.get("/chats",asyncWrap(async (req,res)=> {
        let chats=await Chat.find();
        // console.log(chats);
        res.render("index.ejs",{chats});
}));


//New Route to access page for creating new post
app.get("/chats/new",(req,res)=>{
    throw new ExpressError(404,"Page not found");
    res.render("new.ejs");
});
//Create Route for posting the entered data into their places
app.post("/chats",asyncWrap(async (req,res)=>{
        let {from,to,msg}=req.body;
        let newChat= new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    });
    // console.log(newChat);
    await newChat.save()//storing the chats in database
    res.redirect("/chats");
}));



//asyncWrap :-method to handle async errors
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
}



//NEW- Show Route
app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
    let{id}=req.params;
    let chat=await Chat.findById(id);
    if(!chat){
        next(new ExpressError(404,"Chat not found"));
    }
    res.render("edit.ejs",{chat});
}));


//Edit Route
app.get("/chats/:id/edit",asyncWrap(async (req,res)=>{
        let {id}=req.params;
        let chat= await Chat.findById(id);
        res.render("edit.ejs",{chat});
}));
//Update Route
app.put("/chats/:id",asyncWrap(async (req,res)=>{
        let {id}=req.params;
        let {msg:newMsg}=req.body;
        let updatedChat= await Chat.findByIdAndUpdate(id,{msg:newMsg},
            {
                runValidators:true,new:true
            }
        );
        console.log(updatedChat);
        res.redirect("/chats");
}));



//Destory Route
app.delete("/chats/:id",asyncWrap(async (req,res)=>{
        let{id}=req.params;
        let deleteChat= await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
    
}));



//route for checking that all things working well
app.get('/',(req,res)=>{
    res.send("root is working");
});



const handleValidationErr(err)=>{
    console.log("This was a validation error.Please follow rule");
    console.dir(err.message);
    return err;
};

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err=handleValidationErr(err);
    }
    next(err);
});

//Error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Some error occured"}=err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});