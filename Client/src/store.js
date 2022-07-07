import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { homeImagesReducer } from './reducers/homeImagesReducer'
import { galleryImagesReducer } from './reducers/galleryImagesReducer'

const reducer = combineReducers({
	homeImages: homeImagesReducer,
	galleryImages: galleryImagesReducer,
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
)

export default store
