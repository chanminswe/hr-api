import express from 'express';
import verifyHrRole from '../middleware/verifyHrRole';
import { addingHolidays } from '../controllers/holidaysManagement';

const holidaysRouter = express.Router();

holidaysRouter.post("/addHoliday", verifyHrRole, addingHolidays);

export default holidaysRouter;
