import knex from 'knex'
import path from 'path' //lida com caminhos dentro do node

// configuração do banco de dados
const connection =knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') // diz qual vai ser o arquivo que armanezaremos o banco de dados
    },
    useNullAsDefault: true
})

export default connection // exportando a conexão com o banco de dados.