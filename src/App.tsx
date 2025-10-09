import Main from './pages/Main';
// import Offer from './pages/Offer';
// import Login from './pages/Login';
// import Favorites from './pages/Favorites';
import type { DataType } from './types';

type AppProps = {
  data: DataType;
};

function App({ data }: AppProps) {
  return <Main quantity={data.quantity} cards={data.cards} />;
}

export default App;
