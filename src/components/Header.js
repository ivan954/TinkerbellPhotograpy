import React from "react";
import { Link } from "react-router-dom";
import { BsWhatsapp, BsInstagram, BsFacebook } from "react-icons/bs";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import Logo from "./Logo";
import headerData from "../data/components/screens/header.json";
import footerData from "../data/components/screens/footer.json";
import "./Header.css";

const Header = () => {
  const { navigation } = headerData;
  const { social } = footerData;

  const priceRoutes = Object.entries(navigation.prices).map(([name, path]) => ({
    name,
    to: path,
  }));

  return (
    <Navbar bg="light" expand="lg" className="header fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <Logo width={150} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto main-nav">
            <Nav.Link as={Link} to="/contact">
              {navigation.links.contact}
            </Nav.Link>
            <Nav.Link as={Link} to="/gallery">
              {navigation.links.gallery}
            </Nav.Link>
            <NavDropdown
              title={navigation.links.pricesDropdown}
              id="basic-nav-dropdown"
            >
              {priceRoutes.map((route, index) => (
                <NavDropdown.Item key={index} as={Link} to={route.to}>
                  {route.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={Link} to="/">
              {navigation.links.home}
            </Nav.Link>
          </Nav>
          <Nav className="social-nav">
            <Nav.Link
              href={social.whatsapp.url}
              target="_blank"
              className="whatsapp-link"
            >
              <BsWhatsapp className="fa-whatsapp" />
            </Nav.Link>
            <Nav.Link
              href={social.instagram.url}
              target="_blank"
              className="instagram-link"
            >
              <BsInstagram className="fa-instagram" />
            </Nav.Link>
            <Nav.Link
              href={social.facebook.url}
              target="_blank"
              className="facebook-link"
            >
              <BsFacebook className="fa-facebook" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
