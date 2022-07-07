import connectDB from './config/db.js'
import mongoose from 'mongoose'
import detenv from 'dotenv'
import colors from 'colors'

import AdminUser from './data/AdminUser.js'
import AboutImage from './data/AboutImage.js'
import CarouselImages from './data/CarouselImages.js'
import ChildrenImages from './data/ChildrenImages.js'
import FamilyImages from './data/FamilyImages.js'
import GalleryImages from './data/GalleryImages.js'
import LogoImage from './data/LogoImage.js'
import NewBornImages from './data/NewBornImages.js'
import OneYearOldImages from './data/OneYearOldImages.js'
import PregnancyImages from './data/PregnancyImages.js'
import PurimImages from './data/PurimImages.js'
import RecommendationsImages from './data/RecommendationsImages.js'

import AdminUserModel from './models/AdminUserModel.js'
import AboutImageModel from './models/AboutImageModel.js'
import CarouselImagesModel from './models/CarouselImagesModel.js'
import ChildrenImagesModel from './models/ChildrenImagesModel.js'
import FamilyImagesModel from './models/FamilyImagesModel.js'
import GalleryImagesModel from './models/GalleryImagesModel.js'
import LogoImageModel from './models/LogoImageModel.js'
import NewBornImagesModel from './models/NewBornImagesModel.js'
import OneYearOldImagesModel from './models/OneYearOldImagesModel.js'
import PregnancyImagesModel from './models/PregnancyImagesModel.js'
import PurimImagesModel from './models/PurimImagesModel.js'
import RecommendationsImagesModel from './models/RecommendationsImagesModel.js'

detenv.config()

connectDB()

const importData = async () => {
	try {
		await AdminUserModel.deleteMany()
		await AboutImageModel.deleteMany()
		await CarouselImagesModel.deleteMany()
		await ChildrenImagesModel.deleteMany()
		await FamilyImagesModel.deleteMany()
		await GalleryImagesModel.deleteMany()
		await LogoImageModel.deleteMany()
		await NewBornImagesModel.deleteMany()
		await OneYearOldImagesModel.deleteMany()
		await PregnancyImagesModel.deleteMany()
		await PurimImagesModel.deleteMany()
		await RecommendationsImagesModel.deleteMany()

		await AdminUserModel.insertMany(AdminUser)
		await AboutImageModel.insertMany(AboutImage)
		await CarouselImagesModel.insertMany(CarouselImages)
		await ChildrenImagesModel.insertMany(ChildrenImages)
		await FamilyImagesModel.insertMany(FamilyImages)
		await GalleryImagesModel.insertMany(GalleryImages)
		await LogoImageModel.insertMany(LogoImage)
		await NewBornImagesModel.insertMany(NewBornImages)
		await OneYearOldImagesModel.insertMany(OneYearOldImages)
		await PregnancyImagesModel.insertMany(PregnancyImages)
		await PurimImagesModel.insertMany(PurimImages)
		await RecommendationsImagesModel.insertMany(RecommendationsImages)

		console.log('Data Imported!'.green.inverse)
		process.exit()
	} catch (error) {
		console.log(`${error}`.red.inverse)
		process.exit(1)
	}
}
const destroyData = async () => {
	try {
		await AdminUserModel.deleteMany()
		await AboutImageModel.deleteMany()
		await CarouselImagesModel.deleteMany()
		await ChildrenImagesModel.deleteMany()
		await FamilyImagesModel.deleteMany()
		await GalleryImagesModel.deleteMany()
		await LogoImageModel.deleteMany()
		await NewBornImagesModel.deleteMany()
		await OneYearOldImagesModel.deleteMany()
		await PregnancyImagesModel.deleteMany()
		await PurimImagesModel.deleteMany()
		await RecommendationsImagesModel.deleteMany()

		console.log('Data Destroy!'.red.inverse)
		process.exit()
	} catch (error) {
		console.log(`${error}`.red.inverse)
		process.exit(1)
	}
}

if (process.argv[2] == '-d') {
	destroyData()
} else {
	importData()
}
