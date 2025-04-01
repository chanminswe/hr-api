import express from 'express'
import verifyingUser from '../middleware/verifyUser';
import { checkIn, checkOut, gettingAttendanceInformation } from '../controllers/protected/employees/userActivity';
import { requestingLeave } from '../controllers/protected/employees/leaveRequest';
const activityRouter = express.Router();

activityRouter.get('/attendance', verifyingUser, gettingAttendanceInformation);

activityRouter.post('/checkIn', verifyingUser, checkIn);

activityRouter.post('/checkOut', verifyingUser, checkOut);

activityRouter.post('/requestLeave', verifyingUser, requestingLeave);

activityRouter.get('/inbox', verifyingUser,);

export default activityRouter;
