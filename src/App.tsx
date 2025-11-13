import CheckoutPage from "./pages/Checkout/CheckoutPage"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuccessPage from "./pages/Success/SuccessPage";
import Layout from "./components/Layout/Layout";

function App() {

  return (
    <main >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success/:userId" element={<SuccessPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/checkout" replace />} />
          <Route path="*" element={<Navigate to="/checkout" replace />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
