import express from 'express'
import verifyingUser from '../middleware/verifyUserRole';
import { gettingUserInformations } from '../controllers/userActivity';

const activityRouter = express.Router();

activityRouter.get('/personalInformations', verifyingUser, gettingUserInformations);

activityRouter.post('/checkIn', verifyingUser,);

export default activityRouter;
