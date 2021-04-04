import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home'
import {BrowserRouter,Route} from 'react-router-dom';

function App()
{
  
  return (
    <div>
        <BrowserRouter>
                <Route exact path="/"><Home /></Route>
        </BrowserRouter>
    
    </div>
    
   
  );
}

export default App;
