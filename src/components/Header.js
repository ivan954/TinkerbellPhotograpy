import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BsInstagram, BsFacebook } from "react-icons/bs";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useContent } from "../content/ContentProvider";
import Photo from "./Photo";
import { useWhatsappLink } from "../data/whatsapp";
import { useCategories } from "../data/categories";
import "./Header.css";

const Header = () => {
  const { navigation } = useContent("header");
  const { social } = useContent("footer");
  const { logo } = useContent("common");
  const faq = useContent("faq");
  const categories = useCategories();
  const whatsappLink = useWhatsappLink();
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

  const priceRoutes = categories.map((category) => ({
    name: category.title,
    to: category.pricesPath,
  }));
  const onPricesPage = pathname === "/pricing" || priceRoutes.some((route) => route.to === pathname);

  return (
    <Navbar
      expand="lg"
      className={`header fixed-top ${scrolled || expanded ? "is-scrolled" : ""}`}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo" onClick={closeMenu}>
          {/* The logo is 600×311; the 400px WebP copy is plenty at this size. */}
          <Photo path={logo.path} sizes="130px" thumbOnly alt={logo.alt} width="130" height="67" fetchpriority="high" />
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
            <Nav.Link as={NavLink} to="/about" onClick={closeMenu}>
              {navigation.links.aboutPage}
            </Nav.Link>
            <NavDropdown
              title={navigation.links.pricesDropdown}
              id="prices-nav-dropdown"
              className={onPricesPage ? "active" : ""}
            >
              <NavDropdown.Item as={NavLink} to="/pricing" end onClick={closeMenu} className="dropdown-all">
                {navigation.links.allPrices}
              </NavDropdown.Item>
              <NavDropdown.Divider />
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
            {faq.visible && (
              <Nav.Link as={NavLink} to="/faq" onClick={closeMenu}>
                {navigation.links.faq}
              </Nav.Link>
            )}
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
            <a
              href={whatsappLink(navigation.links.bookMessage)}
              className="btn-brand"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              {navigation.links.book}
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
