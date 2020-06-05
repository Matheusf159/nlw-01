import {Request, Response} from 'express' // informando para o TypeScript o tipo: request e response
import knex from "../database/connection" // importando a conexão com banco de dados

class PointsCrontroller {
    // lista os pontos(filtros: city, uf, items) por Query Params
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query

        // converte os items em um array
        const parsedItems = String(items).split(',').map(item => Number(item.trim()))
        // função split separa a string em várias strings de acordo com o parâmetro passado, função trim tira os espaçamentos

        // pega os pontos e faz a query para o banco de dados
        // distinct evita q os pontos se repitam
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => { 
            return {
                ...points,
                image_url: `http://192.168.100.7:3333/uploads/${point.image}`
            }
        })


        return response.json(serializedPoints)
    }

    // mostra o ponto de coleta
    async show(request: Request, response: Response){
        // busca o id do ponto de coleta
        const { id } = request.params
        // busca o ponto de coleta
        const point = await knex('points').where('id', id).first() // first retorna um único registro

        // caso não encontre o point
        if(!point){
            return response.status(400).json({ message: 'Point not fouhd' })
        }

        const serializedPoint =  {
            ...point,
            image_url: `http://192.168.100.7:3333/uploads/${point.image}`
        }

        // lista os itens do ponto de coleta
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        // caso encontre o point
        return response.json({ point: serializedPoint, items })
    }

    // cadastro de pontos de coleta
    async create (request: Request, response: Response) {
        // campos necessários para criar um ponto de coleta
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        // evita que uma query execute quando alguma outra falha
        const trx = await knex.transaction()

        // um objeto com os dados do ponto
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        // cria o ponto
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })
    
        // relacionamento com a tabela de itens
        await trx('point_items').insert(pointItems)

        await trx.commit() // ele irá fazer os inserts na base de dados
    
        return response.json({
            id: point_id,
            ... point // retorna todos os dados do ponto
        })
    }
}

export default PointsCrontroller