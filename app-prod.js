const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {Client} = require('pg')
const Sequelize = require('sequelize')
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const gt = require('./components/getTags.js')
const tp = require('./components/tagParser.js')

const PORT = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

const dotenv = require('dotenv')
const result = dotenv.config();

dotenv.load();

const postgres_user = process.env.DB_USER;
const postgres_pass = process.env.DB_PASS;

// const client = new Client({ connectionString:process.env.DB_URL, ssl: true})

// const connectionString = 'postgresql://postgres_user:postgres_pass@localhost:5432/bakspace'


// ---------------------------------- Sequelize Init

const Op = Sequelize.Op

// using a database name given by heroku
// keep it clean from user and password
const sequelize = new Sequelize(process.env.DATABASE_URL,  {
// const sequelize = new Sequelize('barkspace', 'postgres', 'Giraffes94', {

	// host: 'localhost',
	// port: '5432',

	logging: true,
	ssl: true,
	dialect: 'postgres',
	protocol: 'postgres',
	operatorsAliases:{
		$and: Op.and,
		$or: Op.or,
		$eq: Op.eq,
		$regexp: Op.regexp,
		$iRegexp: Op.iRegexp,
		$like: Op.like,
		$iLike: Op.iLike
	}
})



//____________________________________CREATE A TABLE

const User = sequelize.define('user3',
  {
	username: Sequelize.STRING,
	fname: Sequelize.STRING,
	lname: Sequelize.STRING,
	email: Sequelize.STRING,
	profilepic: Sequelize.STRING,
	password: Sequelize.STRING

  }
)

const Post = sequelize.define('post',
	{
		username: Sequelize.STRING,
		profilepic: Sequelize.STRING,
		datecreated: Sequelize.STRING,
		postpic: Sequelize.STRING,
		likes: Sequelize.INTEGER,
		description: Sequelize.STRING,
		userid: Sequelize.INTEGER,
		tags: Sequelize.STRING
	}

)


sequelize.sync()




// ----------------------------------------------------------------------------- CREATE A RECORD

User.create({

		username: "Admin",
		fname: "Sasha",
		lname: "Siabriuk",
		email: "alexsbrk91@gmail.com",
		profilepic: "./images/users/placeholder.jpg",
		password: "barkspace",

});





// ----------------------------------------------------------------------------- PASSPORT JS INIT

app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

passport.use(new Strategy(

	(username, password, cb)=>{
		// NOTE User / Password confirmation for passportJS login
		// use squelize search for first data entry with username feild match
		User.findOne({
			where: {
				username: {
					$iLike : `${username}`
				}
			}
		}).then(data=>{
			if (!data) {
				return cb(null,false);
			} else if (data.password !== password) {
				return cb(null,false);
			}
			return cb(null,data);
		});
	}

));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,cb){
	// NOTE?? gets user data from previously defined local strategy, pushes to
	// user parameter. first callback param is error throw?
	cb(null, user.id);
});

passport.deserializeUser(function(id,cb){

	User.findById(id).then(data=>{
		if(!data) {
			return cb(null,null);
		}
		cb(null,data);
	});

});



// ----------------------------------------------------------------------------- MULTER



// STORAGE OBJECT DEFINITION

const storage = multer.diskStorage({
destination: './public/images/posts',
filename: (req, file, cb)=>{
   cb(null, Date.now() + (file.originalname) );
}
})


// UPLOAD PROCESS DEFINITION

const upload = multer({storage: storage}).single('postpic')




// ----------------------------------------------------------------------------- GLOBAL VARS


var tempLogin = '';
// tempLogin declaired globally to substitute for passportJS
// NOTE depreciated, used currently to test for whether or not login / logout
// is displayed on _nav partial. Needs update

var errMsg = '';
// Error messages placeholder var
// NOTE should be moved to separate file


// ----------------------------------------------------------------------------- GLOBAL FUNC

var navValidate = function(req,res,rows,renderRoute) {
	// function for assessing if the user is logged in, and passing relevant information
	// to the nav bar on each page.
	if (req.user) {
		console.log('user logged in');
		tempLogin = req.user.dataValues.fname
		return res.render(renderRoute, {tempLogin: tempLogin, rows: rows});
	}
	tempLogin = '';
	return res.render(renderRoute, {tempLogin: tempLogin, rows: rows});
}


// ----------------------------------------------------------------------------- ROUTES


app.get('/', (req, res)=>{

		Post.findAll().then(rows=>{
			rows = rows.reverse();
		// if (req.user) {
		// 	console.log('user logged in');
		// 	tempLogin = req.user.dataValues.fname
		// 	return res.render('home', {tempLogin: tempLogin, rows: rows});
		// }
		// tempLogin = '';
		// return res.render('home', {tempLogin: tempLogin, rows: rows});

			navValidate(req,res,rows,'home');

		});

	});


// ----------------------------------------------------------------------------- SIGN IN | SIGN UP PORTAL

app.get('/signup',(req,res)=>{

	  res.render('login',{errMsg});

	});


// ----------------------------------------------------------------------------- LOGIN POST


app.post('/login', passport.authenticate('local', {failureRedirect: '/signup'}), (req,res)=>{

			res.redirect('/profile');

	});


// ----------------------------------------------------------------------------- REGISTER POST

