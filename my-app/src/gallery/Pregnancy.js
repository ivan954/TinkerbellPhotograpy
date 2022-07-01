/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap'
import { pregnancyImages } from '../images'

const Pregnancy = () => {
  return (
    <Container fluid style={{ marginTop: '100px' }}>
			<Row>
				{pregnancyImages.map((galery, index) => (
					<Col  xs={6} md={6}  key={index}>
						<Card className='bg-dark text-white shadow rounded m-2'>
							<Card.Img src={galery.img} alt='Card image' />
						</Card>
					</Col>
				))}
			</Row>
		</Container>
  )
}

export default Pregnancy