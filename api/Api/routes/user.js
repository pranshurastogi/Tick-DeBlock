const express = require('express');

const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const verify = require('../middleware/verified')

const {
  sendSignUpOtp,
  sendSignInOTP,
} = require('../email/email');


const router = new express.Router();

// user can signup
router.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    let a = Math.random();
    a = String(a);
    a = a.substring(2, 6);
    user.nonce = a;
    await user.save();
    await sendSignUpOtp(user);
    const token = await user.generateAuthToken();
     res.status(201).send({ user, token });
  } catch (e) {
     res.status(400).send(e);
  }
});

// user can verify their email

router.post('/signup/verify', auth, async (req, res) => {
  const { otp } = req.body;
  try {
    if (otp == req.user.otp && req.user.otp != '') {
      req.user.verified = true;
      req.user.otp = '';
      await req.user.save();
       return res.send('Email verification successful');
    } else {
       res.status(401).send({ error: "Invalid Otp" });
     
    }
  } catch (e) {
    
     res.status(500).send();
    
  }
});

// login with password

router.post('/login/password', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
     res.send({ user, token });
  } catch (e) {
    
     res.status(400).send(e);
    
  }
});

// send otp to specified emailfor login

router.post('/login/send-otp', async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    await sendSignInOTP(user);
     res.send({ message: "Otp has been send" });
    
  } catch (e) {
    
     res.status(400).send(e);

  }
});

// send nonce for the given wallet address.

router.post('/login/send-nonce', async (req, res) => {
    try {
      const user = await User.findByWalletAddress(req.body.waddress);
       res.send({ nonce: user.nonce });
      
    } catch (e) {
      
       res.status(400).send(e);
  
    }
  });

  // verify user based on nonce

  router.post('/login/verify-nonce', async (req, res) => {
    try {
        const { signature, publicAddress } = req.body;

        if (!signature || !publicAddress)
            return res
                .status(400)
                .send({ error: 'Request should have signature and publicAddress' });


        const user = await User.findByNonce(signature, publicAddress);

        let a = Math.random();
        a = String(a);
        a = a.substring(2, 6);
        user.nonce = a;
        
        const token = await user.generateAuthToken();

        await user.save();
        res.send({ user, token });

      
    } catch (e) {
      
       res.status(400).send(e);
      
    }
  });

// enter the OTP, verify identity and login
router.post('/login/verify-otp', async (req, res) => {
  try {
    const user = await User.findByOTP(req.body.email, req.body.otp);

    const token = await user.generateAuthToken();

    user.otp = '';

    await user.save();

     res.send({ user, token });
    
  } catch (e) {
    
     res.status(400).send(e);
    
  }
});


// logout

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
     res.send('logout successful');
   
  } catch (e) {
   
     res.status(500).send();
    
  }
});

// logout from all devices

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
     res.send();
    
  } catch (e) {
    
     res.status(500).send();
    
  }
});

// information obout profile

router.get('/me', auth, async (req, res) => {
   res.send(req.user);
  
});

// edit the information
router.patch('/me', auth, verify, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
   
     return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
     res.send(req.user);
   
  } catch (e) {
    
     res.status(400).send(e);
    
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be jpg,jpeg,png'));
    }
    cb(undefined, true);
  },
});

// upload the profile pic

router.post(
  '/me/avatar',
  auth,
  verify,
  upload.single('upload'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    // res.send();
    responseHandler.sendResponse(res, 200, 'avatar saved successful');
  },
  (error, req, res, next) => {
    logger.info(`${e}`);
    // res.status(400).send({ error: error.message });
    responseHandler.sendError(res, 400, 'something went wrong', `${e}`);
  }
);

// delete profile pic

router.delete('/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    // res.send();
    responseHandler.sendResponse(res, 200, 'avatar remove successful');
  } catch (e) {
    logger.info(`${e}`);
    // res.status(500).send();
    responseHandler.sendError(res, 500, 'Internal Server Error', `${e}`);
  }
});

// get profile pic
router.get('/me/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    // res.send(user.avatar);
    responseHandler.sendResponse(res, 500, 'user display picture', user.avatar);
  } catch (e) {
    logger.info(`${e}`);
    // res.status(404).send();
    responseHandler.sendError(res, 404, 'content not found', `${e}`);
  }
});

module.exports = router;