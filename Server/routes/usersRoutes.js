import {
	authUser,
	postgalleryImage,
	registerUser,
} from '../controlers/usersController.js'
import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser)
router.post('/login', authUser)
router.route('/galleryimage').get(protect, postgalleryImage)

export default router
