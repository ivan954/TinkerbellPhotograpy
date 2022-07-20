import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'

import homeImagesRoutes from './routes/homeImagesRoutes.js'
import galleryImagesRoutes from './routes/galleryImagesRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.send('API is runing...')
})

app.use('/api/homeimages', homeImagesRoutes)
app.use('/api/gallery', galleryImagesRoutes)
app.use('/api/user', usersRoutes)

const PORT = process.env.PORT || 5000

app.listen(
	PORT,
	console.log(
		`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
)
