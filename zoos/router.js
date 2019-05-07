const router = require('express').Router();

const knex = require('knex');

const knexConfig = {
    client : 'sqlite3',
    useNullAsDefault: true,
    connection:{
        filename:'./data/lambda.sqlite3'
    }
}

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('zoos')
    .then(zoos => {
        res.status(200).json(zoos)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
    db('zoos')
    .insert(req.body)
    .then(zoo =>{
        const [id] =zoo;
        db('zoos')
        .where({ id })
        .first()
        .then(zoo => {
            if(zoo){
                res.status(200).json(zoo)
            }else{
                res.status(400).json({ message: "required field not filled"})
            }
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
    db('zoos')
    .where({ id:req.params.id })
    .first()
    .then(zoo => {
        if(zoo){
            res.status(200).json(zoo)
        }else{ res.status(404).json({ message: "No Such Zoo"})}
    })
    .catch(err => { res.status(500).json(err) })
})

router.put('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
        if(count > 0){
            db('zoos')
            .where({ id: req.params.id })
            .first()
            .then(zoo => {
                res.status(200).json(zoo)
            })
        }else{ res.status(404).json({ message:"can not find this Zoo"}) }
    })
    .catch(err => { res.status(500).json(err)})
})

router.delete('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
        if(count > 0){
            res.status(200).json({message: "This Zoo closed permanently"})
        }else{ res.status(404).json({ message: "you can not close down a none exist zoo" }) }
    })
    .catch(err => { res.status(500).json(err) })
})





router.use((req, res, next) => {
    res.status(404).json({ message: "Nice try, but no"})
})
module.exports = router;