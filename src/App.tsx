import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "./screens/index";
import Movie from "./screens/movie";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/movie" element={<Movie />} />
      </Routes>
    </Router>
  );
}

export default App;
