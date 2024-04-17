import AnnotationTool from "./pages/Annotation";
import Welcome from "./pages/Welcome";
import SavePage from "./pages/SavePage";

import { BrowserRouter,Routes,Route } from "react-router-dom";
export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}></Route>
        <Route path="/annotation" element={<AnnotationTool/>}></Route>
        <Route path="/save" element={<SavePage/>}></Route>
      </Routes>
    </BrowserRouter>
  )

}
