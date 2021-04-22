const express = require('express')
const oracledb = require('oracledb')

const router = new express.Router()

router.get('/course/curriculum', async (req, res) => {
    try{
        const departmentName = req.query['department_name']
        if(!departmentName || departmentName==='')
            throw new Error('Invalid department name')
        const conn = await oracledb.getConnection()
        //Sort by department name later
        const queryCourses = 'SELECT * FROM Course ORDER BY semester_no'
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
        await conn.close()
        res.send({ courseList })

    }catch(e){
        res.status(404).send({ err: e })
    }
})

module.exports = router