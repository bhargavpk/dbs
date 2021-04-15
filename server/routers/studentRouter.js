const express = require('express')
const oracledb = require('oracledb')
const jwt = require('jsonwebtoken')

const studentAuthentication = require('../middleware/studentAuth')

const router = new express.Router()

router.post('/student_login', async (req, res) => {
    try{
        const conn = await oracledb.getConnection()
        const {email, password} = req.body
        const query = 'SELECT id FROM Student NATURAL JOIN Student_auth WHERE email = \''+email+'\' AND password = \''+password+'\''
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
        const query = 'SELECT name FROM Student WHERE id = '+studentId
        const result = await conn.execute(query)
        const resultRows = result.rows

        await conn.close()

        res.send({
            studentName: resultRows[0][0]
        })

    }catch(e){
        res.status(500).send({ err: e })
    }
})

module.exports = router