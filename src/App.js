import { lazy, Suspense, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import NotFound from "./screens/NotFound";
import { useCategories } from "./data/categories";

const GalleryScreen = lazy(() => import("./screens/GalleryScreen"));
const AboutScreen = lazy(() => import("./screens/AboutScreen"));
const FaqScreen = lazy(() => import("./screens/FaqScreen"));
const ContactScreen = lazy(() => import("./screens/ContactScreen"));
const ImagesScreen = lazy(() => import("./screens/ImagesScreen"));
const PricePackage = lazy(() => import("./components/PricePackage"));
const AdminScreen = lazy(() => import("./admin/AdminScreen"));

// Start every page at the top, like a normal page load.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // "instant" so the page doesn't visibly scroll up past the old content.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const SiteLayout = () => (
  <>
    <Header />
    <main>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </>
);

function App() {
  const categories = useCategories();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<Loader />}>
              <AdminScreen />
            </Suspense>
          }
        />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/gallery" element={<GalleryScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/faq" element={<FaqScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/imagescreen/:name" element={<ImagesScreen />} />
          {/* One price page per category, at the path set in its content. */}
          {categories.map((category) => (
            <Route
              key={category.key}
              path={category.pricesPath}
              element={<PricePackage category={category} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
