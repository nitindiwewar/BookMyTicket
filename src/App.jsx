import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Theaters from './pages/Theaters'
import Offers from './pages/Offers'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/seats" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
