import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../components/pages/LoginPage';
import RegisterPage from '../components/pages/RegisterPage'; // Importar RegisterPage

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Aquí después irán más rutas */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
