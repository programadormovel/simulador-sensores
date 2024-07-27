import React, {useState, useEffect} from 'react';
import logo from "../../assets/react.svg";
import ListagemCapacidades from "./ListagemCapacidades";
import ListagemRecursos from "./ListagemRecursos";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'
import axios from 'axios';

const Home = () => {
  const [clicou, setClicou] = useState(false);
  const [trocar, setTrocar] = useState(false);
  const [cor, setCor] = useState('white');
  const [corFundo, setCorFundo] = useState('black');
  const [uuid, setUUID] = useState('e7e529dc-0d06-4771-a2f5-3efa52c51f6b');
  const [temperatura, setTemperatura] = useState(23);
  const [umidade, setUmidade] = useState(85);
  const [pressao, setPressao] = useState(700);
  const [gas, setGas] = useState(30);
  const [profundidade, setProfundidade] = useState(100);
  const [dia, setDia] = useState(1);
  const [mes, setMes] = useState(6);
  const [hora, setHora] = useState(0);
  
  // const dados = {
  //   "data":{
  //     "environment_monitoring":[{
  //       "temperatura_gastron":temperatura,
  //       "umidade_gastron":umidade,
  //       "pressao_gastron":pressao,
  //       "gas_gastron":gas,
  //       "profundidade_gastron":profundidade,
  //       "date": "2024-"+mes+"-"+dia+"T"+hora+":00:00.000Z"
  //     }]
  //   }
  // }

  async function trocaValores(){
    var diaAtual = dia - 1;
    var mesAtual = mes;
    var horaAtual = hora - 1;
    var uuidAtual = uuid;

    do{
      diaAtual = diaAtual + 1;
      do{
        horaAtual = horaAtual + 1;
        axios.post('http://iot.ipt.br:8000/adaptor/resources/' + uuid + '/data',
        {
          "data":{
            "environment_monitoring":[{
              "temperatura_gastron":temperatura,
              "umidade_gastron":umidade,
              "pressao_gastron":pressao,
              "gas_gastron":gas,
              "profundidade_gastron":profundidade,
              "date": "2024-"+mes+"-"+diaAtual +"T"+horaAtual +":00:00.000Z"
            }]
          }
        }
        )
        .then(response => response)
        .catch(err => console.log(err))
      }while(horaAtual < 24);
      horaAtual = 0;
    }while(diaAtual < 31);

  }

  // async function inserirDados(){
  //   axios.post('http://iot.ipt.br:8000/adaptor/resources/' + uuid + '/data',
  //     dados
  //   )
  //   .then(response => response)
  //   .catch(err => console.log(err))
  // }

  useEffect(() =>{
    if (clicou) {
      setCor('white');
      setCorFundo('black');
      trocaValores();
    }

    return(()=>{
      setCor('white')
      setCorFundo('black')
      setClicou(false)
    })
  }, [clicou])

  // useEffect(() =>{
  //   if(trocar) inserirDados();
  //   return (()=>{
  //     setTrocar(false)
  //   })
  // }, [hora, trocar])

  return (
    <>
      <div>
        <button style={{backgroundColor: corFundo,color: cor}}
        type="button" onClick={()=>setClicou(true)}>
          <img className="logo" src={logo} alt="Botão de inicialização do sistema" />
          {(clicou)?'PROCESSANDO':'INICIAR'}
        </button>
        <div className="row-cols-2 flex-column flex-grow-1 flex-lg-wrap">
          <ListagemCapacidades />
          <ListagemRecursos />
        </div>
      </div>
    </>
  );
};

export default Home;
