import React from 'react'
import { logoImage } from '../images'
import { Container, Row, Col } from 'react-bootstrap'

const Logo = () => {
	return (
		<footer>
			<Container>
				<Row>
					<Col className='text-center'>
						<img src={logoImage} width={350} alt='' />
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Logo
