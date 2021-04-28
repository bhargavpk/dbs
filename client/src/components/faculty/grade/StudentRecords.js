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
        changeGradeList(new Array(studentList.length))
        if(studentList.length !== 0)
            changeRecvStatus(true)
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
        if(data.status === false)
            changeSubmissionStatus(0)
        else
            changeSubmissionStatus(1)
    }

    useEffect(() => {
        if(recvStatus === false)
            initGradeArray()
    })
    useEffect(() => {
        if(submissionStatus === -1)
            fetchSubmissionStatus()
    }, [submissionStatus])

    const submitGrade = async () => {
        const token = (new Cookies()).get('idToken')
        const gradeData = []
        var i
        for(i = 0;i < gradeList.length;i++)
        {
            if(gradeList[i]===undefined)
            {
                changeErrMessage('All the entries need to be filled')
                break
            }
            if(gradeList[i]<0 || gradeList[i]>10)
            {
                changeErrMessage('Invalid grades entered')
                break
            }
            const gradeElement = [courseId, studentList[i].studentRollno, gradeList[i]]
            gradeData.push(gradeElement)
        }
        if(i === gradeList.length)
        {
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
                                                if(e.target.value !== '')
                                                    newGradeList[index] = parseInt(e.target.value)
                                                else
                                                    newGradeList[index] = undefined
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
                        <div>{errMessage}</div>
                    </div>
                </div>
            }
        </div>
    )
}
