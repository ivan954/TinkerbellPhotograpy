import React from 'react'
import { Container, Carousel } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'


const ImagesCarousel = () => {
	const homeImages = useSelector((state) => state.homeImages)
	const { loading, error, carousel } = homeImages

	return (
		<Container>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Carousel variant='dark' interval={2000}>
					{carousel.map((image, index) => (
						<Carousel.Item key={index}>
							<img className='d-block w-100 rounded' src={image.img} alt='' />
						</Carousel.Item>
					))}
				</Carousel>
			)}
		</Container>
	)
}

export default ImagesCarousel
