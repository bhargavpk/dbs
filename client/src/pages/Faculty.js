import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

import Navigation from '../components/faculty/Navigation'
import Message from '../components/faculty/Message'
import Options from '../components/faculty/Options'

export default function Faculty() {

    const initFaculty = {
        facultyName: '',
        facultyCourseList: []
    }
    const [faculty, updateFaculty] = useState(initFaculty)
    const [fetchMadeStatus, changeFetchStatus] = useState(false)

    const fetchFacultyInfo = async function(){
        const cookie = new Cookies()
        const idToken = cookie.get('idToken')
        const res = await fetch('http://localhost:5000/faculty_info', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+idToken
            }
        })
        const data = await res.json()
        updateFaculty(data.facultyInfo)
        changeFetchStatus(true)
    }
    useEffect(() => {
        if(fetchMadeStatus === false)
            fetchFacultyInfo()
    }, [fetchMadeStatus])

    return (
        <div>
            <Navigation facultyId={faculty.facultyId}/>
            <div id="content-container">
                <Message faculty={faculty}/>
                <Options faculty={faculty}/>
            </div>
        </div>
    )
}
