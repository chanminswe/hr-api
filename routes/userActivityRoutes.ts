import express from 'express'
import verifyingUser from '../middleware/verifyUserRole';
import { checkIn, checkOut, gettingUserInformations, requestingLeave } from '../controllers/userActivity';

const activityRouter = express.Router();

activityRouter.get('/personalInformations', verifyingUser, gettingUserInformations);

activityRouter.post('/checkIn', verifyingUser, checkIn);

activityRouter.post('/checkOut', verifyingUser, checkOut);

activityRouter.post('/requestLeave', verifyingUser, requestingLeave)

export default activityRouter;
