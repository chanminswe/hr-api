import express from 'express'
import verifyingUser from '../middleware/verifyUser';
import { checkIn, checkOut, gettingAttendanceInformation } from '../controllers/userActivity';
import { requestingLeave } from '../controllers/leaveRequest';
const activityRouter = express.Router();

activityRouter.get('/attendance', verifyingUser, gettingAttendanceInformation);

activityRouter.post('/checkIn', verifyingUser, checkIn);

activityRouter.post('/checkOut', verifyingUser, checkOut);

activityRouter.post('/requestLeave', verifyingUser, requestingLeave);

export default activityRouter;
