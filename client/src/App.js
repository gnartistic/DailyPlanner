import './App.scss';
import { Routes, Route } from 'react-router-dom';
import
  {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
  } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Signup from './Components/Signup';
import Layout from './Components/Layout';
import Home from './Components/Home';
import Login from './Components/Login';
import Confirmation from './Components/Signup/Confirmation';
import Main from './Components/ToDoList'

const httpLink = createHttpLink( {
  uri: 'http://localhost:3001/graphql',
} );

const authLink = setContext( ( _, { headers } ) =>
{
  const token = localStorage.getItem( 'id_token' );
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${ token }` : '',
    },
  };
} );

const client = new ApolloClient( {
  link: authLink.concat( httpLink ),
  cache: new InMemoryCache(),
} );

function App ()
{
  return (
    <>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='confirmation' element={<Confirmation />} />
            <Route path='main' element={<Main/>}/>
            <Route path='signup' element={<Signup />} />
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
      </ApolloProvider>
    </>
  );
}

export default App;
