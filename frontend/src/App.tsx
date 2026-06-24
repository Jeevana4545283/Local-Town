import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { OwnerLayout } from './components/layout/OwnerLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { OwnerDashboardPage } from './pages/OwnerDashboardPage'
import { OwnerRentalsPage } from './pages/OwnerRentalsPage'
import { OwnerMarketplacePage } from './pages/OwnerMarketplacePage'
import { OwnerMarketplaceBookingsPage } from './pages/OwnerMarketplaceBookingsPage'
import { OwnerEventsPage } from './pages/OwnerEventsPage'
import { OwnerEventsBookingsPage } from './pages/OwnerEventsBookingsPage'
import { OwnerOffersPage } from './pages/OwnerOffersPage'
import { OwnerOffersBookingsPage } from './pages/OwnerOffersBookingsPage'
import { OwnerWorkersPage } from './pages/OwnerWorkersPage'
import { OwnerWorkersBookingsPage } from './pages/OwnerWorkersBookingsPage'
import { OwnerServicesPage } from './pages/OwnerServicesPage'
import { OwnerServicesBookingsPage } from './pages/OwnerServicesBookingsPage'
import { OwnerBookingsPage } from './pages/OwnerBookingsPage'
import { OwnerInboxPage } from './pages/OwnerInboxPage'
import { UserChatsPage } from './pages/UserChatsPage'
import { RentalsPage } from './pages/RentalsPage'
import { MapPage } from './pages/MapPage'
import { WorkersPage } from './pages/WorkersPage'
import { ServicesPage } from './pages/ServicesPage'
import { OffersPage } from './pages/OffersPage'
import { EventsPage } from './pages/EventsPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { MaterialsPage } from './pages/MaterialsPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { OwnerProfilePage } from './pages/OwnerProfilePage'

export default function App() {
  return (
    <Routes>
      {/* 
        Independent layout for Owner Dashboard (Left Sidebar, no top navbar) 
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<OwnerLayout />}>
          {/* Dashboards */}
          <Route path="/owner/rentals-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/services-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/workers-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/offers-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/events-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/marketplace-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />

          {/* CRUD and Bookings */}
          <Route path="/owner/rentals" element={<OwnerRentalsPage />} />
          <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
          
          <Route path="/owner/services" element={<OwnerServicesPage />} />
          <Route path="/owner/services-bookings" element={<OwnerServicesBookingsPage />} />
          
          <Route path="/owner/workers" element={<OwnerWorkersPage />} />
          <Route path="/owner/workers-bookings" element={<OwnerWorkersBookingsPage />} />
          
          <Route path="/owner/offers" element={<OwnerOffersPage />} />
          <Route path="/owner/offers-bookings" element={<OwnerOffersBookingsPage />} />
          
          <Route path="/owner/events" element={<OwnerEventsPage />} />
          <Route path="/owner/events-bookings" element={<OwnerEventsBookingsPage />} />
          
          <Route path="/owner/marketplace" element={<OwnerMarketplacePage />} />
          <Route path="/owner/marketplace-bookings" element={<OwnerMarketplaceBookingsPage />} />

          {/* Global Modules */}
          <Route path="/owner/inbox" element={<OwnerInboxPage />} />
          <Route path="/owner/profile" element={<OwnerProfilePage />} />
          <Route path="/owner/reviews" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Reviews</h1></div>} />
          <Route path="/owner/earnings" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Earnings</h1></div>} />
          <Route path="/owner/settings" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Settings</h1></div>} />
        </Route>
      </Route>

      {/* Independent Full-Screen Layouts */}
      <Route path="/rentals" element={<RentalsPage />} />
      <Route path="/user/chats" element={<UserChatsPage />} />
      <Route path="/map" element={<MapPage />} />

      {/* Standard User App Layout with Top Navbar */}
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  )
}
