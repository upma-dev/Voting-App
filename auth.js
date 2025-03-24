const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = async (req, res, next) => {
  // first check if the authorization header is present
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token not found" });

  // Extract the jwt token from the request headers
  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    // verify the Jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// function to generate Jwt token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { jwtAuthMiddleware, generateToken };

// Self practice = 10 /8

// const jwt = require("jsonwebtoken")

//   const jwtAuthMiddleware = async(req, res, next) => {

//     // first check if the authorization header is present

//     const authorization = req.header.authorization;
//     if(!authorization) return res.status(401).json({error: 'Token not found'});

//     const token = req.headers.authorization.split(' ')[1];
//     if(!token) return res.status(401).json({error: 'Unauthorized'});

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//        return res.status(401).json({error: 'Invalid token'});
//     }

//     }

//     const generateToken = (userData) => {
//       return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '1h'});
//     }

//     module.exports = {
//       jwtAuthMiddleware,
//       generateToken,
//     }
