const express = require('express')
const oracledb = require('oracledb')
const jwt = require('jsonwebtoken')

const router = new express.Router()

router.post('/institute/login', async (req, res) => {
    try{
        const {email, password} = req.body
        const conn = await oracledb.getConnection()
        const query = 'SELECT id FROM Instructor NATURAL JOIN Instructor_auth NATURAL JOIN Institute '+
                        'WHERE email = \''+email+'\' AND password = \''+password+'\''
        const resultSet = (await conn.execute(query)).rows
        if(resultSet.length === 0)
        {
            await conn.close()
            throw new Error('Invalid credentials')
        }
        const instituteId = resultSet[0][0]
        const token = await jwt.sign({id: instituteId}, 'dbs_university_project', {expiresIn: "2 days"})
        res.send({ token })

    }catch(e){
        res.status(401).send({ err: e })
    }
})

module.exports = router