import { Routes, Route } from 'react-router-dom';
import Builder from './pages/Builder';
import PublicForm from './pages/PublicForm';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Builder />} />
      <Route path="/f/:token" element={<PublicForm />} />
    </Routes>
  );
}

export default App;
