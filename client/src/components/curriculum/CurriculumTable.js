import React from 'react'

export default function CurriculumTable({ curriculumCourseList, departmentName }) {
    return (
        <div id="curriculum-table-container">
            {
                departmentName!==''?
                <h4><b>{'Curriculum for '+departmentName}</b></h4>:
                <div />
                
            }
            {
                curriculumCourseList.map((courseList, index) => (
                        <div>
                            <div className="table-header"><h4><b>{'Semester '+(index+1)}</b></h4></div>
                                <table>
                                    <tr>
                                        <th style={{
                                            width: '15rem'
                                        }}>
                                            Subject name
                                        </th>
                                        <th style={{
                                            width: '8rem'
                                        }}>
                                            Subject code
                                        </th>
                                        <th style={{
                                            width: '5rem'
                                        }}>
                                            Credit
                                        </th>
                                    </tr>
                                    {
                                        courseList.map(course => (
                                            <tr>
                                                <td>{course.courseName}</td>
                                                <td>{course.courseId}</td>
                                                <td>{course.courseCredit}</td>
                                            </tr>
                                        ))
                                    }
                                </table>
                    </div>
                ))
            }
        </div>
    )
}
