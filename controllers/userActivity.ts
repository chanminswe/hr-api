import { Request, Response } from "express";

const gettingUserInformations = async (req : Request , res : Response): Promise<void> => {
  res.status(200).json({message : "User Informations Sucessfully retrieved"}); 
  return;
}

export {gettingUserInformations};