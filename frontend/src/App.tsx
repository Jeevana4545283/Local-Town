import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { RentalsPage } from './pages/RentalsPage'
import { WorkersPage } from './pages/WorkersPage'
import { OffersPage } from './pages/OffersPage'
import { EventsPage } from './pages/EventsPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { MaterialsPage } from './pages/MaterialsPage'
import { ServicesPage } from './pages/ServicesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

