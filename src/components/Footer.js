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
import footerData from "../data/components/screens/footer.json";
import "./Footer.css";

const Footer = () => {
  const [show, setShow] = useState(false);
  const { social, copyright } = footerData;

  const socialButtons = [
    {
      key: "whatsapp",
      Icon: BsWhatsapp,
      className: "whatsapp-button",
      href: social.whatsapp.url,
    },
    {
      key: "waze",
      Icon: FaWaze,
      className: "waze-button",
      href: social.waze.url,
    },
    {
      key: "email",
      Icon: GrMail,
      className: "mail-button",
      href: `mailto:${social.email.address}`,
    },
    {
      key: "instagram",
      Icon: BsInstagram,
      className: "instagram-button",
      href: social.instagram.url,
    },
    {
      key: "facebook",
      Icon: BsFacebook,
      className: "facebook-button",
      href: social.facebook.url,
    },
    {
      key: "phone",
      Icon: AiTwotonePhone,
      className: "phone-button",
      href: `tel:${social.phone.number}`,
    },
  ].sort((a, b) => social[a.key].order - social[b.key].order);

  return (
    <footer>
      <Container fluid className="footer-container">
        <Logo width={200} />
        <Container className="text-center py-3">
          <h5 className="copyright-text">{copyright}</h5>
        </Container>
      </Container>

      <Button
        className={`chat-button ${show ? "active" : ""}`}
        onClick={() => setShow(!show)}
      >
        {show ? (
          <AiFillCloseCircle size={35} />
        ) : (
          <BsFillChatDotsFill size={35} />
        )}
      </Button>

      {show && (
        <>
          {socialButtons.map((button, index) => (
            <Button
              key={button.key}
              className={`social-button show ${button.className}`}
              style={{ bottom: `calc(2rem + ${(index + 1) * 70}px)` }}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button.Icon size={30} color="white" />
            </Button>
          ))}
        </>
      )}
    </footer>
  );
};

export default Footer;
