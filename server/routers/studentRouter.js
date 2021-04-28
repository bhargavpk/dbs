const express = require('express')
const oracledb = require('oracledb')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const studentAuthentication = require('../middleware/studentAuth')
const { SUBSCR_EVENT_TYPE_STARTUP } = require('oracledb')

const router = new express.Router()
const app = express()
app.use(cors())

let idx;

router.post('/student_login', async (req, res) => {
    try{
        const conn = await oracledb.getConnection()
        const {email, password} = req.body
        const query = 'SELECT ROLL FROM student WHERE STUDENT_NAME = \''+email+'\' AND PASSWORD = \''+password+'\''
        const result = await conn.execute(query)
        const resultRows = result.rows
        if(resultRows.length === 0)
        {
            await conn.close()
            res.status(401).send({err: 'Invalid credentials'})
        }
        else
        {
            const id = resultRows[0][0]
            idx = resultRows[0][0]
            const token = await jwt.sign({id}, 'dbs_university_project', {expiresIn: "2 days"})
            await conn.close()
            res.send({ token })
        }

    }catch(e){

    }
})

router.get('/student_info', studentAuthentication, async (req, res) => {
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const query = 'SELECT * FROM student WHERE ROLL = \''+studentId + '\''
    
        const result = await conn.execute(query)
        const resultRows = result.rows

        await conn.close()

        res.send({
            studentName: resultRows[0][0],
            studentBranch: resultRows[0][1],
            studentCsem: resultRows[0][4]

        })

    }catch(e){
        res.status(500).send({ err: e })
    }
})

router.get('/student_attendance', studentAuthentication, async (req, res) => {
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const query = 'SELECT course_id,att,tot FROM attendance WHERE ROLL = \''+studentId+'\''
        const result = await conn.execute(query)
        const resultRows = result.rows
        const attendanceList = []
        resultRows.forEach(attendance => {
            attendanceList.push({
                course: attendance[0],
                count : attendance[1],
                total : attendance[2]
                //idate: attendance[2],
                //status: attendance[3]
    
            })
        })
        await conn.close()

        res.send({
            attendanceList

        })


    }catch(e){
        res.status(500).send({ err: e })
    }
})



router.get('/student_grade', studentAuthentication, async (req, res) => {
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const query = 'SELECT  course_id,sem,grade,credit FROM grade_report natural join course  WHERE ROLL = \''+studentId + '\' order by sem'
        const result = await conn.execute(query)
        const resultRows = result.rows
        const gradeList = []
        resultRows.forEach(grade => {
            gradeList.push({
                courseno: grade[0],
                semester : grade[1],
                grad : grade[2],
                credit: grade[3]
                //idate: attendance[2],
                //status: attendance[3]
    
            })
        })
    
        await conn.close()

        res.send({
            gradeList

        })


    }catch(e){
        res.status(500).send({ err: e })
    }
})


router.get('/student_course', studentAuthentication, async (req, res) => {
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const query = 'SELECT course_id,sem,course_name FROM registration NATURAL JOIN course WHERE ROLL = \''+studentId + '\' and sem in ( select cur_sem from student WHERE ROLL = \''+studentId + '\')'
        const result = await conn.execute(query)
        const resultRows = result.rows
        const courseList = []
        resultRows.forEach(grade => {
            courseList.push({
                courseno: grade[0],
                semester : grade[1],
                coursename : grade[2]
                //idate: attendance[2],
                //status: attendance[3]
    
            })
        })
    
        await conn.close()

        res.send({
            courseList

        })


    }catch(e){
        res.status(500).send({ err: e })
    }
})


router.get('/student_breadth', studentAuthentication, async (req, res) => {
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const query = 'SELECT course_name,course_id FROM course natural join breadth_allocated WHERE (sem,branch) in ( select cur_sem+1,branch from student WHERE ROLL = \''+studentId + '\')'
        const result = await conn.execute(query)
        const resultRows = result.rows
        const breadthList = []
        resultRows.forEach(breadth => {
            breadthList.push({
                courseno: breadth[1],
                name : breadth[0]
                //idate: attendance[2],
                //status: attendance[3]
    
            })
        })
        const query1 = 'SELECT count(*) from preference where roll =\''+studentId+'\''
        const result1 = await conn.execute(query1)
        const resultRows1 = result1.rows
        const total = resultRows1[0][0] 
    
        const query2 = 'SELECT cur_sem from student where roll =\''+studentId+'\''
        const result2 = await conn.execute(query2)
        const resultRows2 = result2.rows
        const sem = resultRows2[0][0]
        if(sem != 2)
        {
        const q1 = 'insert into temp_student values (\''+ studentId +'\')'
        const result3 = await conn.execute(q1,[],{
            autoCommit : true
        })
        }




        await conn.close()

        res.send({
            breadthList,total,sem

        })


    }catch(e){
        res.status(500).send({ err: e })
    }
})


router.post('/student_set',studentAuthentication, async (req, res) => {
   
    try{
        const studentId = req.student.id
        const conn = await oracledb.getConnection()
        const q = 'insert into preference values (:1,:2,:3)'
        const binds = [
            [req.body.fname,studentId,req.body.fbr],
            [req.body.sname,studentId,req.body.sbr],
            [req.body.tname,studentId,req.body.tbr]
        ]
        const result = await conn.executeMany(q,binds,{
            autoCommit : true
        })
        const conn1 = await oracledb.getConnection()
        const q1 = 'insert into temp_student values (\''+ studentId +'\')'
        const result1 = await conn1.execute(q1,[],{
            autoCommit : true
        })
        await conn.close()

        res.send('Success')


    }catch(e){
        
        res.status(500).send({ err: e })
    }
})
module.exports = router