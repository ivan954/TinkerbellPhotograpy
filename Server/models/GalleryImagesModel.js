import mongoose from 'mongoose'

const GalleryImagesSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
	},
})

const GalleryImages = mongoose.model('GalleryImages', GalleryImagesSchema)

export default GalleryImages