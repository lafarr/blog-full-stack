const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.body.token;
  let decodedToken;
  try {
      decodedToken = await jwt.verify(token, 'this is a medium copy');
  } catch (err) {
      return res
          .status(401)
          .json({
              message: 'Invalid token'
          });
  }
  if (!decodedToken) {
      res
          .status(401)
          .json({
              message: 'Invalid token'
          });
  } else {
      req.userId = decodedToken.id;
      next();
  }
};