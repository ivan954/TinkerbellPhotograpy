import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import UsersModel from '../models/UsersModel.js'

// @desc Auth user & get token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body

	const user = await UsersModel.findOne({ username })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			username: user.username,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid username or password')
	}
})

// @desc Register a new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body

	const userExists = await UsersModel.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}
	const user = await UsersModel.create({
		email,
		username,
		password,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc POST gallery images
// @route POST  /api/user/login
// @access Privet
const postgalleryImage = asyncHandler(async (req, res) => {
	const user = await UsersModel.findById(req.Users._id)

	if (user) {
		res.json({
			_id: user._id,
			username: user.username,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})
// @desc Fetch children Images
// @route POST /api/gallery/children
// @access Privet
const postchildrenImages = asyncHandler(async (req, res) => {})

// @desc Fetch family Images
// @route POST /api/gallery/family
// @access Privet
const postfamilyImages = asyncHandler(async (req, res) => {})

// @desc Fetch newborn Images
// @route POST /api/gallery/newborn
// @access Privet
const postnewbornImages = asyncHandler(async (req, res) => {})
// @desc Fetch oneyearold Images
// @route POST /api/gallery/oneyearold
// @access Privet
const postoneyearoldImages = asyncHandler(async (req, res) => {})

// @desc Fetch pregnancy Images
// @route POST /api/gallery/pregnancy
// @access Privet
const postpregnancyImages = asyncHandler(async (req, res) => {})

// @desc Fetch purim Images
// @route POST /api/gallery/purim
// @access Privet
const postpurimImages = asyncHandler(async (req, res) => {})

export { authUser, postgalleryImage, registerUser }
