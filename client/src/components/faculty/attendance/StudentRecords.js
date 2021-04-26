import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

export default function StudentRecords({ studentList, courseId }) {
    const [attendanceValues, changeAttendanceValues] = useState([])
    const [totalClassesValues, changeTotalClassesValues] = useState([])
    const [recvStudentRecords, changeRecvStatus] = useState(false)
    const [submissionStatus, changeSubmissionStatus] = useState(-1)
    const [errMessage, changeErrMessage] = useState('')

    const fetchSubmissionStatus = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/faculty/attendance_status', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ courseId })
        })
        const data = await res.json()
        console.log(data.status)
        if(data.status === false)
            changeSubmissionStatus(0)
        else
            changeSubmissionStatus(1)

    }
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
        if(submissionStatus === -1)
            fetchSubmissionStatus()
    }, [submissionStatus])
    useEffect(() => {
        initAttendanceArray()
    }, [recvStudentRecords])

    const submitAttendance = async () => {
        const token = (new Cookies()).get('idToken')
        const attendanceData = []
        for(var i = 0;i < attendanceValues.length;i++)
        {
            const attendanceElement = [courseId, studentList[i].studentRollno, attendanceValues[i], totalClassesValues[i]]
            attendanceData.push(attendanceElement)
        }
        console.log(attendanceData)
        const res = await fetch('http://localhost:5000/faculty/submit_attendance', {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({ attendanceData })
        })
        const data = await res.json()
        if(!data.err)
            changeSubmissionStatus(1)
        else
            changeErrMessage(data.err)
    }

    return (
        <div>
            {
                submissionStatus===1?
                <span>Attendance data submitted</span>:
                submissionStatus===-1?
                <div />:
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
                        <Button variant="success" onClick={()=>{submitAttendance()}}>Submit</Button>
                    </div>
                </div>
            }
      </div>
    )
}
