import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import Users from "../../models/users";
import jwt from "jsonwebtoken";
import { createErrorResponse } from "../../types/errorType";
import { createSuccessResponse } from "../../types/successType";

const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, role, department, canEdit, fullname } = req.body;

    if (!email || !password || !role || !department || !fullname || canEdit === undefined) {
      res.status(400).json(createErrorResponse("All fields are necessary", 400, "Input Error"));
      return;
    }

    if (!["management", "employee", "head", 'executive'].includes(role)) {
      res.status(400).json(createErrorResponse("Invalid Role", 400, "Input Error"));
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
      res.status(400).json(createErrorResponse("Couldn't Create User", 400, "Database Error"));
      return;
    };

    res.status(201).json(createSuccessResponse("Created Successfully", 201));
    return
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    res.status(500).json(createErrorResponse("Internal Server Error", 500, "Server Error"));
    return
  }
};

const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(createErrorResponse("All Credentials are necessary!", 400, "Input Error"));
      return;
    }

    const findExistingUser = await Users.findOne({ email }).select('+password').lean();

    if (!findExistingUser) {
      res.status(400).json(createErrorResponse("All Credentials are necessary!", 400, "Doesn't Exist"));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, findExistingUser.password);

    if (!isPasswordValid) {
      res.status(400).json(createErrorResponse("Invalid Credentails", 400, "Doesn't Exist"));
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

    res.status(200).json(createSuccessResponse("Log In Sucessfully", 200, { token }));
    return;
  } catch (error) {
    console.error("Error Occurred while logging in", error.message);
    res.status(500).json(createErrorResponse("Internal Server Error", 500, "Server Error!"));
    return;
  }
};

export { registerUser, loginUser };
