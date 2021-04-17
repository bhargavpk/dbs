import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

export default function StudentRecords({ studentList }) {

    const [gradeList, changeGradeList] = useState([])
    const [recvStatus, changeRecvStatus] = useState(false)

    const initGradeArray = () => {
        if(recvStatus === false)
        {
            changeGradeList(new Array(studentList.length))
            if(studentList.length !== 0)
                changeRecvStatus(true)
        }
    }
    useEffect(() => {
        initGradeArray()
    })

    return (
        <div>
            <Table>
            <thead>
                <tr>
                <th>Roll no</th>
                <th>Name</th>
                <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                {
                    studentList.map((studentRecord, index) => (
                        <tr>
                            <td>{studentRecord.studentRollno}</td>
                            <td>{studentRecord.studentName}</td>
                            <td>
                                <input
                                className="input-box"
                                type="text"
                                onInput={e => {
                                    const newGradeList = [...gradeList]
                                    newGradeList[index] = e.target.value
                                    changeGradeList(newGradeList)
                                }}
                                />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
        <div id="button-container">
            <Button variant="success">Submit</Button>
        </div>
    </div>
    )
}
