const passport = require('passport');
const { collection } = require('../models/clients');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Client = require('../models/clients')
const jwt = require('jsonwebtoken')
const { createToken, refreshToken } = require('./createToken')

require('dotenv').config()
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/client/google/callback",
    profileFields: ['emails'] 
  },
  async function(accessToken, refreshTokens, profile, cb) {
    const find = await Client.findOne({ googleId: profile.id })
    accessToken = await createToken(find?.id)
    refreshTokens = await refreshToken(find?.id)
    let newUser = {
      username: profile.name.givenName,
      email: profile.emails[0].value,
      password: profile.name.givenName,
      token: accessToken,
    }
    if(find){
       const updateToken = await Client.findByIdAndUpdate(find.id, { refreshToken: refreshToken }, {new: true})
       return cb(null, updateToken)
    }else{
      const add = await Client.create(newUser)
      return cb(null, add)
    }
   
}));