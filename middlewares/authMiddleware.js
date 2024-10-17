import JWT from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {

    next('Auth Failed!')

  }

  const token = authHeader.split(' ')[1]

  try {

    const payLoad = JWT.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payLoad.userId }
    next()

  }
  catch (error) {
    next('Auth Failed!')
  }

}

export default userAuth;