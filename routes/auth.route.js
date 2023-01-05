const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/registration',
    [
        check('email', 'Invalid emil').isEmail(),
        check('password', 'Invalid password').isLength({min: 6})
    ],
    async (req, res) => {
    try{

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Registration failed, incorrect data"
            })
        }

        const {email, password} = req.body

        const isUsed = await User.findOne({email})

        if (isUsed){
           return res.status(300).json({message: 'Email already registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            email, password: hashedPassword
        })

        await user.save()

        res.status(201).json({message: 'User created'})
    }catch (e) {
        console.log(e)
    }
})


router.post('/login',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').exists()
    ],
    async (req, res) => {
        try{

            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Login failed"
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user){
                return res.status(400).json({message: "User not found"})
            }

            const isMatch = await bcrypt.compare(password, user.password)


            if(!isMatch){
                return res.status(400).json({message: "Invalid password"})
            }

            const jwtSecret = '61d6fe0c82b83217d6e0b9fddf866252f2'

            const token = jwt.sign(
                {userId: user.id},
                jwtSecret,
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})





        }catch (e) {
            console.log(e)
        }
    })



module.exports = router