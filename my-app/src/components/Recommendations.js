import React from 'react'
import { Container, Carousel } from 'react-bootstrap'
import { RecommendationsImages } from '../images'

const Recommendations = () => {
	return (
		<Container fluid>
			<Container>
			<Carousel variant='dark' interval={2000}>
				{RecommendationsImages.map((image, index) => (
					<Carousel.Item key={index}>
						<img className='d-block w-25 rounded m-auto p-3' src={image.img} alt='' />
					</Carousel.Item>
				))}
			</Carousel>
		</Container>
		</Container>
		
	)
}

export default Recommendations
