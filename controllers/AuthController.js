const User = require('../models/User.Model')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err,hashedPass){
      if(err) {
        res.json({
          error: err
        })
      }

      let user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPass,
        organization: req.body.organization,
        role: req.body.role,


      })
      user.save()
      .then(user=> {
        res.json({
          message : 'User Added Successfully!'
        })
      })
      .catch(error => {
        res.json({
          message: error.toString()
        })
      })
    })
}

const login = (req, res, next) => {
    var username = req.body.email
    var password = req.body.password

    User.findOne({$or: [{email:username},{email:username}]})
    .then(user => {
      if(user){
        bcrypt.compare(password, user.password, function (err, result){
          if(err){
            res.json({
              error: err
            })
          }
          if(result){
            let token = jwt.sign({name: user.name}, 'SecretValue',{expiresIn: '1h'})
            res.json({
              message: "Login Successful!",
              token
            })
          }else{
            res.json({
              message: 'Username or Password is incorrect'
            })
          }
        })
      }else{
        res.json({
          message: 'Username or Password is incorrect'
        })
      }
    })
}

module.exports= {
  register,login
}
