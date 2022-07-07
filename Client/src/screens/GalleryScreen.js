import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Container, Button, Card, Row, Col } from 'react-bootstrap'
import { galleryImagesAction } from '../actions/galleryImagesAction'

const GalleryScreen = () => {
	const dispatch = useDispatch()
	const [isHovering, setIsHovering] = useState(-1)
	const galleryImages = useSelector((state) => state.galleryImages)
	const { loading, error, gallery } = galleryImages

	useEffect(() => {
		dispatch(galleryImagesAction())
	}, [dispatch])

	return (
		<Container style={{ marginTop: '100px' }}>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row xs={1} md={3}>
					{gallery.map((galery, index) => (
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
			)}
		</Container>
	)
}

export default GalleryScreen
