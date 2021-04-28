import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import Button from 'react-bootstrap/Button'
import Navigation from '../components/institute/Navigation'
import StudentForm from '../components/institute/StudentForm'

import '../css/institute.css'

export default function Institute() {
    const [admitStatus, changeAdmitStatus] = useState(-1)
    const [activateStatus, changeActivateStatus] = useState(-1)
    const fetchSemStatus = async () => {
        const res = await fetch('http://localhost:5000/institute/admit_status')
        const data = await res.json()
        if(!data.err)
            changeAdmitStatus(data.admitStatus)
    }
    const fetchActivationStatus = async () => {
        const res = await fetch('http://localhost:5000/institute/activate_next_sem')
        const data = await res.json()
        if(!data.err)
            changeActivateStatus(data.activateStatus)
    }

    useEffect(() => {
        if(admitStatus === -1)
            fetchSemStatus()
    }, [admitStatus])
    useEffect(() => {
        if(activateStatus === -1)
            fetchActivationStatus()
    },  [activateStatus])

    const gotoNextSem = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/institute/go_next_sem', {
            method: 'GET',
            headers: {
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
    const stopAdmissions = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/institute/close_admission', {
            method: 'GET',
            headers: {
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
            <div id="institute-content-container">
                <h3>Welcome to IIT Bhubaneswar</h3>
                <hr />
                {
                    activateStatus!==1?
                    <div style={{
                        color: 'red'
                    }}>
                        Cannot proceed to next semester
                    </div>:
                    <Button variant="success" onClick={()=>{gotoNextSem()}}>
                        Go to next sem
                    </Button>
                }
                <hr />
                {
                    admitStatus!==1?
                    <span>Admissions closed</span>:
                    <div id="form-container">
                        <h5>Register student</h5>
                        <StudentForm />
                        <div id="admission-allower-container">
                            <Button variant="danger" onClick={()=>{stopAdmissions()}}>
                                Stop admissions
                            </Button>
                        </div>
                    </div>
                }                
            </div>
        </div>
    )
}
