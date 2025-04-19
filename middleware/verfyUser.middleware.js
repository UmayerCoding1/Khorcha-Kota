import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "UnAuthorization access" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const user = await User.findById({ _id: decodedToken.id }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "Invalid access token" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyUser;
