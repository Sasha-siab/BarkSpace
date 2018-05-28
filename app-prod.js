const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {Client} = require('pg')
const Sequelize = require('sequelize')

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


// const SequelizeStore = require('connect-session-sequelize')(session.Store)

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

User.create({

		username: "Admin",
		fname: "Sasha",
		lname: "Siabriuk",
		email: "alexsbrk91@gmail.com",
		profilepic: "./images/users/placeholder.jpg",
		password: "barkspace",

});

// Post.create






// const sessionStore = new SequelizeStore({
//     db: sequelize
//   });


// sessionStore.sync();

// ------------------------------------ Error messages
// NOTE should be moved to separate file

var errMsg = '';
// tempLogin declaired globally to substitute for passportJS
var tempLogin;













// ------------------------------------------------------- Login

app.get('/signup',(req,res)=>{

  res.render('login',{errMsg});

})


// ------------------------------------------------------- Login post

app.post('/login',(req,res)=>{

	// define username from post req
	let username = req.body.username;

	// use squelize search for first data entry with username feild match
	User.findOne({
		where: {
			username: {
				// case sensitive username
				$like : `${username}`
			}
		}
	}).then(data=>{
		// if no data then throw error, if password mismatch throw error
		// else login and render with temporary username
		// NOTE passportJS and bcrypt go here
		if (!data) {
			errMsg = 'Username not found'
			return res.render('login',{errMsg});
		} else if (data.dataValues.password === req.body.password) {
			tempLogin = username;
			return res.render('profile',{tempLogin});
		} else {
			errMsg = 'Username and password mismatch'
			return res.render('login',{errMsg})
		}
	});

})



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
		if (data) {
			errMsg = 'Username already in use. Please select a new username';
			return res.render('login',{errMsg});
		}
	});

	User.create({
			username: data.username,
			fname: data.fname,
			lname: data.lname,
			email: data.email,
			profilepic: "./images/users/placeholder.jpg",
			password: data.password,

	}).then(function(){
		tempLogin = data.username
		return res.render('profile',{tempLogin});
	});

  // client.query(``)

})



app.get('/profile',(req,res)=>{

	res.render()

})
  // multer





app.get('/', (req, res)=>{

 // tempLogin = '';
 return res.render('home', {tempLogin})

User.findAll()
.then(function (x){
		res.render('home', {tempLogin})
})
})





app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})
