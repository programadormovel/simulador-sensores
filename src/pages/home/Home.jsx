import React, {useState, useEffect} from 'react';
import logo from "../../assets/react.svg";
import ListagemCapacidades from "./ListagemCapacidades";
import ListagemRecursos from "./ListagemRecursos";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css'
import axios from 'axios';
import recursos from '../../assets/recursos.json';

const Home = () => {
  const [clicou, setClicou] = useState(false);
  const [trocar, setTrocar] = useState(false);
  const [cor, setCor] = useState('white');
  const [corFundo, setCorFundo] = useState('black');
  const [uuid, setUUID] = useState('2902b8e8-91ab-4139-a376-715ebf7ff187');
  // const [uuid, setUUID] = useState(capacidades[0].id);
  const [temperatura, setTemperatura] = useState(21.99);
  const [umidade, setUmidade] = useState(62.87);
  const [pressao, setPressao] = useState(645.42);
  const [gas, setGas] = useState(34.15);
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
    var temperaturaAtual = temperatura;
    var umidadeAtual = umidade;
    var pressaoAtual = pressao;
    var gasAtual = gas;
    var profundidadeAtual = profundidade;

    do{
      diaAtual = diaAtual + 1;
      do{
        horaAtual = horaAtual + 1;

        if(profundidadeAtual > 5){
          if(horaAtual >= 6 && horaAtual <= 7){
            profundidadeAtual = profundidadeAtual - 3;
            temperaturaAtual = temperaturaAtual + .08;
            umidadeAtual = umidadeAtual + .02;
            pressaoAtual = pressaoAtual + .46;
            gasAtual = gasAtual + .07;
          }
          else if(horaAtual > 7 && horaAtual < 10){
            profundidadeAtual = profundidadeAtual - 7;
            temperaturaAtual = temperaturaAtual + .08;
            umidadeAtual = umidadeAtual + .02;
            pressaoAtual = pressaoAtual + .46;
            gasAtual = gasAtual + .07;
          }
          else if(horaAtual >= 10 && horaAtual <= 12){
            profundidadeAtual = profundidadeAtual - 9;
            temperaturaAtual = temperaturaAtual + .08;
            umidadeAtual = umidadeAtual + .02;
            pressaoAtual = pressaoAtual + .46;
            gasAtual = gasAtual + .07;
          }
          else if(horaAtual >= 12 && horaAtual <= 14){
            profundidadeAtual = profundidadeAtual - 11;
            temperaturaAtual = temperaturaAtual + .09;
            umidadeAtual = umidadeAtual + .01;
            pressaoAtual = pressaoAtual + .47;
            gasAtual = gasAtual + .07;
          }
          else if(horaAtual > 14 && horaAtual <= 18){
            profundidadeAtual = profundidadeAtual - 15;
            temperaturaAtual = temperaturaAtual + .08;
            umidadeAtual = umidadeAtual + .02;
            pressaoAtual = pressaoAtual + .46;
            gasAtual = gasAtual + .07;
          }else if(horaAtual >= 19 && horaAtual <= 21){
            profundidadeAtual = profundidadeAtual - 20;
            temperaturaAtual = temperaturaAtual + .08;
            umidadeAtual = umidadeAtual + .02;
            pressaoAtual = pressaoAtual + .46;
            gasAtual = gasAtual + .07;
          }
        } else if (profundidadeAtual >=0 && profundidadeAtual <= 0){
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
