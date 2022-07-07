import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const LogoImage = mongoose.model('LogoImage', ImagesSchema)

export default LogoImage
