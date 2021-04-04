import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/home.css'

function Navigation({ setFormType })
{
  
  return (
    
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                                <li class="nav-item active">
                                        <button
                                        class="nav-link"
                                        onClick={() => { setFormType('home') }}
                                        >
                                                Home <span class="sr-only">(current)</span>
                                        </button>
                                </li>
                                <li class="nav-item">
                                        <button
                                        class="nav-link"
                                        onClick={() => { setFormType('student') }}
                                        >
                                                Student
                                        </button>
                                </li>
                                <li class="nav-item">
                                        <button
                                        class="nav-link"
                                        onClick={() => { setFormType('faculty') }}
                                        >
                                                Faculty
                                        </button>
                                </li>
                                <li class="nav-item">
                                        <button
                                        class="nav-link"
                                        onClick={() => { setFormType('institute') }}
                                        >
                                                Institute
                                        </button>
                                </li>
                        </ul>
                </div>
        </nav>
    
  );
}

export default Navigation;
