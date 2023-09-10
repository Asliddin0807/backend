const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const MemoryStore = require('memorystore')(session)
const serverless = require('serverless-http')


//use functions and routes
const { connectData } = require('./config/mongooseConnect')
connectData()
const { errHandler, notFound } = require('./middleware/errorHandler')
const client = require('./routes/client')
const courses = require('./routes/courses')
const mentors = require('./routes/mentons')
const categories = require('./routes/categories')

require('dotenv').config()
require('./config/passport')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Asliddin' })
})

//use
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(errHandler)
app.use(cors())
// app.use(notFound)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
      
    }),
  }))
  app.use(passport.initialize())
  app.use(passport.session())

//api
app.use('/.netlify/functions/api/api/client', client)
app.use('/api/courses', courses)
app.use('/api/mentors', mentors)
app.use('/api/categories', categories)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('server is running!')
})

