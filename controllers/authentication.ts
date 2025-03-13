import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Users from '../models/users';
import jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, department, canEdit } = req.body;

    if (!email || !password || !role || !department || canEdit === undefined) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    // const findExistingUsername = await Users.findOne({email});

    // if(findExistingUsername){
    //   res.status(400).json({message : "Username already exist"});
    //   return;
    // }

    if (!['head', 'employee'].includes(role)) {
      res.status(400).json({ message: "Role must be either 'head' or 'employee'!" });
      return;
    }

    const cryptedPassword = bcrypt.hashSync(password, 10);

    const createUser = await Users.create({
      email,
      password: cryptedPassword,
      role,
      department,
      canEdit,
    });

    if(!createUser){
      res.status(400).json({message : "Something went wrong while creating user"});
      return
    }

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error occurred while registering user:", error);

    // if (process.env.NODE_ENV === 'development') {
    //   res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    //   return;
    // }

    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req : Request, res : Response ) : Promise<void> => {
  try{
    const {email , password} = req.body;

    if(!email || !password){
      res.status(400).json({message : "All credentials are necessary"});
    }

    const findExistingUser = await Users.findOne({email});

    if(!findExistingUser){
      res.status(400).json({message : "Couldn't find User"});
    }

    const token = jwt.sign({email} , process.env.SECRET_TOKEN , {expiresIn : '100d'});

    res.status(200).json({message : "Logged In Sucessfully!" , token});

    if(!token){
      res.status(400).json({message : "Something went wrong while making token!"});
    }
  }
  catch(error){
    console.error("Error Occured while loggin in" , error.message );
    res.status(500).json({message : "Internal Server Error!"});
    return
  }  
}



export { registerUser };