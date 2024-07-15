import { useState, useEffect } from "react";
import axios from "axios";

const ListagemRecursos = () => {

    const [dadosColetados, setDadosColetados] = useState([]);

    const requisicao = () => {
        axios.get("http://iot.ipt.br:8000/collector/resources/332cb564-475a-4236-819b-0b188ace0b4e/data/")
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
                    <li style={{textDecoration: 'none'}}>
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
        <div style={{backgroundColor: 'white', color:'black'}}>
            <ul style={{margin:'32px', textDecoration: 'none'}}>
                <Listagem />
            </ul>
        </div>
    )
}
export default ListagemRecursos;
