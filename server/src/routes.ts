import express, { json } from 'express'
import { celebrate, Joi } from 'celebrate'

import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController' // importando o PointsController
import ItemsController from './controllers/ItemsController' // importando o ItemsController

const routes = express.Router()
const upload = multer(multerConfig)

const pointsController = new PointsController() // cria uma instancia da classe PointsController
const itemsController = new ItemsController() // cria uma instancia da classe ItemsController


routes.get('/items', itemsController.index) // lista todos os itens que estão cadastrados no banco de dados
routes.get('/points', pointsController.index) // listar pontos(por filtro: city, uf, items)
routes.get('/points/:id', pointsController.show) // listar um ponto de coleta específico

routes.post(
    '/points', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()

        })
    }, {
        abortEarly: false
    }),
    pointsController.create) // cadastro de pontos de coleta


export default routes // serve para exportar as routas para outros arquivos terem acesso
