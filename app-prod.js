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
const sequelize = new Sequelize('barkspace', postgres_user, postgres_pass, {
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




sequelize.sync()


____________________________________CREATE A RECORD

User.create({
		username: "Admin",
		fname: "Sasha",
		lname: "Siabriuk",
		email: "alexsbrk91@gmail.com",
		profilepic: "./images/users/placeholder.jpg",
		password: "barkspace",

})






// const sessionStore = new SequelizeStore({
//     db: sequelize
//   });


// sessionStore.sync();


















app.get('/signup',(req,res)=>{


  res.render('login');

})
  // posgres

app.post('/register',(req,res)=>{

  var data = req.body;
  // client.query(``)

})

  // const accessKey = ""

  // multer





app.get('/', (req, res)=>{
User.findAll()
.then(function (x){
		res.render('home', {x})
})
})





app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})