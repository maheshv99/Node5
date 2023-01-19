//server code is started here only

const express=require("express");
const socket=require("socket.io");
const path=require("path");

const app=express();
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
})

const server=app.listen(4000,()=>{
    console.log("server is runnig 4000 port");
})

const io=socket(server,{cors : { origin : "*"}});
let name;
let userArray=[];
io.on("connection",(socket)=>{
    
    console.log("User is Connected ");

    socket.on("joining chat",(data)=>{
         name=data;
         let user={
            id:socket.id,
            name:name
         }
         userArray.push(user);
       io.emit("chat message",`${name} has joined`)
    })
    socket.on("chat message",(data)=>[
        socket.broadcast.emit("chat message",data)
    ])

    socket.on("disconnect",()=>{
        let removeUser=userArray.filter((item)=>socket.id==item.id)
        io.emit("chat message",`${removeUser[0].name} has left`)
    })
})