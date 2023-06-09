import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL endpoint
const httpLink = createHttpLink({
	uri: '/graphql',
});

// Middleware to attach token to every request
const authLink = setContext((_, { headers }) => {
	// Get token from local storage
	const token = localStorage.getItem('id_token');

	// Return headers with bearer token
	return {
		headers: {
			...headers,
			authorization: token 
      ? `Bearer ${token}` 
      : '',
		},
	};
});

const client = new ApolloClient({
	// Set up ApolloClient with authorization middleware
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<SearchBooks/>} />
          <Route exact path='/saved' element={<SavedBooks/>} />
          <Route path='*' element={<h1 className='display-2'>Wrong page!</h1>} />
          </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
