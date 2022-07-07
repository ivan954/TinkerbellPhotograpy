import {
	GALLERY_IMAGES_FAIL,
	GALLERY_IMAGES_RECQUEST,
	GALLERY_IMAGES_SUCCESS,
} from '../constants/galleryImagesConstants'

export const galleryImagesReducer = (
	state = {
		gallery: [],
		children: [],
		family: [],
		newborn: [],
		oneyearold: [],
		pregnancy: [],
		purim: [],
	},
	action
) => {
	switch (action.type) {
		case GALLERY_IMAGES_RECQUEST:
			return {
				loading: true,
				gallery: [],
				children: [],
				family: [],
				newborn: [],
				oneyearold: [],
				pregnancy: [],
				purim: [],
			}

		case GALLERY_IMAGES_SUCCESS:
			return {
				loading: false,
				gallery: action.gallery,
				children: action.children,
				family: action.family,
				newborn: action.newborn,
				oneyearold: action.oneyearold,
				pregnancy: action.pregnancy,
				purim: action.purim,
			}

		case GALLERY_IMAGES_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
