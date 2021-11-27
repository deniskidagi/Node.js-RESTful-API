const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()


app.set("view-engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)


app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles)
        }
    })
})
.post(function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle  = new Article ({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("successfully saved data to the database")
        }else{
            res.send(err)
        }
    })
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all data")
        }else {
            res.send(err)
        }
    })
})
app.route("/articles/:articleTitle")
.get(function(req, res){
    const articleTitle = req.params.articleTitle
    Article.findOne({title: articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("The specified article was not found")
        }
    })
})
.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {runValidators: true},
        function(err){
            if(!err){
                res.send("successfully updated article")
            }
        })
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.body.articleTitle},
        {$set: req.body.content}, 
        function(err){
            if(!err){
                res.send("successfully updated article")
            }else{
                res.send(err)
            }
        }
    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully deleted article")
            }else{
                res.send(err)
            }
        }
    )
})
app.listen(3000, function(req, res){
    console.log("server listening on port 3000");
})