const express=require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");

var day;
mongoose.connect("mongodb+srv://SaiVivek:nitw123@cluster0.bxg1t.mongodb.net/ToDoListDB",{useNewUrlParser:true});
//mongoose.connect("mongodb://localhost:27017/ToDoListDB",{useNewUrlParser:true});
const itemSchema=new mongoose.Schema({
    name:String
})
const Items=mongoose.model("Item",itemSchema);

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
})

const List=mongoose.model("List",listSchema);

//var items=["Buy Food"];

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const item1=new Items({
    name:"Coding"
})
//item1.save();
const item2=new Items({
    name:"Eating"
})
const item3=new Items({
    name:"Sleeping"
})

const defaultList=[item1,item2,item3];
// Items.insertMany([item2,item3],function(err){
//     if(err){console.log(err);}
//     else{console.log("Successfully saved")}
// });

app.get("/", (req, res) => {
    var today = new Date();
    var options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    day = today.toLocaleDateString("en-US", options);

    Items.find({},function(err,founditem){
        if(err){console.log(err);}
        else{
            if(founditem.length === 0){
                Items.insertMany(defaultList,function(err){
                if(err){console.log(err);}
                else{//console.log("Successfully inserted Default Items")
                res.redirect("/");
                }
                });
            }
            else{
                res.render("list",{kindofday:"Today",listitems:founditem,time_:day});
            }
        }
    })
   
})

app.get("/:customListName",function(req, res) {
    const customListName=_.capitalize(req.params.customListName);
    //console.log(customListName);
    List.findOne({name:customListName},function(err,foundlist){
        if(!err){
            if(!foundlist){
                //Create new list with the name
                const list=new List({
                    name:customListName,
                    items:defaultList
                }) 
                list.save();
                res.redirect("/"+customListName);
            }
        else{
                res.render("list",{kindofday:foundlist.name,listitems:foundlist.items,time_:day}); 
            }
           
        } 
        
    })
    
})

app.post("/", (req, res) => {
    var item=req.body.eachitem;
    const listname=req.body.button;
   // items.push(item);
   const new_item=new Items({
    name:item
     });

     if(listname === day){
        new_item.save();
       res.redirect("/");
     }else{
         List.findOne({name:listname},function(err,foundlist){
             foundlist.items.push(new_item);
             foundlist.save();
             res.redirect("/"+listname);
         })
     }
    
})

app.post("/delete",(req, res) => {
    const item_id=req.body.checkbox;
    const list_name=req.body.listname;
    //console.log(item_id);
    //console.log(list_name);
    if(list_name === day){
        Items.deleteOne({_id:item_id},function(err){
            if(err){console.log(err)}
        })
        res.redirect("/");
    }
    else{
       List.findOneAndUpdate({name:list_name},{$pull:{items:{_id:item_id}}},function(err,foundlist){
           if(!err){
               res.redirect("/"+list_name);
           }
       })
    }

   
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("server is running in localhost 3000");
})