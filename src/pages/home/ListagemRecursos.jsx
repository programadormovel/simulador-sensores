import { useState, useEffect } from "react";
import axios from "axios";

const ListagemRecursos = () => {

    const [dadosColetados, setDadosColetados] = useState([]);

    const requisicao = () => {
        axios.get("http://iot.ipt.br:8000/collector/resources/e7e529dc-0d06-4771-a2f5-3efa52c51f6b/data/")
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
