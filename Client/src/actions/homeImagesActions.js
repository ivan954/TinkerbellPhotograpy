import axios from 'axios'
import {
	HOME_IMAGES_FAIL,
	HOME_IMAGES_RECQUEST,
	HOME_IMAGES_SUCCESS,
} from '../constants/homeImagesConstants'

export const homeImagesAction = () => async (dispatch) => {
	try {
		dispatch({ type: HOME_IMAGES_RECQUEST })

		const carouselData = await axios.get('/api/homeimages/carousel')
		const aboutData = await axios.get('/api/homeimages/about')
		const recommendationsData = await axios.get('/api/homeimages/recommendations')
		const logoData = await axios.get('/api/homeimages/logo')

		dispatch({
			type: HOME_IMAGES_SUCCESS,
			carousel: carouselData.data,
			about: aboutData.data,
			recommendations: recommendationsData.data,
			logo: logoData.data,
		})
	} catch (error) {
		dispatch({
			type: HOME_IMAGES_FAIL,
			error:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
