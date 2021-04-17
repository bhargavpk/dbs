import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Route} from 'react-router-dom';

import Home from './pages/Home'
import Faculty from './pages/Faculty'
import Attendance from './pages/faculty/Attendance'
import Grades from './pages/faculty/Grades'
import Student from './pages/Student'
import FacultyProfile from './pages/FacultyProfile'

function App()
{
  
  return (
    <div>
        <BrowserRouter>
                <Route exact path="/" component={Home} />
                <Route exact path="/faculty" component={Faculty} />
                <Route path="/faculty/attendance" component={Attendance} />
                <Route path="/faculty/grade" component={Grades} />
                <Route path="/faculty/profile" component={FacultyProfile}/>
                <Route path="/student" component={Student} />
        </BrowserRouter>
    
    </div>
    
   
  );
}

export default App;
