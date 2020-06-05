import Knex from 'knex'

// função para realizar as alterações no banco (criar a tabela)
export async function up(knex: Knex){
    return knex.schema.createTable('items', table => {
        table.increments('id').primary() // chave primária da tabela
        table.string('image').notNullable() // notNullable significa que não pode ser nulo
        table.string('title').notNullable()

    }) // cria a tabela no banco de dados. Parâmetros(nome, tipo dos campos)
}

// Volta atrás (deletar a tabela)
export async function down(knex: Knex){
    return knex.schema.dropTable('items') // deleta a tabela

}