import React from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import Logo from '../components/Logo'

const Login = () => {

    const submitHandler = () =>{
        console.log('hello')
    }

	return (
		<Container>
			<Container style={{ marginTop: '10%'}}>
				<Logo />
			</Container>

			<Container
				className='w-50 text-center p-4 border border-dark border-2'
				style={{  backgroundColor: '#fff0f5' }}
			>
				<Form onSubmit={submitHandler}>
					<Form.Group className='mb-4 d-flex justify-content-center'>
						<Form.Control
							className='text-center w-50'
							type='email'
							placeholder='UserName'
						/>
					</Form.Group>

					<Form.Group className='mb-4 d-flex justify-content-center'>
						<Form.Control
							className='text-center w-50'
							type='password'
							placeholder='Password'
						/>
					</Form.Group>

					<Button variant='primary' type='submit'>
						Submit
					</Button>
				</Form>
			</Container>
		</Container>
	)
}

export default Login
