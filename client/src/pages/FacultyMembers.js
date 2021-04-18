import React, {useState, useEffect} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import '../css/faculty-members.css'

export default function FacultyMembers() {
    const [facultyList, changeFacultyList] = useState([])
    const [fetchStatus, changeFetchStatus] = useState(false)

    const fetchFacultyList = async () => {
        const res = await fetch('http://localhost:5000/faculty/list')
        const data = await res.json()
        if(!data.err)
        {
            changeFacultyList(data.facultyList)
            changeFetchStatus(true)
        }
    }
    useEffect(() => {
        if(fetchStatus === false)
            fetchFacultyList()
    })

    return (
        <div id="faculty-members-container">
            <h3>Faculty members</h3>
            <hr />
            {
                facultyList.map(department => (
                    <div className="department-container">
                        <b>{department.departmentName}</b>
                        <div className="department-list">
                            {
                                department.facultyList.map(faculty => (
                                    <a href={"/faculty/profile?id="+faculty.facultyId}>
                                        {faculty.facultyName}
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
