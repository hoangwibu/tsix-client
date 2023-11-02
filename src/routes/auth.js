import express from 'express'
import * as authController from '../controllers/admin/auth'
const router = express.Router();

router.post('/login',authController.login)
router.get('/login',(req,res)=>{
    res.render('admin/login',{ layout:'login',title:'Login'})
})
router.get('/logout', (req, res) => {
    res.clearCookie('tsixToken'); // Xóa token khỏi cookie
    res.redirect('/auth/login'); // Chuyển hướng người dùng đến trang login
  });
export default router