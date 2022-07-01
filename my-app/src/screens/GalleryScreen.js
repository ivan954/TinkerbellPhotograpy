/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Container, Button, Card, Row, Col } from 'react-bootstrap'
import { GalleryImages } from '../images'

const GalleryScreen = () => {
	const [isHovering, setIsHovering] = useState(-1)

	return (
		<Container style={{ marginTop: '100px' }}>
			<Row xs={1} md={3}>
				{GalleryImages.map((galery, index) => (
					<Col key={index}>
						<Card
							className='bg-dark text-white shadow rounded m-2'
							onMouseEnter={() => setIsHovering(index)}
							onMouseLeave={() => setIsHovering(-1)}
						>
							<Card.Img src={galery.img} alt='Card image' />
							{isHovering === index ? (
								<Card.ImgOverlay
									style={{ backgroundColor: 'black', opacity: '60%' }}
								>
									<Button
										variant='outline-light'
										className='w-100 h-100 d-flex justify-content-center'
										href={`gallery/${galery.url}`}
									>
										<h1 className='text-dark' style={{ marginTop: '80px' }}>
											{galery.text}
										</h1>
									</Button>
								</Card.ImgOverlay>
							) : null}
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	)
}

export default GalleryScreen
