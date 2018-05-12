const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {Client} = require('pg')


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

const client = new Client({ connectionString:process.env.DB_URL, ssl: true})





const connectionString = 'postgresql://postgres_user:postgres_pass@localhost:5432/bakspace'



  // posgres

  // const accessKey = ""

  // multer





app.get('/', (req, res)=>{
	res.send('Hello, how are you?')
})

app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})