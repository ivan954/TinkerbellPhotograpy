import axios from 'axios'
import {
	GALLERY_IMAGES_FAIL,
	GALLERY_IMAGES_RECQUEST,
	GALLERY_IMAGES_SUCCESS,
} from '../constants/galleryImagesConstants'

export const galleryImagesAction = () => async (dispatch) => {
	try {
		dispatch({ type: GALLERY_IMAGES_RECQUEST })

		const galleryData = await axios.get('/api/gallery')
		const childrenData = await axios.get('/api/gallery/children')
		const familyData = await axios.get('/api/gallery/family')
		const newbornData = await axios.get('/api/gallery/newborn')
		const oneyearoldData = await axios.get('/api/gallery/oneyearold')
		const pregnancyData = await axios.get('/api/gallery/pregnancy')
		const purimData = await axios.get('/api/gallery/purim')

		dispatch({
			type: GALLERY_IMAGES_SUCCESS,
			gallery: galleryData.data,
			children: childrenData.data,
			family: familyData.data,
			newborn: newbornData.data,
			oneyearold: oneyearoldData.data,
			pregnancy: pregnancyData.data,
			purim: purimData.data,
		})
	} catch (error) {
		dispatch({
			type: GALLERY_IMAGES_FAIL,
			error:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
