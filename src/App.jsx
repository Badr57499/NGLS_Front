import Register from './Components/Register'
import Login from './Components/Login'
import HomePage from './Components/Homepage'
import Videos from './Components/Videos'
import Annoucments from './Components/Annoucments'
import Footer from './Components/Footer'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/ans' element={<Annoucments />}></Route>
        <Route path='/videos' element={<Videos />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
