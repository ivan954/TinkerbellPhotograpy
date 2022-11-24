import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsWhatsapp, BsInstagram, BsFacebook } from "react-icons/bs";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

const Header = () => {
  const [priceArr] = useState([
    { name: "הריון", to: "/PregnancyPrices" },
    { name: "ניובורן", to: "/NewBornPrices" },
    { name: "גיל שנה", to: "/OneYearPrices" },
    { name: "חלאקה", to: "/HalakePrices" },
    { name: "ילדים", to: "/ChildrenPrices" },
    { name: "משפחה", to: "/FamilyPrices" },
    { name: "פורים", to: "/PurimPrices" },
    { name: "שבועות", to: "/ShavuotPrices" },
    { name: "'כיתה א", to: "/FirstClassPrices" },
    { name: "צילומי תדמית", to: "/TadmitPrices" },
  ]);

  return (
    <header>
      <Container>
        <Navbar
          className="fixed-top"
          bg="light"
          expand="lg"
          style={{ opacity: "90%" }}
          collapseOnSelect
        >
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="https://www.instagram.com/tinkerbell_studio_5/">
                  <BsInstagram className="m-2" size={30} />
                </Nav.Link>
                <Nav.Link href="https://www.facebook.com/Tinkerbell-photography-108646427594120">
                  <BsFacebook className="m-2" size={30} />
                </Nav.Link>
                <Nav.Link href="https://wa.me/+972504230342">
                  <BsWhatsapp className="m-2" size={30} />
                </Nav.Link>
              </Nav>

              <Nav className="ms-auto">
                <Link
                  className="mt-3 m-3 text-decoration-none text-secondary"
                  to="/contact"
                >
                  צור קשר
                </Link>
                <NavDropdown
                  className="m-2"
                  title={<span className="text-secondary">מחירון</span>}
                  id="basic-nav-dropdown"
                >
                  {priceArr.map((price, index) => (
                    <NavDropdown.Item
                      as={Link}
                      key={index}
                      className="text-center text-decoration-none text-dark"
                      to={price.to}
                    >
                      {price.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>

                <Link
                  className="mt-3 m-3 text-decoration-none text-secondary"
                  to="/gallery"
                >
                  גלריה
                </Link>

                <Link
                  className="mt-3 m-3 text-decoration-none text-secondary"
                  to="/"
                >
                  ראשי
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
