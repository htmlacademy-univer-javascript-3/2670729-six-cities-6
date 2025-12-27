import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { getUser, getAuthorizationStatus, getFavoriteCount } from '../../store/selectors';
import { logoutAction } from '../../store/actions';

type HeaderProps = {
  isPageLogin: boolean;
};

const Header: React.FC<HeaderProps> = memo(({ isPageLogin }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const favoriteCount = useAppSelector(getFavoriteCount);
  const isAuthorized = authorizationStatus === 'AUTH';

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link to="/" className="header__logo-link header__logo-link--active">
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          {!isPageLogin && (
            <nav className="header__nav">
              {isAuthorized && user ? (
                <ul className="header__nav-list">
                  <li className="header__nav-item user">
                    <Link
                      to="/favorites"
                      className="header__nav-link header__nav-link--profile"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                        <img
                          className="header__avatar user__avatar"
                          src={user.avatarUrl}
                          alt={user.name}
                          width="20"
                          height="20"
                        />
                      </div>
                      <span className="header__user-name user__name">
                        {user.email}
                      </span>
                      {favoriteCount > 0 && (
                        <span className="header__favorite-count">{favoriteCount}</span>
                      )}
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="header__nav-link"
                    >
                      <span className="header__signout">Sign out</span>
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="header__nav-list">
                  <li className="header__nav-item user">
                    <Link
                      to="/login"
                      className="header__nav-link header__nav-link--profile"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
