import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/styles.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;