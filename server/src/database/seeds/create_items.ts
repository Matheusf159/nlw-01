import Knex from 'knex'

export async function seed(knex: Knex){
    // como o insert pode demorar, nós colocamos o await antes do knex
    await knex('items').insert([
        {title: 'Lâmpadas', image: 'lampadas.svg'},
        {title: 'Pilhas e Baterias', image: 'baterias.svg'},
        {title: 'Papéis e Papelão', image: 'papeis-papelao.svg'},
        {title: 'Resíduos Eletrônicos', image: 'eletronicos.svg'},
        {title: 'Resíduos Orgânicos', image: 'organicos.svg'},
        {title: 'Óleo de Cozinha', image: 'oleo.svg'}

    ]) // insere dados na tabela. Nesse caso eles estão inserindo objetos que serão os registros na tabela
}