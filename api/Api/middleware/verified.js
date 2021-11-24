const User = require( '../models/user');

const verify = async (req, res, next) => {
  try {
    if (req.user.verified == false) {
      
       res.status(401).send({error: 'Please Verify your account'})
    }
    next();
  } catch (e) {
    
     res.status(401).send({error: 'Please authenticate'})
  }
};

module.exports = verify;