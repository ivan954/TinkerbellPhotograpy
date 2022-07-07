import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const AboutImage = mongoose.model('AboutImage', ImagesSchema)

export default AboutImage
