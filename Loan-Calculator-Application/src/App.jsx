import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LoanProvider } from './context/LoanContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import ComparisonPage from './pages/ComparisonPage';
import AffordabilityPage from './pages/AffordabilityPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <LoanProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-surface-bg dark:bg-dark-bg">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/calculator" element={<CalculatorPage />} />
                  <Route path="/compare" element={<ComparisonPage />} />
                  <Route path="/affordability" element={<AffordabilityPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </LoanProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
