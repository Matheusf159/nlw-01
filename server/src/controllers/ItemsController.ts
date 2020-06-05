import {Request, Response} from 'express' // informando para o TypeScript o tipo: request e response
import knex from "../database/connection" // importando a conexão com banco de dados

class ItemsController {
    async index(request: Request, response: Response) {
        // sempre que usar uma query no banco de dados, é necessário usar o "await", pois pode demorar
        const items = await knex('items').select('*') // buscando todos os campos da tabela
    
        // transforma os dados em um novo formato mais acessível para quem pede a requisição
        const serializedItems = items.map(item => { // map vai percorrer todos os itens q retornou do banco de dados
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.100.7:3333/uploads/${item.image}`
            }
        })
        return response.json(serializedItems)
    }
}

export default ItemsController