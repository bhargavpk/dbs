import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

import Dropdown from 'react-bootstrap/Dropdown'

export default function Options({ faculty }) {

    const [departmentCourseList, changeDepartmentList] = useState([])
    const [fetchStatus, changeFetchStatus] = useState(false)

    const fetchDepartmentList = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/faculty/department_courses', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+token
            }
        })
        const data = await res.json()
        if(!data.err)
            changeDepartmentList(data.courseList)
        changeFetchStatus(true)
    }

    const changeCourseName = courseName => {
        const courseWords = courseName.split(' ')
        var resultantCourse = ''
        courseWords.forEach(word => {
            resultantCourse = resultantCourse + word + '_'
        })
        resultantCourse = resultantCourse.slice(0, -1)
        return resultantCourse
    }

    const { facultyCourseList: courses, isFacultyAdvisor } = faculty

    useEffect(() => {
        if((isFacultyAdvisor === true)&&(fetchStatus === false))
            fetchDepartmentList()        
    })

    return (
        <div id="options-container">
            <span>Select a course to update attendance or assign grades</span>
            <div className="options-box">
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        Update attendance
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            courses.map(courseName => (
                                <div className="options-element">
                                    <Dropdown.Item href={'/faculty/attendance?course='+changeCourseName(courseName)}>
                                        {courseName}
                                    </Dropdown.Item>
                                </div>
                            ))
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="options-box">
                <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            Assign grades
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        {
                            courses.map(courseName => (
                                <div className="options-element">
                                    <Dropdown.Item href={'/faculty/grade?course='+changeCourseName(courseName)}>
                                        {courseName}
                                    </Dropdown.Item>
                                </div>
                            ))
                        }
                        </Dropdown.Menu>
                </Dropdown>
            </div>
            {
                isFacultyAdvisor===true?
                <div>
                    <span>Select a course to view attendance or grades</span>
                    <div className="options-box">
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                View attendance
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    departmentCourseList.map(courseName => (
                                        <div className="options-element">
                                            <Dropdown.Item href='#'>
                                                {courseName}
                                            </Dropdown.Item>
                                        </div>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="options-box">
                        <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    View grades
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                {
                                    departmentCourseList.map(courseName => (
                                        <div className="options-element">
                                            <Dropdown.Item href='#'>
                                                {courseName}
                                            </Dropdown.Item>
                                        </div>
                                    ))
                                }
                                </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>:
                <div />
            }
        </div>
    )
}
