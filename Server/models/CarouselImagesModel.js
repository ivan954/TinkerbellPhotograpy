import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const CarouselImage = mongoose.model('CarouselImage', ImagesSchema)

export default CarouselImage
