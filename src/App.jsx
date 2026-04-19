import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import Rules from "@/pages/Rules";
import Game from "@/pages/Game";

function NotFound() {
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
