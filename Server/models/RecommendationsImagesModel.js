import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const RecommendationsImage = mongoose.model(
	'RecommendationsImage',
	ImagesSchema
)

export default RecommendationsImage
