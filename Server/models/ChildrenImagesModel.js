import mongoose from 'mongoose'

const ImagesSchema = mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
})

const ChildrenImage = mongoose.model('ChildrenImage', ImagesSchema)

export default ChildrenImage
