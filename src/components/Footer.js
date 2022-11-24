import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import Logo from "../components/Logo";
import {
  BsFillChatDotsFill,
  BsWhatsapp,
  BsInstagram,
  BsFacebook,
} from "react-icons/bs";
import { AiFillCloseCircle, AiTwotonePhone } from "react-icons/ai";
import { FaWaze } from "react-icons/fa";
import { GrMail } from "react-icons/gr";

const Footer = () => {
  const [show, setShow] = useState(false);
  return (
    <footer>
      <Container fluid className="bg-white rounded" style={{ opacity: "60%" }}>
        <Logo />
        <Container className="text-center py-3">
          <h5 className="text-dark">Copyright &copy; Tinkerbell Studio</h5>
        </Container>
      </Container>
      <Button
        variant="light"
        className="position-fixed bottom-0 end-0 translate-middle selected"
        size="lg"
        active
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? (
          <AiFillCloseCircle size={40} />
        ) : (
          <BsFillChatDotsFill size={40} />
        )}
      </Button>
      {show ? (
        <Container>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "80px" }}
            href="https://wa.me/+972504230342"
          >
            <BsWhatsapp size={40} />
          </Button>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "150px" }}
            variant="info"
            href="https://ul.waze.com/ul?ll=31.90588756%2C35.00098228&navigate=yes&zoom=17&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
          >
            <FaWaze size={40} />
          </Button>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "220px" }}
            variant="danger"
            href="mailto:tinkerbell.st1@gmail.com"
          >
            <GrMail size={40} />
          </Button>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "290px" }}
            variant="secondary"
            href="https://www.instagram.com/tinkerbell_studio_5/"
          >
            <BsInstagram size={40} />
          </Button>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "360px" }}
            variant="info"
            href="https://www.facebook.com/Tinkerbell-photography-108646427594120"
          >
            <BsFacebook size={40} />
          </Button>
          <Button
            className="position-fixed bottom-0 end-0 translate-middle"
            style={{ marginBottom: "430px" }}
            variant="success"
            href="tel:+972504230342"
          >
            <AiTwotonePhone size={40} />
          </Button>
        </Container>
      ) : null}
    </footer>
  );
};

export default Footer;
