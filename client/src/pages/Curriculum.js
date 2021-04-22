import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import CurriculumTable from '../components/curriculum/CurriculumTable'

import '../css/curriculum.css'

export default function Curriculum() {
    const [curriculumCourseList, changeCurriculum] = useState([])
    const [fetchStatus, changeFetchStatus] = useState(false)
    const [departmentName, changeDepartmentName] = useState('')

    const fetchCurriculum = async () => {
        const res = await fetch('http://localhost:5000/course/curriculum?department_name='+departmentName)
        const data = await res.json()
        if(!data.err)
        {
            changeCurriculum(data.courseList)
            changeFetchStatus(true)
        }
    }

    useEffect(() => {
        if(fetchStatus === false)
            fetchCurriculum()
    }, [departmentName])

    const getDepartmentName = function(department){
        changeDepartmentName(department)
        changeFetchStatus(false)
    }

    return (
        <div id="curriculum-container">
            <h3>Curriculum</h3>
            <hr />
            <Dropdown>
                <Dropdown.Toggle variant="light">
                    Select department
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item as="button" onClick={() => { getDepartmentName('CSE') }}>CSE</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => { getDepartmentName('ECE') }}>ECE</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => { getDepartmentName('ME') }}>ME</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <CurriculumTable curriculumCourseList={curriculumCourseList} departmentName={departmentName}/>
        </div>
    )
}
