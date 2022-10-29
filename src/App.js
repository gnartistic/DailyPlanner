import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import Home from './Components/Home';
import Login from './Components/Login';
import Confirmation from './Components/Signup/Confirmation';

function App ()
{
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='confirmation' element={<Confirmation />} />
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
