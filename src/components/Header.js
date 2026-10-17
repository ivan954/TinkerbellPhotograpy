import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BsInstagram, BsFacebook } from "react-icons/bs";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import headerData from "../data/components/screens/header.json";
import footerData from "../data/components/screens/footer.json";
import commonData from "../data/components/screens/common.json";
import "./Header.css";

const Header = () => {
  const { navigation } = headerData;
  const { social } = footerData;
  const { logo } = commonData;
  const { pathname } = useLocation();
  // Controlled so the mobile menu closes after a link is tapped.
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setExpanded(false);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const priceRoutes = Object.entries(navigation.prices).map(([name, path]) => ({
    name,
    to: path,
  }));
  const onPricesPage = priceRoutes.some((route) => route.to === pathname);

  return (
    <Navbar
      expand="lg"
      className={`header fixed-top ${scrolled || expanded ? "is-scrolled" : ""}`}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo" onClick={closeMenu}>
          <img
            src={`${process.env.PUBLIC_URL}${logo.path}`}
            alt={logo.alt}
            width={130}
            height="auto"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" aria-label="פתיחת תפריט" />

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto main-nav">
            <Nav.Link as={NavLink} to="/" end onClick={closeMenu}>
              {navigation.links.home}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/gallery" onClick={closeMenu}>
              {navigation.links.gallery}
            </Nav.Link>
            <NavDropdown
              title={navigation.links.pricesDropdown}
              id="prices-nav-dropdown"
              className={onPricesPage ? "active" : ""}
            >
              {priceRoutes.map((route) => (
                <NavDropdown.Item
                  key={route.to}
                  as={NavLink}
                  to={route.to}
                  onClick={closeMenu}
                >
                  {route.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/contact" onClick={closeMenu}>
              {navigation.links.contact}
            </Nav.Link>
          </Nav>

          <div className="header-actions">
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-social"
              aria-label="אינסטגרם"
            >
              <BsInstagram />
            </a>
            <a
              href={social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="header-social"
              aria-label="פייסבוק"
            >
              <BsFacebook />
            </a>
            <Link to="/contact" className="btn-brand" onClick={closeMenu}>
              לתיאום צילום
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
