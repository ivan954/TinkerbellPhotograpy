import bcrypt from 'bcryptjs'

const users = [
	{
		username: 'tami',
		password: bcrypt.hashSync('320534522', 10),
	},
]

export default users
