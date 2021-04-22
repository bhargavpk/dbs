import React from 'react'
import Navigation from '../components/institute/Navigation'
import StudentForm from '../components/institute/StudentForm'

import '../css/institute.css'

export default function Institute() {
    return (
        <div>
            <Navigation />
            <div id="content-container">
                <h3>Welcome to IIT Bhubaneswar</h3>
                <hr />
                <div style={{
                    color: 'red'
                }}>
                    Cannot proceed to next semester
                </div>
                <hr />
                <h5>Register student</h5>
                <div id="form-container">
                    <StudentForm />
                </div>
                
            </div>
        </div>
    )
}
