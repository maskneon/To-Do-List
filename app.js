const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ =require("lodash");
const { name } = require("ejs");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin-yash:maskneon@cluster0.hkimuam.mongodb.net/todolistDB", {useNewUrlParser: true,});
// mongoose.connect("mongodb://0.0.0.0/todolistDB",{useNewUrlParser: true,});
const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome to Your To-Do List"
});
const item2=new Item({
    name:"Hit the + button to add a new item."
});
const item3=new Item({
    name:"<-- Hit this to delete an item.>"
});
const defaultItems=[item1,item2,item3];
const listSchema={
  name:String,
  items: [itemsSchema]
};
const List=mongoose.model("List",listSchema);


app.set("view engine", "ejs");

app.get("/", (req, res) => {
    
  Item.find().then(function(foundItems){

        if(foundItems.length===0){
          Item.insertMany(defaultItems).then(function () {
              console.log("Successfully saved defult items to DB");
            }).catch(function (err) {
              console.log(err);
            });
            res.redirect("/");
      }
      else{
          res.render("index", { listTitle:"Today", newListItems: foundItems });
      }
  


    });
  });
  
  app.get("/:customListName",(req,res)=>{
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName}).then(function(foundList){
     
        if(!foundList){
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        }else{
          res.render("index", {listTitle: foundList.name, newListItems: foundList.items});
        }
      
    }).catch(function (err) {
      console.log(err);
    });
    
  });
  

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName=req.body.list;
  let item=new Item({
    name:itemName
  });
 if(listName==="Today"){
  item.save();
  res.redirect("/");
 }else{
  List.findOne({name:listName}).then(function(foundList){
   
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  
}).catch(function (err) {
  console.log(err);
});

}
  
});

app.post("/delete",(req,res)=>{
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId).then(function(err){
      if(!err){
        console.log("Successfully removed checked items!");
        res.redirect("/");
      }
        
    }).catch(function (err) {
      console.log(err);
    });
    
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}).then(function(foundList){
      res.redirect("/" + listName);
    }).catch(function (err) {
      console.log(err);
    });
  }
  
});

app.get("/about", function(req, res){
  res.render("about");
});


app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
