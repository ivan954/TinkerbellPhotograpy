import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const PregnancyImage = mongoose.model('PregnancyImage', ImagesSchema)

export default PregnancyImage
