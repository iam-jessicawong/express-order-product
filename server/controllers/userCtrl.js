import bcrypt from "bcrypt";
import ResponseHelper from "../helpers/ResponseHelper";
import auth from "../helpers/auth";

const findByUsername = async (req, username) => {
  try {
    const user = await req.context.models.users.findOne({ where: { username: username } });
    return user;  
  } catch (error) {
    return error;
  }
};

const signUp = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  if (!username) return res.status(400).send({ message: "Failed! Username is not null" });
  if (!password) return res.status(400).send({ message: "Failed! Password is not null" });

  try {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const userExist = await findByUsername(req, username);
    if (userExist) return res.status(409).send({ message: "username is already exist" });

    const user = await req.context.models.users.create({
      username: username,
      password: passHash
    });

    await req.context.models.customers.create({
      firstname: firstname,
      lastname: lastname,
      user_id: user.id
    });

    return res.send({
      message: "sign up success",
      user: user.username
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findByUsername(req, username);
  
    if (!user) return ResponseHelper.sendResponse(res, 404);
    
    if (!bcrypt.compareSync(password, user.password) ) return ResponseHelper.sendResponse(res, 401);

    const token = auth.generateToken({_id: user.id});
    return ResponseHelper.sendResponse(res, 200, {token});
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

export default {
  signUp,
  signIn,
};
