import asyncHandler from 'express-async-handler'
import GalleryImagesModel from '../models/GalleryImagesModel.js'
import ChildrenImagesModel from '../models/ChildrenImagesModel.js'
import FamilyImagesModel from '../models/FamilyImagesModel.js'
import NewBornImagesModel from '../models/NewBornImagesModel.js'
import OneYearOldImagesModel from '../models/OneYearOldImagesModel.js'
import PregnancyImagesModel from '../models/PregnancyImagesModel.js'
import PurimImagesModel from '../models/PurimImagesModel.js'

// @desc Fetch gallery Images
// @route GET /api/gallery
// @access Public
const getgalleryImage = asyncHandler(async (req, res) => {
	const galleryImage = await GalleryImagesModel.find({})
	res.json(galleryImage)
})

// @desc Fetch children Images
// @route GET /api/gallery/children
// @access Public
const getchildrenImages = asyncHandler(async (req, res) => {
	const childrenImages = await ChildrenImagesModel.find({})
	res.json(childrenImages)
})

// @desc Fetch family Images
// @route GET /api/gallery/family
// @access Public
const getfamilyImages = asyncHandler(async (req, res) => {
	const familyImages = await FamilyImagesModel.find({})
	res.json(familyImages)
})

// @desc Fetch newborn Images
// @route GET /api/gallery/newborn
// @access Public
const getnewbornImages = asyncHandler(async (req, res) => {
	const newbornImages = await NewBornImagesModel.find({})
	res.json(newbornImages)
})
// @desc Fetch oneyearold Images
// @route GET /api/gallery/oneyearold
// @access Public
const getoneyearoldImages = asyncHandler(async (req, res) => {
	const oneyearoldImages = await OneYearOldImagesModel.find({})
	res.json(oneyearoldImages)
})

// @desc Fetch pregnancy Images
// @route GET /api/gallery/pregnancy
// @access Public
const getpregnancyImages = asyncHandler(async (req, res) => {
	const pregnancyImages = await PregnancyImagesModel.find({})
	res.json(pregnancyImages)
})

// @desc Fetch purim Images
// @route GET /api/gallery/purim
// @access Public
const getpurimImages = asyncHandler(async (req, res) => {
	const purimImages = await PurimImagesModel.find({})
	res.json(purimImages)
})
export {
	getgalleryImage,
	getchildrenImages,
	getfamilyImages,
	getnewbornImages,
	getoneyearoldImages,
	getpregnancyImages,
	getpurimImages,
}
