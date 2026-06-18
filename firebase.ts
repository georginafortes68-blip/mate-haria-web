import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Gallery from './pages/Gallery';
import BreakfastBuilder from './pages/BreakfastBuilder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="desayuno" element={<BreakfastBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
