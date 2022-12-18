import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import GalleryScreen from "./screens/GalleryScreen";
import ContactScreen from "./screens/ContactScreen";
import ImagesScreen from "./screens/ImagesScreen";
import PregnancyPrices from "./screens/pricesScreens/PregnancyPrices";
import NewBornPrices from "./screens/pricesScreens/NewBornPrices";
import OneYearPrices from "./screens/pricesScreens/OneYearPrices";
import HalakePrices from "./screens/pricesScreens/HalakePrices";
import ChildrenPrices from "./screens/pricesScreens/ChildrenPrices";
import FamilyPrices from "./screens/pricesScreens/FamilyPrices";
import PurimPrices from "./screens/pricesScreens/PurimPrices";
import ShavuotPrices from "./screens/pricesScreens/ShavuotPrices";
import FirstClassPrices from "./screens/pricesScreens/FirstClassPrices";
import TadmitPrices from "./screens/pricesScreens/TadmitPrices";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="py-3">
          <div>
            <Routes>
              <Route exact path="/" element={<HomeScreen />}></Route>
              <Route exact path="/gallery" element={<GalleryScreen />}></Route>
              <Route exact path="/contact" element={<ContactScreen />}></Route>
              <Route
                exact
                path="/imagescreen/:name"
                element={<ImagesScreen />}
              ></Route>
              <Route
                exact
                path="/PregnancyPrices"
                element={<PregnancyPrices />}
              ></Route>
              <Route
                exact
                path="/NewBornPrices"
                element={<NewBornPrices />}
              ></Route>
              <Route
                exact
                path="/OneYearPrices"
                element={<OneYearPrices />}
              ></Route>
              <Route
                exact
                path="/HalakePrices"
                element={<HalakePrices />}
              ></Route>
              <Route
                exact
                path="/ChildrenPrices"
                element={<ChildrenPrices />}
              ></Route>
              <Route
                exact
                path="/FamilyPrices"
                element={<FamilyPrices />}
              ></Route>
              <Route
                exact
                path="/PurimPrices"
                element={<PurimPrices />}
              ></Route>
              <Route
                exact
                path="/ShavuotPrices"
                element={<ShavuotPrices />}
              ></Route>
              <Route
                exact
                path="/FirstClassPrices"
                element={<FirstClassPrices />}
              ></Route>
              <Route
                exact
                path="/TadmitPrices"
                element={<TadmitPrices />}
              ></Route>
            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
