import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom' // conceito de SPA, evita que página recarregue toda
import { FiArrowLeft } from 'react-icons/fi' // importando ícone
import { Map, TileLayer, Marker } from 'react-leaflet' // adicionar a tipagem:  npm install @types/react-leaflet -D
import axios from 'axios' // importando o axios
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api' // importando a api

import Dropzone from '../../components/Dropzone'

import './styles.css' // importando o css

import logo from '../../assets/logo.svg' // importando a img logo.svg


// informa o tipo de cada item que retorna da api
interface Item {
    id: number,
    title: string,
    image_url: string
}

// informa o tipo da sigla (UF)
interface IBGEUFResponse {
    sigla: string
}

// informa o tipo do nome da cidade
interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {
    // criação de estados
    const [items, setItems] = useState<Item[]>([]) // <Item[]> define que Item é um array
    const [ufs, setUfs] = useState<string[]>([]) // <string[]> define que é um vetor de textos
    const [cities, setCities] = useState<string[]>([]) // estado que armazena cities

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]) // carrega a posição do usuário no mapa

    //estado que irá armazenar um objeto que contém os campos
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedUf, setSelectedUf] = useState('0') // estado que armazena qual a UF selecionada
    const [selectedCity, setSelectedCity] = useState('0') // estado que armazena as cidades selecionada
    const [selectedItems, setSelectedItems] = useState<number[]>([]) // estado que informa os itens selecionados pelos usuários
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedFile, setSelectedFile] = useState<File>()

    // fim da criação dos estados

    const history = useHistory()

    // identifica a posição do usuário
    useEffect(() => {
        // retorna a posição atual do usúario assim que abre a aplicação
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])

    // carrega a api
    // função useEffect(qual função executar, quando executar)
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    // obtendo os estados do país
    useEffect(() => {
        //com isso ele não irá utilizar a nossa baseURL
        // <IBGEUFResponse[]> define que IBGEUFResponse é um array
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla) // para obter todas as siglas

            setUfs(ufInitials)
        })
    }, [])

    // obtendo as cidades do estado
    useEffect(() => {
        // carregar as cidades sempre que a UF mudar
        if (selectedUf === '0'){
            return
        }

         // <IBGECityResponse[]> define que IBGEUFResponse é um array
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome) // para obter todas as siglas

                setCities(cityNames)
             })
    }, [selectedUf])

    // função chamada quando a UF for mudada
    // <HTMLSelectElement> informa o que está sendo alterado
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value // obtem as uf

        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value // obtem as cidades

        setSelectedCity(city)
    }

    // função do usuário selecionar a localização no mapa
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]) // retorna a lat e o long selecionada no mapa
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target

        // ... faz com que se copia todos os dados e armazene nessa variável
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id) // verifica se clicou num item selecionado antes

        if (alreadySelected >= 0){
            // desmarca o item, remove o array
            const filteredItems = selectedItems.filter(item => item !== id) // contem todos os itens menos o que precisa remover
            
            setSelectedItems(filteredItems)
        }else{
            // seleciona mais de um item
            setSelectedItems([ ...selectedItems, id ])
        }
    }

    // função utilizada para fazer o envia do ponto de coleta para api
    async function handleSubmit(event: FormEvent){
        event.preventDefault()


        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        // obtém os dados para enviar para pai
        const data = new FormData ()
        
        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        
        if(selectedFile){
            data.append('image', selectedFile)
        }

        // cria um ponto de coleta na api
        await api.post('points', data)

        alert('Ponto de coleta criado!')

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} zoom={15} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                            key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint 