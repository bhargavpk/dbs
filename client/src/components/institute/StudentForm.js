import React from 'react'
import{Button, Form,Col,Row}  from 'react-bootstrap'

export default function StudentForm() {
    return (
        <Form>
            <Form.Group as={Row} controlId="formHorizontalFirstName">
                <Col sm={5}>
                    <Form.Control type="text" placeholder="First name" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalLastName">
                <Col sm={5}>
                    <Form.Control type="text" placeholder="Last name" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalDepartmentName">
                <Col sm={5}>
                    <Form.Control type="text" placeholder="Department" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalSemester">
                <Col sm={5}>
                    <Form.Control type="text" placeholder="Semester" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Col sm={5}>
                <Form.Control type="password" placeholder="Password" />
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalPassword">
                <Col sm={5}>
                <Form.Control type="password" placeholder="Confirm password" />
                </Col>
            </Form.Group>
            <Button type="submit">Submit</Button>
        </Form>
            
            /* <div class="text-center">
                    {
                        errMessageStatus===true?
                        <span className="err-message">Invalid credentials</span>:
                        <div/>
                    }
                    <Button variant="primary" type="submit">
                            Submit
                    </Button>
            </div> */
    )
}
