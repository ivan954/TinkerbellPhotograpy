import asyncHandler from 'express-async-handler'
import CarouselImage from '../models/CarouselImagesModel.js'
import LogoImage from '../models/LogoImageModel.js'
import AboutImage from '../models/AboutImageModel.js'
import RecommendationsImages from '../models/RecommendationsImagesModel.js'

// @desc Fetch logo Image
// @route GET /api/gallery
// @access Public
const getlogoImage = asyncHandler(async (req, res) => {
	const logoImage = await LogoImage.find({})
		res.json(logoImage)
})

// @desc Fetch carousel Images
// @route GET /api/gallery/children
// @access Public
const getcarouselImages = asyncHandler(async (req, res) => {
	const carouselImages = await CarouselImage.find({})
		res.json(carouselImages)
})

// @desc Fetch about Image
// @route GET /api/gallery/family
// @access Public
const getaboutImage = asyncHandler(async (req, res) => {
	const aboutImage = await AboutImage.find({})
		res.json(aboutImage)
})

// @desc Fetch recommendations Images
// @route GET /api/gallery/newborn
// @access Public
const getrecommendationsImages = asyncHandler(async (req, res) => {
	const recommendationsImages = await RecommendationsImages.find({})
		res.json(recommendationsImages)
})
export {
	getlogoImage,
	getcarouselImages,
	getaboutImage,
	getrecommendationsImages,
}
