import AnnotationTool from "./pages/Annotation";
import Welcome from "./pages/Welcome";
import { BrowserRouter,Routes,Route } from "react-router-dom";
export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}></Route>
        {/* <Route path="/" element={<MyComponent/>}></Route> */}
        <Route path="/annotation" element={<AnnotationTool/>}></Route>
      </Routes>
    </BrowserRouter>
  )

}
