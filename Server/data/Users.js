import bcrypt from 'bcryptjs'

const users = [
	{
		email: 'tinkerbell.st1@gmail.com',
		username: 'tami',
		password: bcrypt.hashSync('320534522', 10),
		isAdmin: true,
	},
]

export default users
