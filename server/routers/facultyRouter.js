const express = require('express')
const jwt = require('jsonwebtoken')
const oracledb = require('oracledb')
const facultyAuth = require('../middleware/facultyAuth')

const router = new express.Router()

router.post('/faculty_login', async (req, res) => {
    try{
        const facultyCredentials = req.body

        //Get faculty details
        const conn = await oracledb.getConnection()
        var query = 'SELECT id FROM Instructor NATURAL JOIN Instructor_auth WHERE '+
                        'email = \''+facultyCredentials.email+'\' AND password = \''+facultyCredentials.password+'\''
        const result = await conn.execute(query)
        const resultSet = result.rows
        await conn.close()

        if(result.rows.length === 0)
        {
            //Invalid login credentials
            res.status(401).send({ err: 'Invalid credentials' })
        }
        else
        {
            const facultyId = resultSet[0][0]
            const token = await jwt.sign({id: facultyId}, 'dbs_university_project', {expiresIn: "2 days"})
            res.send({ token })
        }

    }catch(err){
        res.status(500).send({ err })
    }
})

router.get('/faculty_info', facultyAuth, async (req, res) => {
    try{
        const facultyId = req.faculty.id

        const conn = await oracledb.getConnection()
        var query = 'SELECT name, department_name, EXTRACT(YEAR FROM joining_date) AS joining_year '+ 
                        'FROM Instructor WHERE id = '+facultyId;
        const resultSet = (await conn.execute(query)).rows
        query = 'SELECT course_name FROM Course NATURAL JOIN Instr_course WHERE instructor_id = '+facultyId
        const resultSetCourseList = (await conn.execute(query)).rows
        const facultyCourseList = []
        resultSetCourseList.forEach(course => {
            facultyCourseList.push(course[0])
        })
        const facultyInfo = {
            facultyId,
            facultyName: resultSet[0][0],
            facultyDepartment: resultSet[0][1],
            facultyYearOfJoining: resultSet[0][2],
            facultyCourseList
        }
        
        await conn.close()
        res.send({
            facultyInfo
        })

    }catch(e){
        res.status(500).send({err:e})
    }
})

router.get('/faculty/profile', async (req, res) => {
    try{
        const facultyId = req.query.id

        const conn = await oracledb.getConnection()
        var query = 'SELECT name, specialization, EXTRACT(YEAR FROM joining_date) AS joining_year, department_name, email '+ 
                        'FROM Instructor NATURAL JOIN Instructor_auth WHERE id = '+facultyId;
        const resultSet = (await conn.execute(query)).rows
        query = 'SELECT course_name FROM Course NATURAL JOIN Instr_course WHERE instructor_id = '+facultyId
        const resultSetCourseList = (await conn.execute(query)).rows
        const facultyCourseList = []
        resultSetCourseList.forEach(course => {
            facultyCourseList.push(course[0])
        })
        const facultyInfo = {
            facultyName: resultSet[0][0],
            facultySpecialization: resultSet[0][1],
            facultyYearOfJoining: resultSet[0][2],
            facultyDepartment: resultSet[0][3],
            facultyEmail: resultSet[0][4],
            facultyCourseList
        }
        
        await conn.close()
        res.send({
            facultyInfo
        })

    }catch(e){
        res.status(500).send({err:e})
    }
})

router.post('/faculty/student_list', facultyAuth, async (req, res) => {
    try{
        const { courseName } = req.body
        const conn = await oracledb.getConnection()
        const query = 'SELECT rollno, name FROM Students, Registration, Course WHERE '+
                        'Students.id = Registration.student_id AND Registration.course_id = Course.course_id '+
                        'AND Course.course_name = \''+courseName+'\''
        const resultSet = (await conn.execute(query)).rows
        const studentList = []
        resultSet.forEach(studentInfo => {
            studentList.push({
                studentRollno: studentInfo[0],
                studentName: studentInfo[1]
            })
        })
        await conn.close()
        res.send({ studentList })

    }catch(e){
        res.status(500).send({ err: e })
    }
})

router.get('/faculty/list', async (req, res) => {
    try{
        const facultyList = []  //Each element contains object containing department name and professor name,id
        const conn = await oracledb.getConnection()
        const query = 'SELECT department_name, id, name FROM Instructor ORDER BY department_name'
        const resultSet = (await conn.execute(query)).rows
        var currentFacultyList = {
            departmentName: '',
            facultyList: []
        }
        resultSet.forEach(record => {
            if(currentFacultyList.departmentName !== record[0])
            {
                if(currentFacultyList.departmentName !== '')
                    facultyList.push(currentFacultyList)
                currentFacultyList = {
                    departmentName: record[0],
                    facultyList: []
                }
            }
            currentFacultyList.facultyList.push({
                facultyId: record[1],
                facultyName: record[2]
            })
        })
        if(currentFacultyList.facultyList.length !== 0)
            facultyList.push(currentFacultyList)
        await conn.close()
        res.send({
            facultyList
        })
        
    }catch(e){
        res.status(500).send({err: e})
    }
})

router.get('/faculty_logout', facultyAuth, (req, res) => {
    res.send({ })
})

module.exports = router