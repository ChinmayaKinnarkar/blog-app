var mongoose = require('mongoose');

// defining blog schema
var blogSchema = mongoose.Schema({
	blogTitle        :     {type:String,default:'',required:true},
	authorName 		 :     {type:String,default:'',required:true},
	blogBody         :     {type:String,default:'',required:true},
	created_on       :     {type:Date , default: Date.now},
	updated_on       :     {type:Date},
	comments         :     [],
	aboutAuthor      :     {type:String,default:''}

});

mongoose.model('blog',blogSchema);