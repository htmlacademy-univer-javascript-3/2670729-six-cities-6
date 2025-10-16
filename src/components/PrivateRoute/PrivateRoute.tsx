import { Navigate, useLocation } from 'react-router-dom';

type PrivateRouteProps = {
  isAuthorized: boolean;
  children: JSX.Element;
};

function PrivateRoute({ isAuthorized, children }: PrivateRouteProps) {
  const location = useLocation();

  if (!isAuthorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;


