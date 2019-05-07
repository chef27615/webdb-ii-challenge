const bearRouter = require('express').Router();

const knex = require('knex');

const kc = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
}

const db = knex(kc);

bearRouter.get('/', (req, res) => {
    db('bears')
    .then(bears => {
        res.status(200).json(bears)
    })
    .catch(err => { res.status(500).json(err)})
})

bearRouter.post('/', (req, res) => {
    db('bears')
    .insert(req.body)
    .then(bear => {
        const [id] = bear;
        db('bears')
        .where({ id })
        .first()
        .then(bear => {
            if(bear){
               res.status(200).json(bear) 
            } else{ res.status(400).json({ message: "required field was not filled out"})}
        })
    })
    .catch(err => { res.status(500).json(err)})
})

bearRouter.get('/:id', (req, res) => {
    db('bears')
    .where({ id: req.params.id})
    .first()
    .then(bear => {
        if(bear){
            res.status(200).json(bear)
        }else{ res.status(404).json({ message: "Can not locate the bear" }) }
    })
    .catch(err => { res.status(500).json(err)})
})

bearRouter.delete('/:id', (req, res) => {
    db('bears')
    .where({ id: req.params.id})
    .del()
    .then(bear => {
        if(bear){
            res.status(200).json({ message: "this bear is no longer here" })
        }else{ res.status(404).json({ message: "You can not delete a bear that is not exist"})}
    })
    .catch(err => { res.status(500).json(err)})
})

bearRouter.put('/:id', (req, res) => {
    db('bears')
    .where({ id: req.params.id})
    .update(req.body)
    .then(count => {
        if(count > 0){
            db('bears')
            .where({ id: req.params.id})
            .first()
            .then(updatedBear => {res.status(200).json(updatedBear)})
        }else{ res.status(404).json({ message: "can not locate this bear"})}
    })
    .catch(err => { res.status(500).json(err)})
})



bearRouter.use((req, res, next) => {
    res.status(404).json({ message: "No such bear"})
})

module.exports = bearRouter;