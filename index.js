const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const app = express()
const PORT = process.env.PORT || 8000
app.use(cors())


app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))



async function start() {
    try {
        await mongoose.connect('mongodb+srv://admin:ponemdC0lOrmGF50@cluster0.vo4vq.mongodb.net/todoapp?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log('Server started on port ' + PORT)
        })
    } catch (e) {
        console.error(e)
    }
}
start()