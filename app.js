const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {Client} = require('pg')

const PORT = process.env.PORT || 3000


const app = express()