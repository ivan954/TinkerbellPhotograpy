import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useSelector } from 'react-redux'

const Logo = () => {
	const homeImages = useSelector((state) => state.homeImages)
	const { loading, error, logo } = homeImages

	return (
		<>
			<Container>
				<Row>
					{loading ? (
						<Loader />
					) : error ? (
						<Message variant='danger'>{error}</Message>
					) : (
						<Col className='text-center'>
							<img src={logo.map((a) => a.img)} width={300} alt='' />
						</Col>
					)}
				</Row>
			</Container>
		</>
	)
}

export default Logo
