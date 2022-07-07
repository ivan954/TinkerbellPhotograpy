import express from 'express'
import asyncHandler from 'express-async-handler'
import GalleryImagesModel from '../models/GalleryImagesModel.js'
import ChildrenImagesModel from '../models/ChildrenImagesModel.js'
import FamilyImagesModel from '../models/FamilyImagesModel.js'
import NewBornImagesModel from '../models/NewBornImagesModel.js'
import OneYearOldImagesModel from '../models/OneYearOldImagesModel.js'
import PregnancyImagesModel from '../models/PregnancyImagesModel.js'
import PurimImagesModel from '../models/PurimImagesModel.js'

const router = express.Router()

router.get(
	'/',
	asyncHandler(async (req, res) => {
		const logoImage = await GalleryImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/children',
	asyncHandler(async (req, res) => {
		const logoImage = await ChildrenImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/family',
	asyncHandler(async (req, res) => {
		const logoImage = await FamilyImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/newborn',
	asyncHandler(async (req, res) => {
		const logoImage = await NewBornImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/oneyearold',
	asyncHandler(async (req, res) => {
		const logoImage = await OneYearOldImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/pregnancy',
	asyncHandler(async (req, res) => {
		const logoImage = await PregnancyImagesModel.find({})
		res.json(logoImage)
	})
)
router.get(
	'/purim',
	asyncHandler(async (req, res) => {
		const logoImage = await PurimImagesModel.find({})
		res.json(logoImage)
	})
)

export default router