app.post('/register',(req,res)=>{

	let data = req.body;

	// check for errors, if error render with error message and return before user creation
	// else create user in table user3s
	// NOTE bycrypt goes here

	if (data.password !== data.password2) {
		errMsg = 'Password Data does not match, try again'
		return res.render('login',{errMsg})
	} else if (data.username == '' || data.fname == '' || data.lname == '' || data.email == '' || data.password == '' || data.password2 == '') {
		errMsg = 'Please enter values for each feild'
		return res.render('login',{errMsg});
	}

	// check to see if username already exists in database. If it does, render
	// error msg before allowing data creation
	User.findOne({
		where: {
			username: {
				$like: `${data.username}`
			}
		}
	}).then(userNameAlreadyAssigned=>{
		console.log(data);
		if (userNameAlreadyAssigned) {
			console.log('username exists');
			errMsg = 'Username already in use. Please select a new username';
			usernameSafe = false;
			return res.render('login',{errMsg});
		} else {
			console.log('username safe');
			User.create({
					username: req.body.username,
					fname: req.body.fname,
					lname: req.body.lname,
					email: req.body.email,
					profilepic: "./images/users/placeholder.jpg",
					password: req.body.password,

			}).then(function(){
				return res.redirect('/profile');
			});
		}
	});

});

// ----------------------------------------------------------------------------- GET USER PROFILE

app.get('/profile',	require('connect-ensure-login').ensureLoggedIn('/signup'), (req,res)=>{

	var data = req.user.dataValues;

	// Find all posts by user, render into feeder
	Post.findAll({
		where: {
			username: {
				$iLike: data.username
			}
		}
	}).then(rows=>{
			rows = rows.reverse();

			navValidate(req,res,rows,'profile');


	});


});




// ----------------------------------------------------------------------------- UPLOAD POST PICTURE | MULTER

app.post('/post-picture',require('connect-ensure-login').ensureLoggedIn('/signup'), (req,res)=>{

	upload(req, res, (err)=>{
		// console.log(req.body.test)
		// console.log(req.file.filename)
		// console.log(req.user.dataValues);

		let tags = gt.getTags(req.body.description);
		let date = new Date().getTime();

		if(err){
		console.log(err)
		}

	  Post.create({
	  // sequelize
			postpic: req.file.filename,
			username: req.user.dataValues.username,
			profilepic: req.user.dataValues.profilepic,
			datecreated: date,
			likes: 0,
			description: req.body.description,
			userid: req.user.dataValues.id,
			tags: tags

		})
		.then((x)=>{
				// NOTE: something good! NOTE
			var filename = './images/posts/' + req.file.filename
			var id = x.dataValues.id
			return res.redirect('/profile');
		});

	});

});


// ----------------------------------------------------------------------------- UPLOAD POST DETAILS | MULTER

app.post('/post-details', require('connect-ensure-login').ensureLoggedIn('/signup'), (req, res)=>{


	let data = req.user.dataValues;

	// two form system because image needs to be accepted through a specific data
	// type in form. post-picture creates new post
	Post.find({ where: { id: req.body.id } })
	  .then(function (post) {
	    // Check if record exists in db
	    if (post) {
	      post.updateAttributes({
					username: data.username,
					profilepic: data.profilepic,
					datecreated: date,
					likes: 0,
					description: req.body.description,
					userid: data.id,
					tags: tags
	      }).then(function(){
						return res.redirect('/');
				})
	    } else {
				console.log('mistake!');
			}
	 });

	});

// ----------------------------------------------------------------------------- SEARCH REQUESTS

app.post('/searchbar', (req,res)=>{

	var searchQ = req.body.search;
	var category = req.body.category;
	var reg = searchQ+'.*'


	if ( category === 'users' ) {
		User.findAll({
			where: {
				 username: {
					  $iRegexp: reg
				 }
			}
		}).then(rows=>{
			console.log(rows.length);

			if (rows.length!==0) {
				return res.render( 'search', {rows:rows,tempLogin:tempLogin} )
			}
			return res.render( 'search', {rows:false,tempLogin:tempLogin} )

		})
	} else if ( category === 'tags') {
		Post.findAll({
			where: {
				 tags: {
						$iRegexp: reg
				 }
			}
		}).then(rows=>{
			let uniqueTags = tp.tagParser(rows,reg);
			if (rows.length!==0) {
				return res.render( 'searchTags', {uniqueTags:uniqueTags,tempLogin:tempLogin} );
			}
			return res.render( 'searchTags', {uniqueTags:false,tempLogin:tempLogin} );

		})
	}

})

// ~* '^[abc]{3}$';

// ----------------------------------------------------------------------------- PUBLIC USER PAGES

app.get('/user/:username',(req,res)=>{
	let username = req.params.username;

	Post.findAll({
		where: {
			username: {
				$iLike: username
			}
		}
	}).then(rows=>{
		navValidate(req,res,rows,'user');
	})

})


app.get('/tags/:tag',(req,res)=>{
	let tag = req.params.tag;
	let reg = tag+'.*';

	Post.findAll({
		where: {
			tags: {
				$iRegexp: reg
			}
		}
	}).then(rows=>{
		// NOTE need navValidate update to take datapass

		if (req.user) {
			console.log('user logged in');
			tempLogin = req.user.dataValues.fname
			return res.render('tag', {tempLogin: tempLogin, rows: rows, tagQuery:tag});
		}
		tempLogin = '';
		return res.render('tag', {tempLogin: tempLogin, rows: rows, tagQuery:tag});

	})

})

app.post('/like',(req,res)=>{
	console.log('like triggered route');
	Post.findById(req.body.postid)
	.then(post=>{
		if (post) {
			post.updateAttributes({
				likes: post.dataValues.likes+1
			});
		}
	})
});

app.post('/unlike',(req,res)=>{
	console.log('unlike triggered route');
	Post.findById(req.body.postid)
	.then(post=>{
		if (post) {
			post.updateAttributes({
				likes: post.dataValues.likes-1
			});
		}
	})
})







app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});


app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})
