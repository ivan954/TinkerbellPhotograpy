import { lazy, Suspense, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import NotFound from "./screens/NotFound";

const GalleryScreen = lazy(() => import("./screens/GalleryScreen"));
const ContactScreen = lazy(() => import("./screens/ContactScreen"));
const ImagesScreen = lazy(() => import("./screens/ImagesScreen"));
const PregnancyPrices = lazy(() =>
  import("./screens/pricesScreens/PregnancyPrices")
);
const NewBornPrices = lazy(() =>
  import("./screens/pricesScreens/NewBornPrices")
);
const OneYearPrices = lazy(() =>
  import("./screens/pricesScreens/OneYearPrices")
);
const HalakePrices = lazy(() => import("./screens/pricesScreens/HalakePrices"));
const ChildrenPrices = lazy(() =>
  import("./screens/pricesScreens/ChildrenPrices")
);
const FamilyPrices = lazy(() => import("./screens/pricesScreens/FamilyPrices"));
const PurimPrices = lazy(() => import("./screens/pricesScreens/PurimPrices"));
const ShavuotPrices = lazy(() =>
  import("./screens/pricesScreens/ShavuotPrices")
);
const FirstClassPrices = lazy(() =>
  import("./screens/pricesScreens/FirstClassPrices")
);
const TadmitPrices = lazy(() => import("./screens/pricesScreens/TadmitPrices"));

// Start every page at the top, like a normal page load.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // "instant" so the page doesn't visibly scroll up past the old content.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <Header />
        <main>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/gallery" element={<GalleryScreen />} />
              <Route path="/contact" element={<ContactScreen />} />
              <Route path="/imagescreen/:name" element={<ImagesScreen />} />
              <Route path="/PregnancyPrices" element={<PregnancyPrices />} />
              <Route path="/NewBornPrices" element={<NewBornPrices />} />
              <Route path="/OneYearPrices" element={<OneYearPrices />} />
              <Route path="/HalakePrices" element={<HalakePrices />} />
              <Route path="/ChildrenPrices" element={<ChildrenPrices />} />
              <Route path="/FamilyPrices" element={<FamilyPrices />} />
              <Route path="/PurimPrices" element={<PurimPrices />} />
              <Route path="/ShavuotPrices" element={<ShavuotPrices />} />
              <Route path="/FirstClassPrices" element={<FirstClassPrices />} />
              <Route path="/TadmitPrices" element={<TadmitPrices />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
