const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization; 
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    if (req.headers.userid !== userId) {
      throw "Non authentifié !";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Token expiré"),
    });
  }
};
