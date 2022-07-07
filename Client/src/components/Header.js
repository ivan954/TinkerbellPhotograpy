import React from 'react'
import { Link } from 'react-router-dom'
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
								<Nav.Link className='m-2'>
									<Link
										className='text-decoration-none text-secondary'
										to='/login'
									>
										כניסת הנהלה
									</Link>
								</Nav.Link>
								<Nav.Link className='m-2'>
									<Link
										className='text-decoration-none text-secondary'
										to='/contact'
									>
										צור קשר
									</Link>
								</Nav.Link>
								<NavDropdown
									className='m-2'
									title={<span className='text-secondary'>מחירון</span>}
									id='basic-nav-dropdown'
								>
									<NavDropdown.Item href=''>
										<Link
											className='text-decoration-none text-secondary'
											to='/PregnancyPrices'
										>
											הריון
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item href=''>
										<Link
											className='text-decoration-none text-secondary'
											to='/NewBornPrices'
										>
											ניובורן
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/OneYearPrices'
										>
											גיל שנה
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/HalakePrices'
										>
											חלאקה
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/ChildrenPrices'
										>
											ילדים
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/FamilyPrices'
										>
											משפחה
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/PurimPrices'
										>
											פורים
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/ShavuotPrices'
										>
											שבועות
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/FirstClassPrices'
										>
											'כיתה א
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/BarMisvaPrices'
										>
											בוקים בר/בת מצווה
										</Link>
									</NavDropdown.Item>
									<NavDropdown.Item>
										<Link
											className='text-decoration-none text-secondary'
											to='/TadmitPrices'
										>
											צילומי תדמית
										</Link>
									</NavDropdown.Item>
								</NavDropdown>
								<Nav.Link className='m-2'>
									<Link
										className='text-decoration-none text-secondary'
										to='/gallery'
									>
										גלריה
									</Link>
								</Nav.Link>
								<Nav.Link className='m-2' href='/'>
									<Link className='text-decoration-none text-secondary' to='/'>
										ראשי
									</Link>
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
