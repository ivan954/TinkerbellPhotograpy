import {
	getgalleryImage,
	getchildrenImages,
	getfamilyImages,
	getnewbornImages,
	getoneyearoldImages,
	getpregnancyImages,
	getpurimImages,
} from '../controlers/galleryImagesController.js'
import express from 'express'

const router = express.Router()

router.route('/').get(getgalleryImage)
router.route('/children').get(getchildrenImages)
router.route('/family').get(getfamilyImages)
router.route('/newborn').get(getnewbornImages)
router.route('/oneyearold').get(getoneyearoldImages)
router.route('/pregnancy').get(getpregnancyImages)
router.route('/purim').get(getpurimImages)

export default router
