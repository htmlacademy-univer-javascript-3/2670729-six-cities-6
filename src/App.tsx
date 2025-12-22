import { useMemo } from 'react';
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
  data?: DataType;
};

function App({ data }: AppProps = {}) {
  const location = useLocation();

  const pageModifiers = useMemo(() => {
    const modifiers: string[] = [];
    if (location.pathname === '/') {
      modifiers.push('page--gray', 'page--main');
    } else if (location.pathname === '/login') {
      modifiers.push('page--gray', 'page--login');
    } else if (location.pathname === '/favorites') {
      if (data?.user?.favoriteCount === 0){
        modifiers.push('page--favorites-empty');
      }
    }
    return modifiers;
  }, [location.pathname, data?.user?.favoriteCount]);

  const pageClasses = useMemo(
    () => ['page', ...pageModifiers].filter(Boolean).join(' '),
    [pageModifiers]
  );

  const isPageLogin = useMemo(() => location.pathname === '/login', [location.pathname]);

  return (
    <div className={pageClasses}>

      <Header isPageLogin={isPageLogin} />
      <Routes>
        <Route
          path="/"
          element={<Main cities={data?.cities || []} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
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
