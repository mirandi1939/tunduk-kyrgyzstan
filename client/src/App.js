import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Homepage from "./pages/Homepage/Homepage";
import ItinerariesPage from "./pages/ItinerariesPage/ItinerariesPage";
import ItineraryDetailPage from "./pages/ItineraryDetailPage/ItineraryDetailPage";
import OperatorsPage from "./pages/OperatorsPage/OperatorsPage";
import OperatorDetailPage from "./pages/OperatorDetailPage/OperatorDetailPage";
import GuesthousesPage from "./pages/GuesthousesPage/GuesthousesPage";
import ForumPage from "./pages/ForumPage/ForumPage";
import EmergencyPage from "./pages/EmergencyPage/EmergencyPage";
import WomensCornerPage from "./pages/WomensCornerPage/WomensCornerPage";
import FoodPage from "./pages/FoodPage/FoodPage";
import HikingMapPage from "./pages/HikingMapPage/HikingMapPage";
import AdminLoginPage from "./pages/Admin/LoginPage/LoginPage";
import AdminPlacesListPage from "./pages/Admin/AdminPlacesPage/AdminPlacesPage";
import AdminPlaceEditPage from "./pages/Admin/PlaceEditPage/PlaceEditPage";
import AddPlacePage from "./pages/Admin/AddPlacePage/AddPlacePage";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/itineraries" element={<ItinerariesPage />} />
                <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
                <Route path="/operators" element={<OperatorsPage />} />
                <Route path="/operators/:id" element={<OperatorDetailPage />} />
                <Route path="/guesthouses" element={<GuesthousesPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/women" element={<WomensCornerPage />} />
                <Route path="/food" element={<FoodPage />} />
                <Route path="/hiking" element={<HikingMapPage />} />
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/places" element={<AdminPlacesListPage />} />
                <Route path="/admin/places/new" element={<AddPlacePage />} />
                <Route path="/admin/places/:googlePlaceId" element={<AdminPlaceEditPage />} />
            </Route>
        </Routes>
    );
}

export default App;
