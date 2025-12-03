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
    } else if (pathname === '/favorites') {
      if (data.user?.favoriteCount === 0){
        modifiers.push('page--favorites-empty');
      }
    }

    return modifiers;
  };

  const pageModifiers = getPageModifiers(location.pathname);
  const pageClasses = ['page', ...pageModifiers].filter(Boolean).join(' ');

  const isPageLogin = location.pathname === '/login';

  return (
    <div className={pageClasses}>
      {/* Обработчик logOutClick в компоненте Header в дальнейшем будет изменен.
       Текущий используется для демонстрации работы переключения на страницу /login
       с помощью компонента Link */}
      <Header user={data.user} isPageLogin={isPageLogin} logOutClick={()=>(data.user = undefined)}/>
      <Routes>
        <Route
          path="/"
          element={<Main cities={data.cities} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized>
              <Favorites favorites={data.user?.favorites || []}/>
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<Offer isAuthorized/>} />
        <Route path="*" element={<Stab404 />} />
      </Routes>
    </div>
  );
}

export default App;
