import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const PurimImage = mongoose.model('PurimImage', ImagesSchema)

export default PurimImage
