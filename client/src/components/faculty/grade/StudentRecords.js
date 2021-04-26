import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

export default function StudentRecords({ studentList, courseId }) {

    const [gradeList, changeGradeList] = useState([])
    const [recvStatus, changeRecvStatus] = useState(false)
    const [submissionStatus, changeSubmissionStatus] = useState(-1)
    const [errMessage, changeErrMessage] = useState('')

    const initGradeArray = () => {
        if(recvStatus === false)
        {
            changeGradeList(new Array(studentList.length))
            if(studentList.length !== 0)
                changeRecvStatus(true)
        }
    }
    const fetchSubmissionStatus = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/faculty/grade_status', {
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

    useEffect(() => {
        initGradeArray()
    }, [recvStatus])
    useEffect(() => {
        if(submissionStatus === -1)
            fetchSubmissionStatus()
    }, [submissionStatus])

    const submitGrade = async () => {
        const token = (new Cookies()).get('idToken')
        const gradeData = []
        for(var i = 0;i < gradeList.length;i++)
        {
            const gradeElement = [courseId, studentList[i].studentRollno, gradeList[i]]
            gradeData.push(gradeElement)
        }
        console.log(gradeData)
        const res = await fetch('http://localhost:5000/faculty/submit_grade', {
            method: 'POST',
            headers: {
                'Content-type':'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({ gradeData })
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
                <span>Grade submitted</span>:
                submissionStatus===-1?
                <div />:
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
                                                newGradeList[index] = parseInt(e.target.value)
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
                        <Button variant="success" onClick={()=>{submitGrade()}}>Submit</Button>
                    </div>
                </div>
            }
        </div>
    )
}
