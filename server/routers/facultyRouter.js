const express = require('express')
const jwt = require('jsonwebtoken')
const oracledb = require('oracledb')
const facultyAuth = require('../middleware/facultyAuth')

oracledb.autoCommit = true

const router = new express.Router()

router.post('/faculty_login', async (req, res) => {
    var conn
    try{
        const facultyCredentials = req.body

        //Get faculty details
        conn = await oracledb.getConnection()
        var query = 'SELECT instructor_id FROM instructor WHERE email = \''+facultyCredentials.email+'\' AND password = \''+facultyCredentials.password+'\''
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
        await conn.close()
        res.status(500).send({ err: err.message })
    }
})

router.get('/faculty_info', facultyAuth, async (req, res) => {
    var conn
    try{
        const facultyId = req.faculty.id

        conn = await oracledb.getConnection()
        var query = 'SELECT instructor_name, branch FROM instructor WHERE instructor_id = '+facultyId
        const resultSet = (await conn.execute(query)).rows
        
        query = 'SELECT even_odd FROM essential'
        const semStatusResultSet = (await conn.execute(query)).rows
        const semStatus = semStatusResultSet[0][0]
        query = 'SELECT DISTINCT course_id, course_name FROM instructor_distinct_view NATURAL JOIN registration NATURAL JOIN course WHERE instructor_id = '+facultyId +
                ' AND MOD(sem, 2) = '+semStatus
        const resultSetCourseList = (await conn.execute(query)).rows
        const facultyCourseList = []
        resultSetCourseList.forEach(course => {
            facultyCourseList.push({
                courseId: course[0],
                courseName: course[1]
            })
        })
        const facultyInfo = {
            facultyId,
            facultyName: resultSet[0][0],
            facultyDepartment: resultSet[0][1],
            facultyCourseList
        }
        
        await conn.close()
        res.send({
            facultyInfo
        })

    }catch(e){
        await conn.close()
        res.status(500).send({ err: e })
    }
})

router.get('/faculty/profile', async (req, res) => {
    var conn
    try{
        const facultyId = req.query.id

        conn = await oracledb.getConnection()
        var query = 'SELECT instructor_name, specialisation, branch, email '+ 
                        'FROM instructor WHERE instructor_id = '+facultyId
        const resultSet = (await conn.execute(query)).rows
        query = 'SELECT even_odd FROM essential'
        const semStatusResultSet = (await conn.execute(query)).rows
        const semStatus = semStatusResultSet[0][0]
        query = 'SELECT course_name FROM course NATURAL JOIN instructor_distinct_view WHERE instructor_id = '+facultyId +
                ' AND MOD(sem, 2) = '+semStatus
        const resultSetCourseList = (await conn.execute(query)).rows
        const facultyCourseList = []
        resultSetCourseList.forEach(course => {
            facultyCourseList.push(course[0])
        })
        const facultyInfo = {
            facultyName: resultSet[0][0],
            facultySpecialization: resultSet[0][1],
            facultyDepartment: resultSet[0][2],
            facultyEmail: resultSet[0][3],
            facultyCourseList
        }
        
        await conn.close()
        res.send({
            facultyInfo
        })

    }catch(e){
        await conn.close()
        res.status(500).send({err:e.message})
    }
})

router.post('/faculty/attendance_status', facultyAuth, async (req, res) => {
    var conn
    try{
        const {courseId} = req.body
        conn = await oracledb.getConnection()
        var query = 'SELECT course_id FROM attendance WHERE course_id = \''+courseId+'\''
        const resultSet = (await conn.execute(query)).rows
        await conn.close()
        if(resultSet.length === 0)
            res.send({ status: false })
        else
            res.send({ status: true })

    }catch(e){
        await conn.close()
        res.status(400).send({ err: e.message })
    }
})
router.post('/faculty/submit_attendance', facultyAuth, async (req, res) => {
    var conn
    try{
        const facultyId = req.faculty.id
        conn = await oracledb.getConnection()
        const {attendanceData} = req.body
        console.log(attendanceData)
        var query = 'INSERT INTO attendance VALUES(:1, :2, :3, :4)'
        await conn.executeMany(query, attendanceData, {
            autoCommit: true
        })
        await conn.close()
        res.status(201).send({ status: true })

    }catch(e){
        await conn.close()
        console.log(e.message)
        res.status(400).send({err: e.message})
    }
})

router.post('/faculty/grade_status', facultyAuth, async (req, res) => {
    var conn
    try{
        const {courseId} = req.body
        conn = await oracledb.getConnection()
        var query = 'SELECT * FROM temp_grade_report WHERE course_id = \''+courseId+'\''
        const resultSet = (await conn.execute(query)).rows
        await conn.close()
        if(resultSet.length === 0)
            res.send({ status: false })
        else
            res.send({ status: true })

    }catch(e){
        await conn.close()
        res.status(400).send({ err: e.message })
    }
})
router.post('/faculty/submit_grade', facultyAuth, async (req, res) => {
    var conn
    try{
        const facultyId = req.faculty.id
        conn = await oracledb.getConnection()
        const {gradeData} = req.body
        var query = 'INSERT INTO temp_grade_report VALUES(:1, :2, :3)'
        await conn.executeMany(query, gradeData, {
            autoCommit: true
        })
        await conn.close()
        res.status(201).send({ status: true })

    }catch(e){
        await conn.close()
        console.log(e.message)
        res.status(400).send({err: e.message})
    }
})

router.post('/faculty/student_list', facultyAuth, async (req, res) => {
    var conn
    try{
        const { courseId } = req.body
        conn = await oracledb.getConnection()
        var query = 'SELECT even_odd FROM essential'
        const essentialResultSet = (await conn.execute(query)).rows
        const semStatus = essentialResultSet[0][0]
        query = 'SELECT roll, student_name FROM registration NATURAL JOIN student NATURAL JOIN instructor_distinct_view NATURAL JOIN course '+
                        'WHERE instructor_id = ' +req.faculty.id+ ' AND course_id = \''+courseId+'\' AND MOD(sem,2) = '+semStatus
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
        await conn.close()
        res.status(500).send({ err: e.message })
    }
})

router.get('/faculty/list', async (req, res) => {
    var conn
    try{
        const facultyList = []  //Each element contains object containing department name and professor name,id
        conn = await oracledb.getConnection()
        const query = 'SELECT branch, instructor_id, instructor_name FROM instructor ORDER BY branch'
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
        await conn.close()
        res.status(500).send({err: e})
    }
})

router.get('/faculty/department_courses', facultyAuth, async (req, res) => {
    var conn
    try{
        const facultyId = req.faculty.id
        conn = await oracledb.getConnection()
        const queryDepartment = 'SELECT branch FROM instructor WHERE instructor_id = '+facultyId
        const departmentResultSet = (await conn.execute(queryDepartment)).rows
        const departmentName = departmentResultSet[0][0]
        const query = 'SELECT DISTINCT course_name FROM course NATURAL JOIN course_allocated '+ 
                        'WHERE branch = \''+departmentName+'\''
        const resultSet = (await conn.execute(query)).rows
        const courseList = []
        resultSet.forEach(course => {
            courseList.push(course[0])
        })
        await conn.close()
        res.send({ courseList })

    }catch(e){
        await conn.close()
        res.status(500).send({ err: e })
    }

})

router.get('/faculty_logout', facultyAuth, (req, res) => {
    res.send({ })
})

module.exports = router