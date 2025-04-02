import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import Users from "../../models/users";
import jwt from "jsonwebtoken";

const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, role, department, canEdit, fullname } = req.body;

    if (!email || !password || !role || !department || !fullname || canEdit === undefined) {
      res.status(400).json({ message: "All fields are required!", success: false });
      return;
    }

    if (!["management", "employee", "head", 'executive'].includes(role)) {
      res.status(400).json({ message: "Role must be either 'head' or 'employee'!", success: false });
      return
    }

    const cryptedPassword = await bcrypt.hash(password, 10);

    const createUser = await Users.create({
      email,
      password: cryptedPassword,
      fullname,
      role,
      department,
      canEdit,
    });

    if (!createUser) {
      res.status(400).json({ message: "Something went wrong while creating user", success: false });
      return;
    }
    res.status(201).json({ message: "User created successfully!", success: true });
    return
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    res.status(500).json({ message: "Internal server error", success: true });
    return;
  }
};

const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All credentials are necessary", success: false });
      return;
    }

    const findExistingUser = await Users.findOne({ email });

    if (!findExistingUser) {
      res.status(400).json({ message: "Couldn't find User", success: false });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, findExistingUser.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials", success: false });
      return;
    }

    const token = jwt.sign(
      {
        userId: findExistingUser._id,
        role: findExistingUser.role,
        department: findExistingUser.department,
        fullname: findExistingUser.fullname
      },
      process.env.SECRET_KEY!,
      { expiresIn: "100d" }
    );

    res.status(200).json({ message: "Logged In Successfully!", token, success: true });
    return;
  } catch (error) {
    console.error("Error Occurred while logging in", error);
    res.status(500).json({ message: "Internal Server Error!", success: false });
    return;
  }
};

export { registerUser, loginUser };
