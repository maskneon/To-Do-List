const express=require('express');
const bodyParser=require('body-parser');
const date=require(__dirname+ "/date.js");
const app=express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
let items=["Freshen Up","Brush Teeth","Take Bath"];
let workItems=[];
app.set('view engine','ejs');
app.get('/',(req,res)=>{
  
    // let currentDay=today.getDay();
    let day=date.getDay();
    res.render("index",{listTitle:day,newListItems:items});
    
});

app.post('/',(req,res)=>{
    let item=req.body.newItem;
    if(req.body.button==="Work")
    {
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
   
});

app.get("/work",(req,res)=>{
    let day=date.getDate();
    res.render("index",{listTitle:day,newListItems:workItems});
});


app.get("/about",(req,res)=>{
    res.render("about");
});
app.listen(3000,()=>{
    console.log('server is listening on port 3000!')
});