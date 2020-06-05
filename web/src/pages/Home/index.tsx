import React from 'react'
import { FiLogIn } from 'react-icons/fi' // importando os ícones
import { Link } from 'react-router-dom' // conceito de SPA, faz com que não recarrega a página toda

import './styles.css' // importando o css

import logo from '../../assets/logo.svg' // importando a img logo.svg

// cria o componente
const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home // exportando nosso componente Home