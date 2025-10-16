import Main from './pages/Main';
import Offer from './pages/Offer';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Stab404 from './pages/404';
import PrivateRoute from './components/PrivateRoute';
import type { DataType } from './types';

import { Route, Routes } from 'react-router-dom';

type AppProps = {
  data: DataType;
};

function App({ data }: AppProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={<Main quantity={data.quantity} cards={data.cards} />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute isAuthorized={false}>
            <Favorites />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<Offer />} />
      <Route path="*" element={<Stab404 />} />
    </Routes>
  );
}

export default App;
