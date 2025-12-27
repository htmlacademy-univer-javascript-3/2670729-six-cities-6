import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { getAuthorizationStatus } from '../../store/selectors';

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  if (authorizationStatus === 'NO_AUTH') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;


