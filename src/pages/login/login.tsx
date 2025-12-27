import { useState, FormEvent } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { getAuthorizationStatus } from '../../store/selectors';
import { loginAction } from '../../store/actions';

const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [randomCity] = useState(() => {
    const randomIndex = Math.floor(Math.random() * CITIES.length);
    return CITIES[randomIndex].toLowerCase();
  });

  // Если пользователь уже авторизован, перенаправляем на главную
  if (authorizationStatus === 'AUTH') {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);

    // Валидация пароля: должен содержать минимум одну букву и одну цифру
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    try {
      await dispatch(loginAction(email, password));
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 400) {
          setError(axiosError.response.data?.error || 'Invalid email or password');
        } else {
          setError('Failed to login. Please try again.');
        }
      } else {
        setError('Failed to login. Please try again.');
      }
    }
  };

  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>
          <form
            className="login__form form"
            action="#"
            method="post"
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
          >
            {error && (
              <div className="login__error" style={{ color: 'red', marginBottom: '10px' }}>
                {error}
              </div>
            )}
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden">E-mail</label>
              <input
                className="login__input form__input"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden">Password</label>
              <input
                className="login__input form__input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="login__submit form__submit button" type="submit">
              Sign in
            </button>
          </form>
        </section>
        <section className="locations locations--login locations--current">
          <div className="locations__item">
            <Link className="locations__item-link" to={`/?city=${randomCity}`}>
              <span>{CITIES.find((city) => city.toLowerCase() === randomCity) || 'Amsterdam'}</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
