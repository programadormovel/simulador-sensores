import logo from "../../assets/react.svg";
import ListagemCapacidades from "./ListagemCapacidades";
import ListagemRecursos from "./ListagemRecursos";

const Home = () => {

  return (
    <>
      <div>
        <button 
        type="button" value={""} onClick={() => {}}>
          <img className="logo" src={logo} alt="Botão de inicialização do sistema" />
          INICIAR
        </button>
        <div className="flex-grow-1 flex-column 
              flex-wrap justify-content-evenly">
          <ListagemCapacidades style={{width:"50px"}} />
          <ListagemRecursos style={{width:"50px"}} />
        </div>
        
        
      </div>
    </>
  );
};

export default Home;
