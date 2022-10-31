import './index.scss'
import pixelMe from '../../assets/pixelMe.png'
import { useNavigate } from 'react-router-dom';
import Loader from 'react-loaders';

const Confirmation = () =>
{
    const navigate = useNavigate();

    const navigateToMain = () =>
    {
        navigate( '/main' );
    }
    return (
        <>
        <div className='form' onClick={() =>
        {
            return navigateToMain();
        }
        }>
            <div className='form-container'>
                <div className="body">
                    <div className="header confirm">
                    <div className="sign-up-container">
                            <h1>Hey There!</h1>
                        </div>
                        <img src={pixelMe} alt='Charlie in pixel form'/>
                        <h2>My name is Charlie (: <br /> <br /> I created this app to boost my daily productivity. I'm sharing it in hopes that it will help someone as much as it has helped me.</h2>
                        <h4>click anywhere to continue.</h4>
                    </div> 
                </div>
            </div>
            </div>
            <Loader type="ball-scale-ripple-multiple" />
            </>
    )
}

export default Confirmation