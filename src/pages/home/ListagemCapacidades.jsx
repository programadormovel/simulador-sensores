import { useState, useEffect } from "react";
import axios from "axios";

const ListagemCapacidades = () => {

    const [dadosColetados, setDadosColetados] = useState([]);

    const requisicao = () => {
        axios.get('http://iot.ipt.br:8000/catalog/capabilities')
        .then((response) => {
            setDadosColetados(response.data.capabilities)
        })
        .catch((error)=> {
            console.log(error);
          });
    }

    const Listagem = () => {    
        return (
            dadosColetados.map((dados)=>{
                return (
                    <li key={dados.id}>
                        {dados.name}
                    </li>
                )
            })
        )
    }

    useEffect(()=>{
        requisicao()
    }, [])

    useEffect(()=>{
        console.log(dadosColetados)     
    }, [dadosColetados])

    return (
        <div className="Listagem">
            <ul>
                <Listagem />
            </ul>
        </div>
    )
}
export default ListagemCapacidades;
