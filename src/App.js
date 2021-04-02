import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navig from './nav';
import Fac from './faculty';
import Stud from './student';
import {Image} from 'react-bootstrap';
import {BrowserRouter,Route} from 'react-router-dom';

function App()
{
  
  return (
    <div>
    <Navig />
    <BrowserRouter>
    <Route exact path="/">Welcome to Home

    <Image src="https://picsum.photos/id/1/200/300" fluid></Image>
    </Route>
    <Route path="/Fac"><Fac /></Route>
    <Route path="/Stud"><Stud /></Route>
    </BrowserRouter>
    
    </div>
    
   
  );
}

export default App;
