import { Link } from 'react-router-dom';

const Stub404 = () => (
  <main style={{ height: '100vh' }} className="page__main ">
    <div style={{ paddingTop: '40px', textAlign: 'center' }}>
      <h1>404 Not Found</h1>
      <span>
        Перейти на{' '}
        <Link to="/" style={{ textDecoration: 'underline' }}>
          главную страницу
        </Link>
      </span>
    </div>
  </main>
);

export default Stub404;
