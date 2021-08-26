import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Route} from 'react-router-dom';

import Home from './pages/Home'
import FacultyMembers from './pages/FacultyMembers'
import Curriculum from './pages/Curriculum'
import About from './pages/About'
import Faculty from './pages/Faculty'
import Attendance from './pages/faculty/Attendance'
import Grades from './pages/faculty/Grades'
import Student from './pages/Student'
import Institute from './pages/Institute'
import FacultyProfile from './pages/FacultyProfile'

function App()
{
  
  return (
    <div>
        <BrowserRouter>
                <Route exact path="/" component={Home} />
                <Route path="/faculty-members" component={FacultyMembers} />
                <Route path="/curriculum" component={Curriculum} />
                <Route path="/about" component={About} />
                <Route exact path="/faculty" component={Faculty} />
                <Route path="/faculty/attendance" component={Attendance} />
                <Route path="/faculty/grade" component={Grades} />
                <Route path="/faculty/profile" component={FacultyProfile}/>
                <Route path="/student" component={Student} />
                <Route path="/institute" component={Institute} />
        </BrowserRouter>
    
    </div>
    
   
  );
}

export default App;
