import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const UsersSchima = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
})

UsersSchima.methods.matchPassword = async function (enterdPassword) {
	return await bcryptjs.compare(enterdPassword, this.password)
}

UsersSchima.pre('save', async function (next) {

	// to not hash the password after update 
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcryptjs.genSalt(10)
	this.password = await bcryptjs.hash(this.password, salt)
})

const User = mongoose.model('Users', UsersSchima)

export default User
