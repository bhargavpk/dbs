import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'

export default function Student() {

    const [student, changeStudent] = useState({
        studentName:''
    })

    const getUser = async () => {
        const token = (new Cookies()).get('idToken')
        const res = await fetch('http://localhost:5000/student_info', {
            method:'GET',
            headers:{
                'Authorization':'Bearer '+ token
            }
        })
        const data = await res.json()
        changeStudent({
            studentName: data.studentName
        })
    }

    useEffect(() => {
        getUser()
    })

    return (

        <div>
            <h3>{student.studentName}</h3>
        </div>
    )
}
