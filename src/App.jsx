import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import ListagemCapacidades from './pages/home/ListagemCapacidades'

const App = () => {
   return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/listagem" element={<ListagemCapacidades/>} />
    </Routes>
  )
}

export default App
