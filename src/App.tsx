import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './routes/Routes';

const App = () => {
    return (
        <BrowserRouter>
            <RoutesComponent />
        </BrowserRouter>
    );
};

export default App;
