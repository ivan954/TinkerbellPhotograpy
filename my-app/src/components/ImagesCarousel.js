import React from 'react'
import { Container, Carousel } from 'react-bootstrap'
import { CarouselImages } from '../images'

const ImagesCarousel = () => {
	return (
		<Container>
			<Carousel variant='dark' interval={2000}>
				{CarouselImages.map((image, index) => (
					<Carousel.Item key={index}>
						<img className='d-block w-100 rounded' src={image.img} alt='' />
					</Carousel.Item>
				))}
			</Carousel>
		</Container>
	)
}

export default ImagesCarousel
