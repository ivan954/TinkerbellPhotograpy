import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ImagesCarousel from '../components/ImagesCarousel'
import Recommendations from '../components/Recommendations'
import Logo from '../components/Logo'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { homeImagesAction } from '../actions/homeImagesActions'

const HomeScreen = () => {
	const dispatch = useDispatch()
	const homeImages = useSelector((state) => state.homeImages)
	const { loading, error, about } = homeImages

	useEffect(() => {
		dispatch(homeImagesAction())
	}, [dispatch])

	return (
		<Container className='mt-5' fluid>
			<Logo />
			<Container className='mb-5' fluid>
				<ImagesCarousel />
			</Container>

			<Container>
				<Container>
					<h1 className='text-center'>ברוכים הבאים לטינקרבל סטודיו</h1>
					<h2 className='text-center'>קצת על עצי ועל הסטודיו שלי</h2>
				</Container>
				<Container>
					<Row xl={2} xxl={2} md={2} sm={1} xs={1}>
						{loading ? (
							<Loader />
						) : error ? (
							<Message variant='danger'>{error}</Message>
						) : (
							<Col>
								<img
									className='d-block w-75 rounded m-auto'
									src={about.map((a) => a.img)}
									alt=''
								/>
							</Col>
						)}

						<Col>
						<br/><br/>
							<p className='text-center text-dark'>
								היי, שמי תמי מזור, גרה במודיעין מכבים רעות ואני צלמת מגיל קטן.
								היום בעלת סטודיו בוטיק לצילומי ניו בורן, צילומי הריון, צילומי
								גיל שנה, צילומי משפחות, צילומי זוגות, וכול מה שעוד עולה לכם
								לראש, אין גבול לדמיון או ליצירה, ברשותי המון סוגי רקעים ואביזרם
								לכל סוגי הצילום. כשמגיעים אלי לסטודיו ההרגשה הראשונית, היא הרגע
								הזה שבו אנחנו מתארגנים על הנראות שלנו ומיצרים את הזיכרונות שלנו,
								את איך שאנחנו רוצים שנזכור את עצמינו או את האהובים שלנו, לכן
								האיכות והמקצועיות היא מעל הכול, השקט מייצר ריכוז והזמן נעצר
								ומשתחרר עם קבלת התמונות/ האלבום. מכאן אפשר להיות רגועים ובטוחים
								שאת הרגע הזה בסטודיו שלי (הקסם ואת האהובים שלנו) לא נשכח לעולם.
								אז אתם יותר ממוזמנים לחוויה שהיא כל כולה מהאגדות.
							</p>
						</Col>
					</Row>
				</Container>
			</Container>
			<Container>
				<h1 className='text-center m-4'>המלצות</h1>
				<Recommendations />
			</Container>
		</Container>
	)
}

export default HomeScreen
