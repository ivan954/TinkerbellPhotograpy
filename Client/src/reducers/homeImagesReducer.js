import {
	HOME_IMAGES_FAIL,
	HOME_IMAGES_RECQUEST,
	HOME_IMAGES_SUCCESS,
} from '../constants/homeImagesConstants'

export const homeImagesReducer = (
	state = { carousel: [], about: [], recommendations: [], logo: [] },
	action
) => {
	switch (action.type) {
		case HOME_IMAGES_RECQUEST:
			return {
				loading: true,
				carousel: [],
				about: [],
				recommendations: [],
				logo: [],
			}

		case HOME_IMAGES_SUCCESS:
			return {
				loading: false,
				carousel: action.carousel,
				about: action.about,
				recommendations: action.recommendations,
				logo: action.logo,
			}

		case HOME_IMAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
