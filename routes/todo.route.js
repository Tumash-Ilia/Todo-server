const {Router} = require('express')
const router = Router()
const Todo = require('../models/Todo')


/**
 * Pridani ukolu
 */
router.post('/add', async (req, res) =>{
    try {
        const {text, userId} = req.body

        const todo = await new Todo({
            text,
            owner : userId,
            completed: false,
            important: false
        })

        await todo.save()

        res.json(todo)

    }catch (e) {
        console.log(e)
    }
} )

/**
 * Ziskani ukolu
 */
router.get('/', async (req, res) => {
    try {
        const {userId} = req.query

        const todo = await Todo.find({ owner: userId})

        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Smazani ukolu
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({_id: req.params.id})
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Oznacit jako hotovy
 */
router.put('/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id})
        todo.completed = !todo.completed

        await todo.save()
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Oznacit jako dulezity
 */
router.put('/important/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id})
        todo.important = !todo.important

        await todo.save()
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Uprava ukolu
 */
router.put('/update/:id', async (req, res) => {
    try {
        const {text} = req.body
        const todo = await Todo.findOneAndUpdate({_id: req.params.id}, {text: text}, {new: true})
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/***
 * Ziskat jeden ukol podle id
 */
router.get('/get/:id', async (req, res) => {
    try {
        const {text} = req.body
        const todo = await Todo.findById({_id: req.params.id})
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Seznam hotovych ukolu
 */
router.get('/completed', async (req, res) => {
    try {
        const {userId} = req.query
        const todo = await Todo.find({ owner: userId, completed: true})
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})

/**
 * Seznam nesplnenych ukolu
 */
router.get('/uncompleted', async (req, res) => {
    try {
        const {userId} = req.query
        const todo = await Todo.find({ owner: userId, completed: false})
        res.json(todo)
    }catch (e) {
        console.log(e)
    }
})



module.exports = router