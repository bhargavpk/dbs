import React from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

export default function Options({ faculty }) {

    const changeCourseName = courseName => {
        const courseWords = courseName.split(' ')
        var resultantCourse = ''
        courseWords.forEach(word => {
            resultantCourse = resultantCourse + word + '_'
        })
        resultantCourse = resultantCourse.slice(0, -1)
        return resultantCourse
    }

    const { facultyCourseList: courses } = faculty

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
        </div>
    )
}
