import {
	getlogoImage,
	getcarouselImages,
	getaboutImage,
	getrecommendationsImages,
} from '../controlers/homeImagesController.js'
import express from 'express'

const router = express.Router()

router.route('/logo').get(getlogoImage)
router.route('/carousel').get(getcarouselImages)
router.route('/about').get(getaboutImage)
router.route('/recommendations').get(getrecommendationsImages)

export default router
