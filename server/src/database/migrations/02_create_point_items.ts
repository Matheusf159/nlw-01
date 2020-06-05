import Knex from 'knex'

// função para realizar as alterações no banco (criar a tabela)
export async function up(knex: Knex){
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary() // chave primária da tabela

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points')
            // isso irá criar uma chave estrangeira na tabela points no campo id

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items')
            // isso irá criar uma chave estrangeira na tabela items no campo id

    }) // cria a tabela no banco de dados. Parâmetros(nome, tipo dos campos)
}

// Volta atrás (deletar a tabela)
export async function down(knex: Knex){
    return knex.schema.dropTable('point_items') // deleta a tabela

}