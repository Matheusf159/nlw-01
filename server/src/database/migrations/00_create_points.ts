import Knex from 'knex'

// função para realizar as alterações no banco (criar a tabela)
export async function up(knex: Knex){
    return knex.schema.createTable('points', table => {
        table.increments('id').primary() // chave primária da tabela
        table.string('image').notNullable() // notNullable significa que não pode ser nulo
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('whatsapp').notNullable()
        table.decimal('latitude').notNullable()
        table.decimal('longitude').notNullable()
        table.string('city').notNullable()
        table.string('uf', 2).notNullable() // o 2 significa que esperamos 2 caracteres (tamanho do campo)

    }) // cria a tabela no banco de dados. Parâmetros(nome, tipo dos campos)
}

// Volta atrás (deletar a tabela)
export async function down(knex: Knex){
    return knex.schema.dropTable('points') // deleta a tabela

}