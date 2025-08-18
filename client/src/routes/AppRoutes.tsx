import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import BookDetail from '../pages/BookDetail';
import Search from '../pages/Search';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/book/:id" element={<BookDetail />} />
    </Routes>
  );
};

export default AppRoutes;