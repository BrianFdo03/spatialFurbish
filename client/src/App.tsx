import { BrowserRouter, Routes, Route } from "react-router-dom"
import RoomSelectionPage from "@/components/RoomSelectionPage"
import FloorPlanEditor from "@/components/FloorPlanEditor"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomSelectionPage />} />
        <Route path="/editor" element={<FloorPlanEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
