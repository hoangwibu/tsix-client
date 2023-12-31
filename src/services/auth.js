import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import uniqid from 'uniqid'
//require('dotenv').config()
const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const registerService = ({email,password}) => new Promise( async (resolve,reject) =>{
    try {
        
        const data_user = {
            id_user: uniqid(),
            email: email,
            password: hashPassword(password),
            //role:1
        }
        
        const userExist = await db.User.findOne({ where: { email: data_user.email }, raw:true })
        console.log('processing userExist....',userExist);
        const response = userExist? false : await db.User.create(data_user)  
        console.log('processing response....',response);
        const token = response?  jwt.sign(
            {
                id_user:data_user.id_user,
                email:data_user.email
            },
            process.env.SECRET_KEY,
            {expiresIn:'30d'}
        ) : null 
        console.log('processing token....',token);

        resolve({
            err:token? 0 : 2,
            msg: token? 'Đăng ký thành công!': 'Email đã tồn tại!',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})
export const loginService = ({email,password}) => new Promise( async (resolve,reject) =>{
    try {
        const user = await db.User.findOne({ where: { email }, raw:true })
        console.log('processing response....',user);
        const isCorrect = user? bcrypt.compareSync(password,user.password) : false
        const token = isCorrect?  jwt.sign(
            {
                id_user:user.id_user,
                email:user.email
            },
            process.env.SECRET_KEY,
            {expiresIn:'30d'}
        ) : null
        console.log('processing token....',token);

        resolve({
            err:token? 0 : 2,
            msg: token? 'Đăng nhập thành công!': 'Sai email hoặc mật khẩu!',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})