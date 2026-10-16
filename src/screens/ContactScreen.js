import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import Logo from "../components/Logo";
import Message from "../components/Message";
import contactData from "../data/components/screens/contact.json";

const ContactScreen = () => {
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const { form, info } = contactData;

  const handleSubmit = (event) => {
    event.preventDefault();
    emailjs
      .sendForm(
        form.emailjs.serviceId,
        form.emailjs.templateId,
        event.target,
        form.emailjs.userId
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
    <Container className="mt-3" fluid>
      <Logo />
      <Container>
        <Row>
          <Col>
            <Container>
              <h1 className="text-center">{form.title}</h1>
              <Form className="m-3" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    className="text-center m-3"
                    name="name"
                    placeholder={form.fields.name}
                  />
                </Form.Group>

                <Form.Control
                  className="text-center m-3"
                  name="email"
                  placeholder={form.fields.email}
                />
                <Form.Control
                  className="text-center m-3"
                  name="phone"
                  placeholder={form.fields.phone}
                />
                <Form.Control
                  name="message"
                  className="text-center m-3 p-5"
                  placeholder={form.fields.message}
                />

                <Row className="justify-content-center">
                  <Button type="submit" className="m-4 btn btn-primary w-25">
                    {form.buttons.submit}
                  </Button>
                  <Alert
                    show={success}
                    variant="success"
                    className="text-center m-3"
                  >
                    <Alert.Heading>{form.messages.success}</Alert.Heading>
                  </Alert>
                  {error && <Message variant="danger">{error}</Message>}
                </Row>
              </Form>
            </Container>
          </Col>
          <Col>
            <Container
              className="border border-dark border-2 p-5 mb-4"
              style={{ backgroundColor: "#fff0f5", opacity: "70%" }}
            >
              <h1 className="text-center text-dark p-3">{info.studio.name}</h1>
              <h3 className="text-center text-dark">
                {info.studio.photographer}
              </h3>
              <h3 className="text-center text-dark">{info.address.street}</h3>
              <h3 className="text-center text-dark">{info.address.city}</h3>
              <h3 className="text-center text-dark">
                {info.businessHours.title}
              </h3>
              <h3 className="text-center text-dark">
                {info.businessHours.weekdays}
              </h3>
              <h3 className="text-center text-dark">
                {info.businessHours.friday}
              </h3>
              <h4 className="text-center text-dark">
                {info.businessHours.saturday}
              </h4>
            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ContactScreen;
