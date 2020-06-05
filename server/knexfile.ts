import path from 'path' //lida com caminhos dentro do node

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite') // diz qual vai ser o arquivo que armanezaremos o banco de dados
    },

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations') // pasta onde estará nossas migrations
    },

    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds') // pasta onde estará nossas migrations
    },

    useNullAsDefault: true
}