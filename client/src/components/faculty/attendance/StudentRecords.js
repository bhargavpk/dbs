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
        if(data.status === false)
            changeSubmissionStatus(0)
        else
            changeSubmissionStatus(1)

    }
    const initAttendanceArray = () => {
        changeAttendanceValues(new Array(studentList.length))
        changeTotalClassesValues(new Array(studentList.length))
        if(studentList.length !== 0)
            changeRecvStatus(true)
    }

    useEffect(() => {
        if(submissionStatus === -1)
            fetchSubmissionStatus()
    }, [submissionStatus])
    useEffect(() => {
        if(recvStudentRecords === false)
            initAttendanceArray()
    })

    const submitAttendance = async () => {
        const token = (new Cookies()).get('idToken')
        const attendanceData = []
        var i
        for(i = 0;i < attendanceValues.length;i++)
        {
            if(attendanceValues[i]===undefined || totalClassesValues[i]===undefined)
            {
                changeErrMessage('All the entries need to be filled')
                break
            }
            if(attendanceValues[i]<=0 || totalClassesValues[i]<=0 || attendanceValues[i]>totalClassesValues[i])
            {
                changeErrMessage('Invalid attendance data')
                break
            }
            const attendanceElement = [courseId, studentList[i].studentRollno, attendanceValues[i], totalClassesValues[i]]
            attendanceData.push(attendanceElement)
        }
        if(i === attendanceValues.length)
        {
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
    }

    return (
        <div id="student-list-container">
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
                                                if(e.target.value !== '')
                                                    newAttendanceValues[index] = parseInt(e.target.value)
                                                else
                                                    newAttendanceValues[index] = undefined
                                                changeAttendanceValues(newAttendanceValues)
                                            }}
                                            />
                                            {" / "}
                                            <input className="input-box"
                                            type="text"
                                            onInput={e => {
                                                const newTotalClassesValues = [...totalClassesValues]
                                                if(e.target.value !== '')
                                                    newTotalClassesValues[index] = parseInt(e.target.value)
                                                else
                                                    newTotalClassesValues[index] = undefined
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
                        <div>{errMessage}</div>
                    </div>
                </div>
            }
      </div>
    )
}
