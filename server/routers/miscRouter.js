const express = require('express')
const oracledb = require('oracledb')
const instituteAuth = require('../middleware/instituteAuth')

const router = new express.Router()

router.get('/course/curriculum', async (req, res) => {
    var conn
    try{
        const departmentName = req.query['department_name']
        if(!departmentName || departmentName==='')
            throw new Error('Invalid department name')
        conn = await oracledb.getConnection()
        //Sort by department name later
        const queryCourses = `SELECT course_id, course_name, type, sem, credit FROM course NATURAL JOIN (
            SELECT DISTINCT course_id, sem, branch FROM course_allocated WHERE branch = \'`+departmentName+`\'
        ) course_info ORDER BY sem`
        const resultSet = (await conn.execute(queryCourses)).rows
        const courseList = []
        var currentCourseList = []
        var currentSemester = 0
        resultSet.forEach(course => {
            if(course[3] !== currentSemester)
            {
                if(currentSemester !== 0)
                    courseList.push(currentCourseList)
                currentCourseList = []
                currentSemester = course[3]
            }
            currentCourseList.push({
                courseId: course[0],
                courseName: course[1],
                courseType: course[2],
                courseCredit: course[4]
            })
        })
        courseList.push(currentCourseList)

        const queryBreadthCourses = `SELECT course_id, course_name, type, sem, credit FROM course NATURAL JOIN (
            SELECT DISTINCT course_id, sem, branch FROM breadth_allocated WHERE branch = \'`+departmentName+`\'
        ) course_info ORDER BY sem`
        const breadthResultSet = (await conn.execute(queryBreadthCourses)).rows
        const breadthCourseList = []
        currentCourseList = []
        currentSemester = 3
        breadthResultSet.forEach(course => {
            if(course[3] !== currentSemester)
            {
                if(currentSemester !== 0)
                    courseList.push(currentCourseList)
                currentCourseList = []
                currentSemester = course[3]
            }
            currentCourseList.push({
                courseId: course[0],
                courseName: course[1],
                courseType: course[2],
                courseCredit: course[4]
            })
        })
        breadthCourseList.push(currentCourseList)

        await conn.close()
        res.send({ courseList, breadthCourseList })

    }catch(e){
        await conn.close()
        res.status(404).send({ err: e })
    }
})

router.get('/about', async (req, res) => {
    var conn
    try{
        conn = await oracledb.getConnection()
        var query, resultSet
        query = 'SELECT * FROM seat_matrix_branch'
        const seatMatrix = (await conn.execute(query)).rows
        query = 'SELECT * FROM offered_branch'
        resultSet = (await conn.execute(query)).rows
        const branchListArr = resultSet
        const branchList = []
        branchListArr.forEach(branch => {
            branchList.push(branch[0])
        })
        query = 'SELECT instructor_name FROM instructor NATURAL JOIN institute'
        resultSet = (await conn.execute(query)).rows
        const directorName = resultSet[0][0]
        await conn.close()
        res.send({
            seatMatrix,
            branchList,
            directorName
        })

    }catch(e){
        await conn.close()
        res.send({ err: e })
    }
})

module.exports = router