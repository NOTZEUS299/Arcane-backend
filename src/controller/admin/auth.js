const User = require("../../models/user");
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
  await User.findOne({
    email: req.body.email,
    role: "admin",
  }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        error: "Admin already registered",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      role: "admin",
    });

    await _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "Admin created Successfully..!",
        });
      }
    });
  });
};

exports.signin = async (req, res) => {
  try {
    await User.findOne({
      email: req.body.email,
    }).exec(async (error, user) => {
      if (error)
        return res.status(400).json({
          error,
        });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (isPassword && user.role === "admin") {
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;
          res.cookie("token", token, {
            expiresIn: "24h",
          });
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
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("token", { path: "/admin/signin" });
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
