import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import Navigation from '../../components/faculty/Navigation'

import StudentRecords from '../../components/faculty/grade/StudentRecords'
import '../../css/faculty.css'

export default function Grades( props ) {
    
    const getCourseName = () => {
        var urlParamCourseName = props.location.search.split('=')[1]
        var courseName = ''
        urlParamCourseName.split('_').forEach(word => {
            courseName = courseName + word + ' '
        })
        courseName = courseName.slice(0, -1)
        return courseName
    }

    const [studentList, changeStudentList] = useState([])
    const [studentListFetched, changeFetchStatus] = useState(false)

    const fetchStudentList = async () => {
        const courseName = getCourseName()
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/faculty/student_list', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ courseName })
        })
        const data = await res.json()
        changeStudentList(data.studentList)
        changeFetchStatus(true)
    }

    useEffect(() => {
        if(studentListFetched === false)
            fetchStudentList()
    })

    return (
        <div>
            <Navigation />
            <div id="content-container">
                <div id="display-message-container">
                    <h3>Grades for {getCourseName()}</h3>
                    <hr />
                    <br />
                </div>
                <StudentRecords studentList={studentList}/>
            </div>
        </div>
    )
}
