const mongoose=require("mongoose");
const Chat = require("./models/chats.js");//requiring our chats.js file where constraints are defined from models directory

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


let allchats=[
    {
        from:"neha",
        to:"preeti",
        msg:"send me notes",
        created_at:new Date()
    },
    {
        from:"rohit",
        to:"mohit",
        msg:"teach me js ",
        created_at:new Date()
    },
    {
        from:"yuvraj",
        to:"vasu",
        msg:"focus on your study",
        created_at:new Date()
    },
    {
        from:"vasu",
        to:"nishant",
        msg:"teach me trading",
        created_at:new Date()
    }
]
Chat.insertMany(allchats);
// chats.save()//saving data
//   .then((res)=>{
//     console.log(res);
//   })
//  .catch((err)=>{
//     console.log(err);
//  });
