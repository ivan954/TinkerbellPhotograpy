import mongoose from 'mongoose'

const AdminUserSchima = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
})

const AdminUser = mongoose.model('AdminUser', AdminUserSchima)

export default AdminUser
