import React, {useState, useEffect} from 'react';
import logo from "../../assets/react.svg";
import ListagemCapacidades from "./ListagemCapacidades";
import ListagemRecursos from "./ListagemRecursos";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'
import axios from 'axios';
import capacidades from '../../assets/capacidades.json';

const Home = () => {
  const [clicou, setClicou] = useState(false);
  const [trocar, setTrocar] = useState(false);
  const [cor, setCor] = useState('white');
  const [corFundo, setCorFundo] = useState('black');
  const [uuid, setUUID] = useState('86e5d735-622a-4896-98c9-4e85f1246c4d');
  // const [uuid, setUUID] = useState(capacidades[0].id);
  const [temperatura, setTemperatura] = useState(23);
  const [umidade, setUmidade] = useState(85);
  const [pressao, setPressao] = useState(700);
  const [gas, setGas] = useState(30);
  const [profundidade, setProfundidade] = useState(100);
  const [dia, setDia] = useState(1);
  const [mes, setMes] = useState(7);
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
    var temperaturaAtual = temperatura;
    var umidadeAtual = umidade;
    var pressaoAtual = pressao;
    var gasAtual = gas;
    var profundidadeAtual = profundidade;

    do{
      diaAtual = diaAtual + 1;
      do{
        horaAtual = horaAtual + 1;

        if(profundidadeAtual > 10){
          if(horaAtual >= 6 && horaAtual <= 7){
            profundidadeAtual = profundidadeAtual - 5;
            temperaturaAtual = temperaturaAtual + .05;
            umidadeAtual = umidadeAtual + .05;
            pressaoAtual = pressaoAtual + 30;
            gasAtual = gasAtual + .35;
          }
          else if(horaAtual >= 10 && horaAtual <= 12){
            profundidadeAtual = profundidadeAtual - 10;
            temperaturaAtual = temperaturaAtual + 1;
            umidadeAtual = umidadeAtual + .05;
            pressaoAtual = pressaoAtual + 50;
            gasAtual = gasAtual + .35;
          }
          else if(horaAtual >= 12 && horaAtual <= 14){
            profundidadeAtual = profundidadeAtual - 20;
            temperaturaAtual = temperaturaAtual + 1;
            umidadeAtual = umidadeAtual + .1;
            pressaoAtual = pressaoAtual + 50;
            gasAtual = gasAtual + .45;
          }
          else if(horaAtual >= 18 && horaAtual <= 20){
            profundidadeAtual = profundidadeAtual - 10;
            temperaturaAtual = temperaturaAtual + 1;
            umidadeAtual = umidadeAtual + .05;
            pressaoAtual = pressaoAtual + 50;
            gasAtual = gasAtual + .35;
          }
        } else if (profundidadeAtual >=0 && profundidadeAtual <= 10){
          temperaturaAtual = temperatura;
          umidadeAtual = umidade;
          pressaoAtual = pressao;
          gasAtual = gas;
          profundidadeAtual = profundidade;
        }
        
        axios.post('http://iot.ipt.br:8000/adaptor/resources/' + uuidAtual + '/data',
        {
          "data":{
            "environment_monitoring":[{
              "temperatura_gastron":temperaturaAtual,
              "umidade_gastron":umidadeAtual,
              "pressao_gastron":pressaoAtual,
              "gas_gastron":gasAtual,
              "profundidade_gastron":profundidadeAtual,
              "date": "2024-"+mesAtual+"-"+diaAtual +"T"+horaAtual +":00:00.000Z"
            }]
          }
        }
        )
        .then(response => response)
        .catch(err => console.log(err))
      }while(horaAtual < 24);
      horaAtual = 0;
    }while(diaAtual <= 31);

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
