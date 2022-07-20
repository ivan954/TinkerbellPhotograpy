import axios from 'axios'
import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
} from '../constants/userConstants'

export const login = (email, username, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		})
		const config = {
			headers: {
				'Content=Type': 'aplicationm/json',
			},
		}

		const { data } = await axios.post(
			'/api/user/login',
			{ email, password, username },
			config
		)

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		})

		localStorage.setItem('userInfo', JSON.stringify(data))
	} catch (error) {
		dispatch({
			type: USER_LOGIN_FAIL,
			error:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		})
	}
}
