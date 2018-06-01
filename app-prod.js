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
// const sequelize = new Sequelize('barkspace', postgres_user, postgres_pass, {
const sequelize = new Sequelize('barkspace', 'postgres', 'Giraffes94', {

	host: 'localhost',
	port: '5432',
	dialect: 'postgres',
	operatorsAliases:{
		$and: Op.and,
		$or: Op.or,
		$eq: Op.eq,
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




// ____________________________________CREATE A RECORD

// User.create({
//
// 		username: "Admin",
// 		fname: "Sasha",
// 		lname: "Siabriuk",
// 		email: "alexsbrk91@gmail.com",
// 		profilepic: "./images/users/placeholder.jpg",
// 		password: "barkspace",
//
// });

// Post.create






// const sessionStore = new SequelizeStore({
//     db: sequelize
//   });


// sessionStore.sync();

// ------------------------------------ Error messages
// NOTE should be moved to separate file

var errMsg = '';


// ------------------------------------- Passport Init

app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

passport.use(new Strategy(

	(username, password, cb)=>{

		// use squelize search for first data entry with username feild match
		User.findOne({
			where: {
				username: {
					// case unsensitive username
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

// tempLogin declaired globally to substitute for passportJS
var tempLogin = '';













// ------------------------------------------------------- Login

app.get('/signup',(req,res)=>{

  res.render('login',{errMsg});

})


// ------------------------------------------------------- Login post

app.post('/login',

	passport.authenticate('local', {failureRedirect: '/signup'}),

	(req,res)=>{
		res.redirect('/profile');

});



// ------------------------------------------------------- Register post

app.post('/register',(req,res)=>{

	// shortens bodyParser call
	let data = req.body;

	// check for errors, if error render with error message and return before user creation
	// else create user in table user3s
	// NOTE passportJS and bycrypt go here

	if (data.password !== data.password2) {
		errMsg = 'Password Data does not match, try again'
		return res.render('login',{errMsg})
	} else if (data.username == '' || data.fname == '' || data.lname == '' || data.email == '' || data.password == '' || data.password2 == '') {
		errMsg = 'Please enter values for each feild'
		return res.render('login',{errMsg});
	}

	// check to see if username already exists in database
	User.findOne({
		where: {
			username: {
				$like: `${data.username}`
			}
		}
	}).then(data=>{
		console.log(data);
		if (data) {
			console.log('username exists');
			errMsg = 'Username already in use. Please select a new username';
			usernameSafe = false;
			return res.render('login',{errMsg});
		} else {
			console.log('username not safe');
			User.create({
					username: data.username,
					fname: data.fname,
					lname: data.lname,
					email: data.email,
					profilepic: "./images/users/placeholder.jpg",
					password: data.password,

			}).then(function(){
				return res.redirect('/profile');
			});
		}
	});





  // client.query(``)

});



app.get('/profile',	require('connect-ensure-login').ensureLoggedIn('/signup'), (req,res)=>{

	var data = req.user.dataValues;
	res.render('profile', {data: data, tempLogin: 'true'});

});
  // multer


app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
});
  // Tag search


	// ______________________________________MULTER ___________________//


	// ______________________________________STORAGE OBJECT DEFINITION

	const storage = multer.diskStorage({
	destination: './public/images/posts',
	filename: (req, file, cb)=>{
	   cb(null, Date.now() + (file.originalname) );
	}
	})

	// ______________________________________UPLOAD PROCESS DEFINITION


	const upload = multer({storage: storage}).single('postpic')



	// ______________________________________ UPLOAD


app.post('/post-picture',require('connect-ensure-login').ensureLoggedIn('/signup'), (req,res)=>{

	upload(req, res, (err)=>{
	if(err){
	console.log(err)
	}
	// console.log(req.body)
	// console.log(req.file)


	  Post.create({
	  // sequelize
	postpic: req.file.filename
	})
	.then((x)=>{
		// NOTE: something good! NOTE
	var filename = './images/posts/' + req.file.filename
	var id = x.dataValues.id
	return res.render('editPost',{filename:filename,id:id});
	})
	  });

});

app.post('/post-details', require('connect-ensure-login').ensureLoggedIn('/signup'), (req, res)=>{

	let tags = gt.getTags(req.body.description);

	let date = new Date().getTime();
	let data = req.user.dataValues;

	// this needs to be altered

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





app.get('/', (req, res)=>{

	Post.findAll().then(rows=>{

		if (req.user) {
			console.log('user logged in');
			tempLogin = req.user.dataValues.fname
			return res.render('home', {tempLogin: tempLogin, rows: rows});
		}
	 tempLogin = '';
	 return res.render('home', {tempLogin: tempLogin, rows: rows});

	});

});







app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})
