import express from 'express';
const router = express.Router();


router.post('/register' , (req , res) => {
  const {username , password} = req.body;
  console.log(`${username} and ${password}`)
  res.json({
    message : `Username ${username} registered sucessfully!`
  })
})

router.post('/login' , (req, res ) => {
  const {username , password} = req.body;
  res.json({
    message : `Username ${username} logged in sucessfully!`
  })
})

export default router;