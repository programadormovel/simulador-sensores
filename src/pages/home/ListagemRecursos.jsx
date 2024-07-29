import { useState, useEffect } from "react";
import axios from "axios";

const ListagemRecursos = () => {

    const [dadosColetados, setDadosColetados] = useState([]);

    const requisicao = () => {
        axios.get("http://iot.ipt.br:8000/collector/resources/af7b7ed2-e5cf-44a5-bd6d-9038afe3c7a5/data/")
        .then((response) => {
            setDadosColetados(response.data.resources[0].capabilities.environment_monitoring)
        })
        .catch((error)=> {
            console.log(error);
          });
    }

    const Listagem = () => {    
        return (
            dadosColetados.map((dados)=>{
                return (
                    <li>
                        <p> 
                            Temperatura: {dados.temperatura_adriano} <br/>
                            Umidade: {dados.umidade_adriano} <br/>
                            Data de Registro: {dados.date}
                        </p>
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
export default ListagemRecursos;
