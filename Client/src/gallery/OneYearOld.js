import React, { useEffect } from 'react'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Container, Card, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { galleryImagesAction } from '../actions/galleryImagesAction'

const OneYearOld = () => {
	const dispatch = useDispatch()
	const galleryImages = useSelector((state) => state.galleryImages)
	const { loading, error, oneyearold } = galleryImages

	useEffect(() => {
		dispatch(galleryImagesAction())
	}, [dispatch])
	return (
		<Container fluid style={{ marginTop: '100px' }}>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row>
					{oneyearold.map((galery, index) => (
						<Col xs={6} md={6} key={index}>
							<Card className='bg-dark text-white shadow rounded m-2'>
								<Card.Img src={galery.img} alt='Card image' />
							</Card>
						</Col>
					))}
				</Row>
			)}
		</Container>
	)
}

export default OneYearOld
