import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const OneYearOldImage = mongoose.model('OneYearOldImage', ImagesSchema)

export default OneYearOldImage
