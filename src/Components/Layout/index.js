import { Outlet } from 'react-router-dom';
import './index.scss';
import Sidebar from '../Sidebar';
import Home from '../Home';
const Layout = () => {
    return <div className='App'>
        <div className='page'>
            <Outlet />
        </div>
        </div>
}

export default Layout