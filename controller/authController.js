import usermodel from "../model/usermodel.js";

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  //validate
  if (!name) {
    next("name is required");
  }
  if (!email) {
    next("email is required");
  }
  if (!password) {
    next("password is required and greater than 6 character");
  }
  const exisitingUser = await usermodel.findOne({ email });
  if (exisitingUser) {
    next("Email Already Register Please Login");
  }
  const user = await usermodel.create({ name, email, password });

  //token
  const token = user.createJWT();

  res.status(201).send({
    success: true,
    message: "User Created succesfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location
    },
    token,
  });

};

export const loginController = async (req, res, next) => {

  const { email, password } = req.body

  //validation
  if (!email || !password) {
    next('Please provide all field')
  }

  // find user by email

  const user = await usermodel.findOne({ email }).select("+password")
  if (!user) {
    next('Invalid user name or Password')
  }

  //compare password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    next('Invalid UserName or Password')
  }

  user.password = undefined;
  const token = user.createJWT()
  res.status(200).json({
    success: true,
    message: 'Login Succesfully',
    user,
    token,
  });

};
