import express from 'express'
import asyncHandler from 'express-async-handler'
import CarouselImage from '../models/CarouselImagesModel.js'
import LogoImage from '../models/LogoImageModel.js'
import AboutImage from '../models/AboutImageModel.js'
import RecommendationsImages from '../models/RecommendationsImagesModel.js'

const router = express.Router()

router.get(
	'/logo',
	asyncHandler(async (req, res) => {
		const logoImage = await LogoImage.find({})
		res.json(logoImage)
	})
)

router.get(
	'/carousel',
	asyncHandler(async (req, res) => {
		const carouselImage = await CarouselImage.find({})

		res.json(carouselImage)
	})
)
router.get(
	'/about',
	asyncHandler(async (req, res) => {
		const aboutImage = await AboutImage.find({})
		res.json(aboutImage)
	})
)
router.get(
	'/recommendations',
	asyncHandler(async (req, res) => {
		const recommendationsImages = await RecommendationsImages.find({})
		res.json(recommendationsImages)
	})
)

export default router
