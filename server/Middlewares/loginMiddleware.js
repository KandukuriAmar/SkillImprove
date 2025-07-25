const jwt = require("jsonwebtoken");

function loginMiddleware(req, res, next) {
  const tokenAuth = req.header('Authorization');
  console.log("tokenAuth: ", tokenAuth);
  if (!tokenAuth) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = tokenAuth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    } else {
      req.user = decoded.user;
      if(req.user === undefined) {
        req.user = {
          _id: decoded.id,
          email: decoded.email,
          fullname: decoded.fullname
        } 
      }
      console.log("req.user: ", req.user);
      next();
    }
  });
}

module.exports = loginMiddleware;