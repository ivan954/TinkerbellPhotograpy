import React from 'react'
import { BsWhatsapp, BsInstagram, BsFacebook } from 'react-icons/bs'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'

const Header = () => {
	return (
		<header>
			<Container>
				<Navbar
					className='fixed-top'
					bg='light'
					expand='lg'
					style={{ opacity: '90%' }}
					collapseOnSelect
				>
					<Container>
						<Navbar.Toggle aria-controls='basic-navbar-nav' />
						<Navbar.Collapse id='basic-navbar-nav'>
							<Nav className='me-auto'>
								<Nav.Link href='https://www.instagram.com/tinkerbell_studio_5/'>
									<BsInstagram className='m-2' size={30} />
								</Nav.Link>
								<Nav.Link href='https://www.facebook.com/Tinkerbell-photography-108646427594120'>
									<BsFacebook className='m-2' size={30} />
								</Nav.Link>
								<Nav.Link href='https://wa.me/+972504230342'>
									<BsWhatsapp className='m-2' size={30} />
								</Nav.Link>
							</Nav>
							<Nav className='ms-auto'>
								<Nav.Link className='m-2' href='/contact'>
									צור קשר
								</Nav.Link>
								<NavDropdown
									className='m-2'
									title='מחירון'
									id='basic-nav-dropdown'
								>
									<NavDropdown.Item href='/PregnancyPrices'>
										הריון
									</NavDropdown.Item>
									<NavDropdown.Item href='/NewBornPrices'>
										ניובורן
									</NavDropdown.Item>
									<NavDropdown.Item href='/OneYearPrices'>
										גיל שנה
									</NavDropdown.Item>
									<NavDropdown.Item href='/HalakePrices'>
										חלאקה
									</NavDropdown.Item>
									<NavDropdown.Item href='/ChildrenPrices'>
										ילדים
									</NavDropdown.Item>
									<NavDropdown.Item href='/FamilyPrices'>
										משפחה
									</NavDropdown.Item>
									<NavDropdown.Item href='/PurimPrices'>
										פורים
									</NavDropdown.Item>
									<NavDropdown.Item href='/ShavuotPrices'>
										שבועות
									</NavDropdown.Item>
									<NavDropdown.Item href='FirstClassPrices'>
										'כיתה א
									</NavDropdown.Item>
									<NavDropdown.Item href='BarMisvaPrices'>
										בוקים בר/בת מצווה
									</NavDropdown.Item>
									<NavDropdown.Item href='/TadmitPrices'>
										צילומי תדמית
									</NavDropdown.Item>
								</NavDropdown>
								<Nav.Link className='m-2' href='/gallery'>
									גלריה
								</Nav.Link>
								<Nav.Link className='m-2' href='/'>
									ראשי
								</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</Container>
		</header>
	)
}

export default Header
