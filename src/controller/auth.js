const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign(
    {
      _id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

exports.signup = async (req, res) => {
  const findUser = await User.findOne({
    email: req.body.email,
    role: "user",
  });

  if (findUser) {
    return res.status(400).json({
      error: "User already registered",
    });
  }

  const { firstName, lastName, email, password } = req.body;
  const hash_password = await bcrypt.hash(password, 10);
  const _user = new User({
    firstName,
    lastName,
    email,
    hash_password,
    username: shortid.generate(),
  });

  await _user
    .save()
    .then((user) => {
      const token = generateJwtToken(user._id, user.role);
      const { _id, firstName, lastName, email, role, fullName } = user;
      res.status(201).json({
        token,
        user: {
          _id,
          firstName,
          lastName,
          email,
          role,
          fullName,
        },
      });
    })
    .catch((error) => {
      return res.status(400).json({
        message: "Something went wrong",
        error,
      });
    });

  // await User.findOne({
  //   email: req.body.email,
  //   role: "user",
  // }).exec(async (error, user) => {
  //   if (user)
  //     return res.status(400).json({
  //       error: "User already registered",
  //     });

  //   const { firstName, lastName, email, password } = req.body;
  //   const hash_password = await bcrypt.hash(password, 10);
  //   const _user = new User({
  //     firstName,
  //     lastName,
  //     email,
  //     hash_password,
  //     username: shortid.generate(),
  //   });

  //   await _user.save((error, user) => {
  //     if (error) {
  //       return res.status(400).json({
  //         message: "Something went wrong",
  //       });
  //     }

  //     if (user) {
  //       const token = generateJwtToken(user._id, user.role);
  //       const { _id, firstName, lastName, email, role, fullName } = user;
  //       return res.status(201).json({
  //         token,
  //         user: {
  //           _id,
  //           firstName,
  //           lastName,
  //           email,
  //           role,
  //           fullName,
  //         },
  //       });
  //     }
  //   });
  // });
};

exports.signin = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(400).json({
      error: "User Not found",
    });
  }

  const isPassword = await user.authenticate(req.body.password);
  if (isPassword && user.role === "user") {
    const token = generateJwtToken(user._id, user.role);
    const { _id, firstName, lastName, email, role, fullName } = user;
    res.status(200).json({
      token,
      user: {
        _id,
        firstName,
        lastName,
        email,
        role,
        fullName,
      },
    });
  } else {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
  // await User.findOne({
  //   email: req.body.email,
  // }).exec(async (error, user) => {
  //   try {
  //     if (error)
  //       return res.status(400).json({
  //         error,
  //       });
  //     if (user) {
  //       const isPassword = await user.authenticate(req.body.password);
  //       if (isPassword && user.role === "user") {
  //         const token = generateJwtToken(user._id, user.role);
  //         const { _id, firstName, lastName, email, role, fullName } = user;
  //         res.status(200).json({
  //           token,
  //           user: {
  //             _id,
  //             firstName,
  //             lastName,
  //             email,
  //             role,
  //             fullName,
  //           },
  //         });
  //       } else {
  //         return res.status(400).json({
  //           message: "Something went wrong",
  //         });
  //       }
  //     } else {
  //       return res.status(400).json({
  //         message: "Something went wrong",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // });
};

exports.signout = async (req, res) => {
  res.clearCookie("token", { path: "/signin" });
  res.status(200).json({
    message: "Signed Out Successfully...!",
  });
};
