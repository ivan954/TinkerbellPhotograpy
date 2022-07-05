import React from 'react'
import { logoImage } from '../images'
import { Container, Row, Col } from 'react-bootstrap'

const Logo = () => {
	return (
		<>
			<Container>
				<Row>
					<Col className='text-center'>
						<img src={logoImage} width={300} alt='' />
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default Logo
