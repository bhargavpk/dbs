import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import Button from 'react-bootstrap/Button'
import Navigation from '../components/institute/Navigation'
import StudentForm from '../components/institute/StudentForm'

import '../css/institute.css'

export default function Institute() {
    const [semStatus, changeSemStatus] = useState(-1)
    const [activateStatus, changeActivateStatus] = useState(-1)
    const fetchSemStatus = async () => {
        const res = await fetch('http://localhost:5000/institute/sem_status')
        const data = await res.json()
        if(!data.err)
            changeSemStatus(data.semStatus)
    }
    const fetchActivationStatus = async () => {
        const res = await fetch('http://localhost:5000/institute/activate_next_sem')
        const data = await res.json()
        if(!data.err)
            changeActivateStatus(data.activateStatus)
    }

    useEffect(() => {
        if(semStatus === -1)
            fetchSemStatus()
    }, [semStatus])
    useEffect(() => {
        if(activateStatus === -1)
            fetchActivationStatus()
    },  [activateStatus])

    const gotoNextSem = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/institute/go_next_sem', {
            method: 'GET',
            heades: {
                'Authorization': 'Bearer '+token
            }
        })
        const data = await res.json()
        if(!data.err)
        {
            //Reload page
            window.location.reload()
        }
    }

    return (
        <div>
            <Navigation />
            <div id="content-container">
                <h3>Welcome to IIT Bhubaneswar</h3>
                <hr />
                {
                    activateStatus!==1?
                    <div style={{
                        color: 'red'
                    }}>
                        Cannot proceed to next semester
                    </div>:
                    <Button title="Go to next sem" variant="success" onClick={()=>{gotoNextSem()}} />
                }
                <hr />
                {
                    semStatus!==1?
                    <div />:
                    <div id="form-container">
                        <h5>Register student</h5>
                        <StudentForm />
                    </div>
                }
                
            </div>
        </div>
    )
}
