import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import HomeScreen from './screens/HomeScreen'
import GalleryScreen from './screens/GalleryScreen'
import ContactScreen from './screens/ContactScreen'
import LoginScreen from './screens/LoginScreen'
import Children from './gallery/Children'
import Family from './gallery/Family'
import NewBorn from './gallery/NewBorn'
import OneYearOld from './gallery/OneYearOld'
import Pregnancy from './gallery/Pregnancy'
import Purim from './gallery/Purim'
import PregnancyPrices from './pricesScreens/PregnancyPrices'
import NewBornPrices from './pricesScreens/NewBornPrices'
import OneYearPrices from './pricesScreens/OneYearPrices'
import HalakePrices from './pricesScreens/HalakePrices'
import ChildrenPrices from './pricesScreens/ChildrenPrices'
import FamilyPrices from './pricesScreens/FamilyPrices'
import PurimPrices from './pricesScreens/PurimPrices'
import ShavuotPrices from './pricesScreens/ShavuotPrices'
import FirstClassPrices from './pricesScreens/FirstClassPrices'
import BarMisvaPrices from './pricesScreens/BarMisvaPrices'
import TadmitPrices from './pricesScreens/TadmitPrices'

function App() {
	return (
		<>
			<Router>
				<Header />
				<main className='py-3'>
					<Container fluid>
						<Routes>
							<Route exact path='/' element={<HomeScreen />}></Route>
							<Route exact path='/gallery' element={<GalleryScreen />}></Route>
							<Route exact path='/login' element={<LoginScreen />}></Route>
							<Route exact path='/contact' element={<ContactScreen />}></Route>
							<Route
								exact
								path='/gallery/children'
								element={<Children />}
							></Route>
							<Route exact path='/gallery/family' element={<Family />}></Route>
							<Route
								exact
								path='/gallery/newborn'
								element={<NewBorn />}
							></Route>
							<Route
								exact
								path='/gallery/oneyear'
								element={<OneYearOld />}
							></Route>
							<Route
								exact
								path='/gallery/pregnancy'
								element={<Pregnancy />}
							></Route>
							<Route exact path='/gallery/purim' element={<Purim />}></Route>
							<Route
								exact
								path='/PregnancyPrices'
								element={<PregnancyPrices />}
							></Route>
							<Route
								exact
								path='/NewBornPrices'
								element={<NewBornPrices />}
							></Route>
							<Route
								exact
								path='/OneYearPrices'
								element={<OneYearPrices />}
							></Route>
							<Route
								exact
								path='/HalakePrices'
								element={<HalakePrices />}
							></Route>
							<Route
								exact
								path='/ChildrenPrices'
								element={<ChildrenPrices />}
							></Route>
							<Route
								exact
								path='/FamilyPrices'
								element={<FamilyPrices />}
							></Route>
							<Route
								exact
								path='/PurimPrices'
								element={<PurimPrices />}
							></Route>
							<Route
								exact
								path='/ShavuotPrices'
								element={<ShavuotPrices />}
							></Route>
							<Route
								exact
								path='/FirstClassPrices'
								element={<FirstClassPrices />}
							></Route>
							<Route
								exact
								path='/BarMisvaPrices'
								element={<BarMisvaPrices />}
							></Route>
							<Route
								exact
								path='/TadmitPrices'
								element={<TadmitPrices />}
							></Route>
						</Routes>
					</Container>
				</main>
				<Footer />
			</Router>
		</>
	)
}

export default App
