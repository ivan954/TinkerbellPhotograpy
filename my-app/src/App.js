import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import HomeScreen from './screens/HomeScreen'
import GalleryScreen from './screens/GalleryScreen'
import ContactScreen from './screens/ContactScreen'
import Children from './gallery/Children'
import Family from './gallery/Family'
import NewBorn from './gallery/NewBorn'
import OneYearOld from './gallery/OneYearOld'
import Pregnancy from './gallery/Pregnancy'
import Purim from './gallery/Purim'
import PregnancyPrices from './screens/PregnancyPrices'
import NewBornPrices from './screens/NewBornPrices'
import OneYearPrices from './screens/OneYearPrices'
import HalakePrices from './screens/HalakePrices'
import ChildrenPrices from './screens/ChildrenPrices'
import FamilyPrices from './screens/FamilyPrices'
import PurimPrices from './screens/PurimPrices'
import ShavuotPrices from './screens/ShavuotPrices'
import FirstClassPrices from './screens/FirstClassPrices'
import BarMisvaPrices from './screens/BarMisvaPrices'
import TadmitPrices from './screens/TadmitPrices'

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
							<Route exact path='/PregnancyPrices' element={<PregnancyPrices />}></Route>
							<Route exact path='/NewBornPrices' element={<NewBornPrices />}></Route>
							<Route exact path='/OneYearPrices' element={<OneYearPrices />}></Route>
							<Route exact path='/HalakePrices' element={<HalakePrices />}></Route>
							<Route exact path='/ChildrenPrices' element={<ChildrenPrices />}></Route>
							<Route exact path='/FamilyPrices' element={<FamilyPrices />}></Route>
							<Route exact path='/PurimPrices' element={<PurimPrices />}></Route>
							<Route exact path='/ShavuotPrices' element={<ShavuotPrices />}></Route>
							<Route exact path='/FirstClassPrices' element={<FirstClassPrices />}></Route>
							<Route exact path='/BarMisvaPrices' element={<BarMisvaPrices />}></Route>
							<Route exact path='/TadmitPrices' element={<TadmitPrices />}></Route>
						</Routes>
					</Container>
				</main>
				<Footer />
			</Router>
		</>
	)
}

export default App
