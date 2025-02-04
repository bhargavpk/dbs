const express = require('express')
const oracledb = require('oracledb')
const jwt = require('jsonwebtoken')
const instituteAuth = require('../middleware/instituteAuth')

oracledb.autoCommit = true

const router = new express.Router()

router.post('/institute/login', async (req, res) => {
    var conn
    try{
        const {email, password} = req.body
        conn = await oracledb.getConnection()
        const query = 'SELECT instructor_id FROM institute NATURAL JOIN instructor '+
                        'WHERE email = \''+email+'\' AND password = \''+password+'\''
        const resultSet = (await conn.execute(query)).rows
        if(resultSet.length === 0)
        {
            throw new Error('Invalid credentials')
        }
        const instituteId = resultSet[0][0]
        const token = await jwt.sign({id: instituteId}, 'dbs_university_project', {expiresIn: "2 days"})
        await conn.close()
        res.send({ token })

    }catch(e){
        await conn.close()
        res.status(401).send({ err: e.message })
    }
})

router.get('/institute/activate_next_sem', async (req, res) => {
    var conn
    try {
        conn = await oracledb.getConnection()
        query = `BEGIN
                    :ret := activate_go_next_sem();        
                END;`
        const resultSet = await conn.execute(query, {
            ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        })
        await conn.close()
        res.send({ activateStatus: resultSet.outBinds.ret })

    } catch (e) {
        await conn.close()
        res.status(500).send({ err: e })
    }
})

router.get('/institute/admit_status', async (req, res) => {
    var conn
    try {
        conn = await oracledb.getConnection()
        const query = 'SELECT is_admission_done, even_odd FROM essential'
        const resultSet = (await conn.execute(query)).rows
        const admitStatus = (resultSet[0][0]===0&&resultSet[0][1]===0)?1:0;
        await conn.close()
        res.send({ admitStatus })

    } catch (e) {
        await conn.close()
        res.status(500).send({ err: e })
    }
})

router.post('/institute/admit', instituteAuth, async (req, res) => {
    var conn
    try{
        const {studentData} = req.body
        conn = await oracledb.getConnection()
        const query = 'INSERT INTO admission VALUES(:1,:2,:3,:4)'
        await conn.execute(query, studentData, {
            autoCommit: true
        })
        await conn.close()
        res.status(201).send({ status: true })
        
    }catch(e){
        await conn.close()
        res.status(400).send({ err: e.message.split(': ')[1].split('\n')[0] })
    }
})

router.get('/institute/go_next_sem', instituteAuth, async (req, res) => {
    var conn
    try {
        conn = await oracledb.getConnection()
        const query = `BEGIN
            change_next_sem;
        END;`
        await conn.execute(query)
        await conn.close()
        res.send({ status: true })

    } catch (e) {
        await conn.close()
        console.log(e.message)
        res.status(500).send({ err: e.message })
    }
})

router.get('/institute/close_admission', instituteAuth, async (req, res) => {
    var conn
    try{
        conn = await oracledb.getConnection()
        const query = `BEGIN
            adm_done;
        END;`
        await conn.execute(query)
        await conn.close()
        res.status(201).send({ status: true })

    }catch(e){
        await conn.close()
        res.status(500).send({ err: e.message })
    }
})


module.exports = router