import express from 'express';
import verifyHrRole from '../middleware/verifyHrRole';
import { addingHolidays } from '../controllers/protected/management/holidaysManagement';

const holidaysRouter = express.Router();

holidaysRouter.post("/addHoliday", verifyHrRole, addingHolidays);

export default holidaysRouter;
