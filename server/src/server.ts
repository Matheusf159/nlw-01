import express from 'express' // é preciso instalar a tipagem desse módulo. Já que estamos trabalhando com TypeScript: npm install @types/express
import cors from 'cors' // importando o cors, precisa instalar o tipo: npm install @types/cors -D
import path from 'path' //lida com caminhos dentro do node
import routes from './routes' // importando as rotas
import { errors } from 'celebrate'

const app = express() // criando a aplicação

app.use(cors()) // define quais endereços externos vai ter acesso a aplicação
app.use(express.json()) // faz com que o express entenda o corpo da nossa requesição no formato json
app.use(routes)

// express.static() serve arquivos estáticos de uma pasta específica
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))) // acessando as imagens dos itens

app.use(errors()) // lida como se retorna os erros

app.listen(3333) // aqui escolhemos a porta para rodar nossa aplicação