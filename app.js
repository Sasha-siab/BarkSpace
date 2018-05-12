const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {Client} = require('pg')

const PORT = process.env.PORT || 3000


const app = express()


app.get('/', (req, res)=>{
	res.send('Hello, how are you?')
})

app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})