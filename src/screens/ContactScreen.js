import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import Logo from "../components/Logo";
import Message from "../components/Message";

const ContactScreen = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    emailjs
      .sendForm(
        "service_6sg0n85",
        "template_3xp1igw",
        event.target,
        "7YFNhK8QbTvo1UzF5"
      )
      .then((res) => {
        console.log(res);
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        error.response && error.response.data.message
          ? setError(error.response.data.message)
          : setError(error.message);
      });
  };

  return (
    <Container className="mt-5" fluid>
      <Logo />
      <Container>
        <Row>
          <Col>
            <Container>
              <h1 className="text-center">השארת פרטים</h1>
              <Form className="m-3" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    className="text-center m-3"
                    name="name"
                    placeholder="שם"
                  />
                </Form.Group>

                <Form.Control
                  className="text-center m-3"
                  name="email"
                  placeholder="מייל"
                />
                <Form.Control
                  className="text-center m-3"
                  name="phone"
                  placeholder="טלפון"
                />
                <Form.Control
                  name="message"
                  className="text-center m-3 p-5"
                  placeholder="הודעה"
                />

                <Row className="justify-content-center">
                  <Button type="submit" className="m-4 btn btn-primary w-25 ">
                    שלח
                  </Button>
                  <Alert
                    show={success}
                    variant="success"
                    className="text-center m-3"
                  >
                    <Alert.Heading>ההודעה נשלחה בהצלחה</Alert.Heading>
                  </Alert>
                  {error && <Message variant="danger">{error}</Message>}
                </Row>
              </Form>
            </Container>
          </Col>
          <Col>
            <Container
              className="border border-dark border-2 p-5"
              style={{ backgroundColor: "#fff0f5", opacity: "70%" }}
            >
              <h1 className="text-center text-dark p-3">טינקרבל סטודיו</h1>
              <h3 className="text-center text-dark">תמי מזור - 0504230342</h3>
              <h3 className="text-center text-dark">כתובת - מבצע נחשון 23</h3>
              <h3 className="text-center text-dark">מודיעין -מכבים-רעות</h3>
              <h3 className="text-center text-dark">שעות פעילות</h3>
              <h3 className="text-center text-dark">
                ימים : א'- ה' 17:00 - 9:00
              </h3>
              <h3 className="text-center text-dark">יום שישי 15:00 - 9:00</h3>
              <h4 className="text-center text-dark">(לא עובדים בשבת)</h4>
            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ContactScreen;
