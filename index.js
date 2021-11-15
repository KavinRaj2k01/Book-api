const express=require("express");
const mongoose=require('mongoose');
require("dotenv").config();
const OurAPP=express();
const Book=require('./book')
const Author=require('./author')
const Publication=require('./publication')

mongoose.connect(process.env.MONGO_URI,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    UseCreateIndex:true,
}).then(()=>console.log("success")).catch((err)=>{
console.log(err)
});

const Database=require("./database")
OurAPP.get("/", (request, response) => {
    response.json({ message: "Server is working!!!!!!" });
});


OurAPP.get("/book",(req,res)=>{
    return res.json({books:Database.Book})
})

OurAPP.get("/book/:bookID",(req,res)=>{
    const getBook=Database.Book.filter((book)=>book.ISBN===req.params.bookID)
return res.json({book:getBook}) 
})

OurAPP.get("/book/c/:category",(req,res)=>{
    const getBook=Database.Book.filter((book)=>book.category.includes(req.params.category))
return res.json({book:getBook}) 
})

OurAPP.post("/book/new",(req,res)=>{
    const {newBook}=req.body;
    Database.Book.push(newBook)
    console.log(req.body)
    return res.json({message:"Book Added successfully"})
})

OurAPP.post("/author/new",(req,res)=>{
    const {newAuthor}=req.body;
    console.log(newAuthor)
    return res.json({message:"Author Added successfully"})
})

OurAPP.post("/publication/new",(req,res)=>{
    const publication =req.body;
    console.log(publication)
    return res.json({message:"publication Added successfully"})
})


OurAPP.put("/book/update/:isbn",(req,res)=>{
    const {updatedBook}=req.body;
    const {isbn}=req.params;
    Database.Book.forEach((book)=>{
         if(book.isbn===isbn){
             return {...book,...updatedBook}
         }
         return book;
    })
    return res.json(Database.Book)
})
OurAPP.delete("/book/delete/:isbn",(req,res)=>{
    const {isbn}=req.params;
    const filteredBooks=Database.Book.filter((book)=>book.ISBN!==isbn)
    Database.book=filteredBooks
})


OurAPP.listen(4000, () => console.log("Server is running"));