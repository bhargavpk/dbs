import React, {useState, useRef} from 'react'
import Cookies from 'universal-cookie'
import{Button, Form,Col,Row}  from 'react-bootstrap'

export default function StudentForm() {
    const [errMessage, changeErrMessage] = useState('')
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const departmentRef = useRef(null)
    const addressRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const submitForm = async (e) => {
        e.preventDefault()
        if(passwordRef.current.value !== confirmPasswordRef.current.value)
            changeErrMessage('Passwords dont match')
        else
        {
            const token = (new Cookies()).get('idToken')
            const fullName = firstNameRef.current.value + ' ' + lastNameRef.current.value
            const studentData = [
                fullName,
                departmentRef.current.value,
                addressRef.current.value,
                passwordRef.current.value
            ]
            const res = await fetch('http://localhost:5000/institute/admit', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ studentData })
            })
            const data = await res.json()
            if(!data.err)
                changeErrMessage('Student successfully admitted')
            else
                changeErrMessage(data.err)
        }
    }

    return (
        <Form onSubmit={submitForm}>
            <Form.Group as={Row} controlId="formHorizontalFirstName">
                <Col sm={5}>
                    <Form.Control type="text" ref={firstNameRef} placeholder="First name" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalLastName">
                <Col sm={5}>
                    <Form.Control type="text" ref={lastNameRef} placeholder="Last name" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalDepartmentName">
                <Col sm={5}>
                    <Form.Control type="text" ref={departmentRef} placeholder="Department" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalAddress">
                <Col sm={5}>
                <Form.Control type="text" ref={addressRef} placeholder="Address" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Col sm={5}>
                <Form.Control type="password" ref={passwordRef} placeholder="Password" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Col sm={5}>
                <Form.Control type="password" ref={confirmPasswordRef} placeholder="Confirm password" />
                </Col>
            </Form.Group>
            <Button type="submit">Submit</Button>
            {
                errMessage===''?
                <div />:
                <div>{errMessage}</div>
            }
        </Form>
    )
}
