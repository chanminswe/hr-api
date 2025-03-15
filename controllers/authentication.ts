import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Users from '../models/users';
import jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, department, canEdit, name } = req.body;

    if (!email || !password || !role || !department || !name || canEdit === undefined) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    if (!['head', 'employee'].includes(role)) {
      res.status(400).json({ message: "Role must be either 'head' or 'employee'!" });
      return;
    }

    const cryptedPassword = bcrypt.hashSync(password, 10);

    const createUser = await Users.create({
      email,
      password: cryptedPassword,
      name,
      role,
      department,
      canEdit,
    });

    if (!createUser) {
      res.status(400).json({ message: "Something went wrong while creating user" });
      return
    }

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error occurred while registering user:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All credentials are necessary" });
    }

    const findExistingUser = await Users.findOne({ email });

    if (!findExistingUser) {
      res.status(400).json({ message: "Couldn't find User" });
      return;
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '100d' });

    res.status(200).json({ message: "Logged In Sucessfully!", token });

    if (!token) {
      res.status(400).json({ message: "Something went wrong while making token!" });
    }
  }
  catch (error) {
    console.error("Error Occured while loggin in", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
    return
  }
}

export { registerUser, loginUser };
