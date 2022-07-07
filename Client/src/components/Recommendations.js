import React from 'react'
import { Container, Carousel } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'

const Recommendations = () => {
	const homeImages = useSelector((state) => state.homeImages)
	const { loading, error, recommendations } = homeImages

	return (
		<Container fluid>
			<Container>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Carousel variant='dark' interval={2000}>
						{recommendations.map((image, index) => (
							<Carousel.Item key={index}>
								<img
									className='d-block w-50 rounded m-auto p-3'
									src={image.img}
									alt=''
								/>
							</Carousel.Item>
						))}
					</Carousel>
				)}
			</Container>
		</Container>
	)
}

export default Recommendations
