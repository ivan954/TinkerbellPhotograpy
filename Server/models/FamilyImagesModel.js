import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const FamilyImage = mongoose.model('FamilyImage', ImagesSchema)

export default FamilyImage
