import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import{Button, Form,Col,Row,Container}  from 'react-bootstrap';

function Faculty()
{
  
  return (
        <Container className="my-4">
                <div class="text-center my-5 font-weight-bold">Login as faculty</div>
                <Row>
                        <Col></Col>
                        <Col xs={6}>
                                <Form>
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                                <Form.Label column sm="2" />
                                                <Col sm="8">
                                                        <Form.Control type="text" placeholder="Email" />
                                                </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                                <Form.Label column sm="2" />
                                                <Col sm="8">
                                                        <Form.Control type="password" placeholder="Password" />
                                                </Col>
                                        </Form.Group>
                                        <div class="text-center">
                                                <Button variant="primary" type="submit">
                                                        Submit
                                                </Button>
                                        </div>
                                </Form>
                        </Col>
                        <Col></Col>
                </Row>
        </Container> 

    
  );
}

export default Faculty;