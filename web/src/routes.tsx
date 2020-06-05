import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom' // é preciso instalar a tipagem: npm install @types/react-router-dom -D

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Routes = () => {
    // cada rota será criado com Route
    // exact irá fazer uma verificação de igualdade nos caminhos das rotas
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" />
        </BrowserRouter>
    )
}

export default Routes
