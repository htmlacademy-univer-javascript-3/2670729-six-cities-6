import { Link } from 'react-router-dom';
import type { User } from '../../mocks/user';

type HeaderProps = {
  user?: User;
  isPageLogin: boolean;
  logOutClick?: React.MouseEventHandler;
};

const Header: React.FC<HeaderProps> = ({ user, isPageLogin, logOutClick }) => (
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
            {user ? (
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link
                    to="/favorites"
                    className="header__nav-link header__nav-link--profile"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">
                      {user.email}
                    </span>
                    <span className="header__favorite-count">
                      {user.favoriteCount}
                    </span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link
                    to="/"
                    onClick={logOutClick}
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

export default Header;
