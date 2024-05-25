import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/signup" element={<SignUp></SignUp>} />
            <Route path="/login" element={<Login></Login>} />
            <Route path="/*" element={<h1>404 error</h1>} />
            {/* This needs to be the very last route in this list, because it's the catch all. */}
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
