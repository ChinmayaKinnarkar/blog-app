//calling express
var express = require('express');
//creating an instance
var app =express();
//including body parser
var bodyParser =require('body-parser');
//including cookie parser
var cookieParser = require('cookie-parser');
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

//calling mongoose module
var mongoose =require('mongoose');

//Connect to mongoose
mongoose.connect('mongodb://localhost/blogapp');
var db = mongoose.connection;
// end mongoose connection

// application level middleware
app.use(function(req,res,next){
	
	console.log('Time:', Date.now());
	console.log('Request Type:', req.method);
	console.log('Request URL:', req.originalUrl);
	console.log("Request Ip address Log ",req.ip);
	next();
});
//end applicaltion level middleware

// including blogSchema and model
var blog = require('modules/blogSchema.js');

var blogModel = mongoose.model('blog');
// end include

 //routes
app.get('/',function (req, res) {
	res.send('It''s a blog application');
});

// route to get all blogs
app.get('/blogs',function(req,res,next) {

	blogModel.find(function(err,result) {

		if (err) {
			next(err);
		}
		else{
			res.send(result);
		}
	});
	// end blogModel
});
// end get all blogs


// route to create a blog
app.post('/blog/create',function(req,res,next) {
 
    var newBlog = new blogModel({
    	
    	title : req.blogTitle;
    	author : req.authorName;
    	body : req.blogsBody;

    }); //end new blog

    // date for new blog
    var today = Date.now();
    newBlog.created_on = today;

    //saving new blog
    console.log(newBlog);
    newBlog.save(function(err) {
    	if (err) {
    		next(err);
    	}
    	else {
    		res.send(newBlog);
    	}
    }); // new blog saved

}); // create blog route end


// find a particular blog
app.get('/blog/:id',function(req,res,next) {

	blogModel.findOne({'_id':req.params.id},function(err,result) {

		if (err) {

			console.log(err);
			next(err);

		}

		 else {
		 	res.send(result);
		 }
	}); // end blogModel 

}); // end finding a blog route

//route to edit a blog
app.put('/blog/:id/edit',function(req,res,next) {
	var update = req.body;

		// date of update
		var today = Date.now();
		update.updated_on = today;
	    blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

			if(err){

			console.log("Blog id does not match");
			next(err);
		}

		else{
				console.log("Blog is updated");
				res.send(result);

	}
}); // end model

}); // end edit route

// comment on a blog
app.post('/blog/:id/comment',function(req,res,next) {
	blogModel.findOne({'_id':req.params.id},comment,function(err,result) {

		if (err) {

			console.log("Sorry blog id does not match.")
		} 
		else {
			var today =Date.now();
			result.comments.push({ 
			commenterName: req.body.commenterName,
			commentBody:req.body.commentBody,
			commented_on: today,
			commentTime : time+" hrs."		
		});
	}
});
});

//route to delete a blog
app.post('/blog/:id/delete',function(req,res){

	blogModel.remove({'_id':req.params.id},function(err,result) {

		if (err) {

			console.log("Some error occured");
			next(err)
		} 
		else {
			res.send(result)
		}
	
	}); //end model

}); // end delete

//404 error
app.use(function(req,res) {
	res.status('404').send("404: Page not found");
	console.log("404 Error");
});


//Generic Error Handling middlewares
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  res.status(404).send('Hey! there...I have not created this page')
  next(err);
});
//end of error handling middlewares


app.listen(3000);
	console.log("Listening on port 3000");

