const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('auth-token');
  console.log('Received token in middleware:', token); // Ensure token is processed correctly
  if (!token) {
      console.log("Token missing from headers");
      return res.status(401).send('Access Denied');
  }

  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
  } catch (err) {
      console.error("Error during token verification:", err.message);
      res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;
