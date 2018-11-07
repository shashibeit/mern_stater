const express = require("express");

const User = require("../../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");

router.post("/api/account/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(404).json({ email: "Email Already Exists" });
    } else {
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/api/account/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found..." });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = { id: user.id, name: user.name, email: user.email };

          jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
            res.json({ msg: "Success", token: "Bearer " + token });
          });
        } else {
          return res
            .status(404)
            .json({ password: "Password doesn't match..." });
        }
      });
    }
  });
});

router.get(
  "/api/account/getuser",
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
