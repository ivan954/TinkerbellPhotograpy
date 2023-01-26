import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
              <Route  path="/" element={<HomeScreen />}></Route>
              <Route  path="/gallery" element={<GalleryScreen />}></Route>
              <Route  path="/contact" element={<ContactScreen />}></Route>
              <Route
                
                path="/imagescreen/:name"
                element={<ImagesScreen />}
              ></Route>
              <Route
                
                path="/PregnancyPrices"
                element={<PregnancyPrices />}
              ></Route>
              <Route
                
                path="/NewBornPrices"
                element={<NewBornPrices />}
              ></Route>
              <Route
                
                path="/OneYearPrices"
                element={<OneYearPrices />}
              ></Route>
              <Route
                
                path="/HalakePrices"
                element={<HalakePrices />}
              ></Route>
              <Route
                
                path="/ChildrenPrices"
                element={<ChildrenPrices />}
              ></Route>
              <Route
                
                path="/FamilyPrices"
                element={<FamilyPrices />}
              ></Route>
              <Route
                
                path="/PurimPrices"
                element={<PurimPrices />}
              ></Route>
              <Route
                
                path="/ShavuotPrices"
                element={<ShavuotPrices />}
              ></Route>
              <Route
                
                path="/FirstClassPrices"
                element={<FirstClassPrices />}
              ></Route>
              <Route
                
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
