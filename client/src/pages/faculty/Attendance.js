import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import Navigation from '../../components/faculty/Navigation'

import StudentRecords from '../../components/faculty/attendance/StudentRecords'
import '../../css/faculty.css'

export default function Attendance( props ) {
    
    const getCourseId = () => {
        return props.location.search.split('=')[1]
    }

    const [studentList, changeStudentList] = useState([])
    const [studentListFetched, changeFetchStatus] = useState(false)

    const fetchStudentList = async () => {
        const courseId = getCourseId()
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/faculty/student_list', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ courseId })
        })
        const data = await res.json()
        changeStudentList(data.studentList)
        changeFetchStatus(true)
    }

    useEffect(() => {
        if(studentListFetched === false)
            fetchStudentList()
    }, [studentListFetched])

    return (
        <div>
            <Navigation />
            <div id="content-container">
                <div id="display-message-container">
                    <h3>Attendance for {getCourseId()}</h3>
                    <hr />
                    <br />
                </div>
                <StudentRecords studentList={studentList} courseId={getCourseId()}/>
            </div>
        </div>
    )
}
