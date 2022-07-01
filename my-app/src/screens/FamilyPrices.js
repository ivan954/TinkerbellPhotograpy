import React from 'react'
import {
	Container,
	Row,
	Col,
	Card,
	ListGroup,
	DropdownButton,
	Dropdown,
	ListGroupItem,
} from 'react-bootstrap'

const FamilyPrices = () => {
  return (
    <Container style={{ marginTop: '10%' }} fluid>
			<Container>
				<h1 className='text-center'>מחירון צילומי משפחה</h1>
			</Container>
			<Container>
				<Row xl={3} xxl={3} md={3} sm={1} xs={1}>
					<Col>
						<Card
							className='m-2'
							style={{
								backgroundImage: 'linear-gradient(to bottom, #FFFF, #FFF0F5',
							}}
						>
							<Card.Img
								variant='top'
								src='http://taliachen.co.il/wp-content/uploads/2018/06/20180117_כריסטינה-25.jpg'
							/>

							<Card.Body className='text-center'>
								<Card.Title>חבילה פרימיום</Card.Title>
								<Card.Text>ש"ח 1,350</Card.Text>
							</Card.Body>
							<Card.Footer>
								<ul dir='rtl' className='text-muted'>
									<li>עד שעתים צילומים</li>
									<li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
									<li>20 תמונות ערוכות בפטושופ</li>
									<li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
									<li>צילומי משפחה</li>
									<li>קנבס 30*40</li>
									<li>אלבום דיגטילי פרמיום 30*30</li>
									<li>כל שעה נוספת 200 ש"ח</li>
								</ul>
							</Card.Footer>
						</Card>
					</Col>
					<Col>
						<Card
							className='m-2'
							style={{
								backgroundImage: 'linear-gradient(to bottom, #FFFF, #FFF0F5',
							}}
						>
							<Card.Img
								variant='top'
								src='http://taliachen.co.il/wp-content/uploads/2018/06/20180302_-אמנון-ושירלי-אמינוב-10-2.jpg'
							/>
							<Card.Body className='text-center'>
								<Card.Title>חבילה אקסטרה</Card.Title>
								<Card.Text>900 ש"ח</Card.Text>
							</Card.Body>
							<Card.Footer>
								<ul dir='rtl' className='text-muted'>
									<li>עד שעה וחצי צילומים</li>
									<li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
									<li>15 תמונות ערוכות בפטושופ</li>
									<li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
									<li>קנבס 30*40</li>
									<li>צילומי שמפחה ללא הגבלת ילדים (תוספת של 50ש"ח)</li>
									<li>כל שעה נוספת 200 ש"ח</li>
								</ul>
							</Card.Footer>
						</Card>
					</Col>
					<Col>
						<Card
							className='m-2'
							style={{
								backgroundImage: 'linear-gradient(to bottom, #FFFF, #FFF0F5',
							}}
						>
							<Card.Img
								variant='top'
								src='http://taliachen.co.il/wp-content/uploads/2018/06/20180114_עינב-בן-דוד-12.jpg'
							/>
							<Card.Body className='text-center'>
								<Card.Title>חבילה בסיסית</Card.Title>
								<Card.Text>700 ש"ח</Card.Text>
							</Card.Body>
							<Card.Footer>
								<ul dir='rtl' className='text-muted'>
									<li>עד שעה צילומים</li>
									<li>ללא הגבלת אביזרים, תלבושות ורקעים</li>
									<li>10 תמונות ערוכות בפטושופ</li>
									<li>כל התמונות מיום הצילומים בערכיה בסיסית</li>
									<li>צילומי שמפחה ללא הגבלת ילדים (תוספת של 50ש"ח)</li>
									<li>כל שעה נוספת 200 ש"ח</li>
								</ul>
							</Card.Footer>
						</Card>
					</Col>
				</Row>
			</Container>

			<Container className='mt-5'>
				<Card className='text-center d-block w-75 rounded m-auto'>
					<Card.Header style={{ backgroundColor: '#FFF0F5' }}>
						{' '}
						<h1>תוספות</h1>{' '}
					</Card.Header>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							פיתוח תמונות 15*10 - 1.50 ש"ח לתמונה
						</ListGroup.Item>
						<ListGroup.Item>
							תמונה אחת מעוצבת בפוטושופ 20 ש"ח (מעל 10 תמונות 15 ש"ח לתמונה)
						</ListGroup.Item>
						<ListGroup.Item>
							<Row>
								<Col>
									<DropdownButton
										className='p-2'
										variant='secondary'
										title='קנבסים'
									>
										<Dropdown.Item>Action</Dropdown.Item>
										<Dropdown.Item>Another action</Dropdown.Item>
									</DropdownButton>
								</Col>

								<Col>
									<DropdownButton
										className='p-2'
										variant='secondary'
										title='קאפות'
									>
										<Dropdown.Item>Action</Dropdown.Item>
										<Dropdown.Item>Another action</Dropdown.Item>
									</DropdownButton>
								</Col>
							</Row>
						</ListGroup.Item>
						<ListGroupItem>
							<Row>
								<Col>
									<DropdownButton
										className='p-2'
										variant='secondary'
										title='אלבום דיגיטלי פרימיום'
									>
										<Dropdown.Item>Action</Dropdown.Item>
										<Dropdown.Item>Another action</Dropdown.Item>
									</DropdownButton>
								</Col>
								<Col>
									<DropdownButton
										className='p-2'
										variant='secondary'
										title='אלבום דיגיטלי רגיל'
									>
										<Dropdown.Item>Action</Dropdown.Item>
										<Dropdown.Item>Another action</Dropdown.Item>
									</DropdownButton>
								</Col>
							</Row>
						</ListGroupItem>
					</ListGroup>
				</Card>
				<ListGroup className='mt-5'>
					<ListGroupItem
						className='text-center'
						style={{ backgroundColor: '#FFF0F5' }}
					>
						<h4>תנאי תשלום/ביטול</h4>
						<p>
							ניתן לשלם בהעברה /מזומן /אפליקציית תשלום עם קביעת מועד הצילומים
							תגבה מקדמה על סך 200 ש"ח יתרת התשלום תבוצע במלואה ביום הצילומים.
							ביטול העסקה כרוך בתשלום של 5% מהמקדמה ששולמה. דחיית מועד הצילומים
							עד 48 שעות מהמועד שנקבע. לא יינתן החזר על ביטול שלא במסגרת ה- 48
							שעות
						</p>
					</ListGroupItem>
				</ListGroup>
			</Container>
		</Container>
  )
}

export default FamilyPrices