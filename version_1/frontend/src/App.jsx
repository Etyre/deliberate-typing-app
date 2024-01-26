import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/*" element={<h1>404 error</h1>} />
        {/* This needs to be the very last route in this list, because it's the catch all. */}
        </Routes>
    </BrowserRouter>
       
    </>
  )
}

export default App
