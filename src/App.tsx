import Main from './pages/Main';
import Offer from './pages/Offer';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Stab404 from './pages/404';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import type { DataType } from './types';

import { Route, Routes, useLocation } from 'react-router-dom';

type AppProps = {
  data: DataType;
};

function App({ data }: AppProps) {
  const location = useLocation();

  const getPageModifiers = (pathname: string) => {
    const modifiers: string[] = [];

    if (pathname === '/') {
      modifiers.push('page--gray', 'page--main');
    } else if (pathname === '/login') {
      modifiers.push('page--gray', 'page--login');
    }

    return modifiers;
  };

  const pageModifiers = getPageModifiers(location.pathname);
  const pageClasses = ['page', ...pageModifiers].filter(Boolean).join(' ');

  const isPageLogin = location.pathname === '/login';

  return (
    <div className={pageClasses}>
      <Header isPageLogin={isPageLogin}/>
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
    </div>
  );
}

export default App;
