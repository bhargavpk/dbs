import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

import '../css/faculty-profile.css'

export default function FacultyProfile(props) {
    const [facultyInfo, changeFacultyInfo] = useState({
        facultyName: '',
        facultyDepartment: '',
        facultySpecialization: '',
        facultyCourseList: [],
        facultyYearOfJoining: '',
        facultyEmail: ''
    })
    const [fetchStatus, changeFetchStatus] = useState(false)

    const fetchFacultyInfo = async () => {
        const facultyId = props.location.search.split('=')[1]
        if(fetchStatus === false)
        {
            const res = await fetch('http://localhost:5000/faculty/profile?id='+facultyId)
            const data = await res.json()
            if(!data.err)
                changeFacultyInfo(data.facultyInfo)
            changeFetchStatus(true)
        }
    }
    useEffect(() => {
        fetchFacultyInfo()
    })

    return (
        <div id="faculty-profile-container">
            <div id="faculty-profile-header">
                <h3>Faculty profile</h3>
            </div>
            <ListGroup>
                <ListGroup.Item><b>Name</b>: {facultyInfo.facultyName}</ListGroup.Item>
                <ListGroup.Item><b>Department</b>: {facultyInfo.facultyDepartment}</ListGroup.Item>
                <ListGroup.Item><b>Specialization</b>: {facultyInfo.facultySpecialization}</ListGroup.Item>
                <ListGroup.Item><b>Year of joining</b>: {facultyInfo.facultyYearOfJoining}</ListGroup.Item>
                <ListGroup.Item>
                    <b>Courses taught</b>: {
                        facultyInfo.facultyCourseList.map((courseName, index) => (
                            index===(facultyInfo.facultyCourseList.length-1)?
                            <span>{courseName}</span>:
                            <span>{courseName}, </span>
                        ))
                    }
                </ListGroup.Item>
                <ListGroup.Item><b>Email</b>: {facultyInfo.facultyEmail}</ListGroup.Item>
            </ListGroup>
        </div>
    )
}
