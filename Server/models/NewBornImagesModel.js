import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const NewBornImage = mongoose.model('NewBornImage', ImagesSchema)

export default NewBornImage
