import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { homeImagesReducer } from './reducers/homeImagesReducer'
import { galleryImagesReducer } from './reducers/galleryImagesReducer'
import { userLoginReducer } from './reducers/userReducer'

const reducer = combineReducers({
	homeImages: homeImagesReducer,
	galleryImages: galleryImagesReducer,
	userLogin: userLoginReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
	? JSON.parse(localStorage.getItem('userInfo'))
	: null

const initialState = {
	userLogin: { userInfo: userInfoFromStorage },
}
const middleware = [thunk]

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
)

export default store
