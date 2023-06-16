import jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;

const generateToken = (data) => {
  return jwt.sign({data}, SECRET_KEY, {
    expiresIn: "2h",
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(403).send("please provide a token");
  }
  
  try {
    const verify = jwt.verify(token, SECRET_KEY);

    req.user = verify.data;
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("invalid token");
  }
};

export default {
  generateToken,
  verifyToken
}
