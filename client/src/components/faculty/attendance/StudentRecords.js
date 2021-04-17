import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

export default function StudentRecords({ studentList }) {
    const [attendanceValues, changeAttendanceValues] = useState([])
    const [totalClassesValues, changeTotalClassesValues] = useState([])
    const [recvStudentRecords, changeRecvStatus] = useState(false)

    const initAttendanceArray = () => {
        if(recvStudentRecords === false)
        {
            changeAttendanceValues(new Array(studentList.length))
            changeTotalClassesValues(new Array(studentList.length))
            if(studentList.length !== 0)
                changeRecvStatus(true)
        }
    }

    useEffect(() => {
        initAttendanceArray()
    })

    return (
        <div>
            <Table>
            <thead>
                <tr>
                <th>Roll no</th>
                <th>Name</th>
                <th>Attendance</th>
                </tr>
            </thead>
            <tbody>
                {
                    studentList.map((studentRecord, index) => (
                        <tr>
                            <td>{studentRecord.studentRollno}</td>
                            <td>{studentRecord.studentName}</td>
                            <td>
                                <input className="input-box"
                                type="text"
                                onInput={e => {
                                    const newAttendanceValues = [...attendanceValues]
                                    newAttendanceValues[index] = parseInt(e.target.value)
                                    changeAttendanceValues(newAttendanceValues)
                                }}
                                />
                                {" / "}
                                <input className="input-box"
                                type="text"
                                onInput={e => {
                                    const newTotalClassesValues = [...totalClassesValues]
                                    newTotalClassesValues[index] = parseInt(e.target.value)
                                    changeTotalClassesValues(newTotalClassesValues)
                                }} />
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
