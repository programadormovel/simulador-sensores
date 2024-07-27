import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import ListagemCapacidades from './pages/home/ListagemCapacidades'
/* The following line can be included in a src/App.scss */
import 'bootstrap/dist/css/bootstrap.min.css';
import ListagemRecursos from './pages/home/ListagemRecursos';

const App = () => {
   return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/listagem-capacidades" element={<ListagemCapacidades/>} />
      <Route path="/listagem-recursos" element={<ListagemRecursos/>} />
    </Routes>
  )
}

export default App
