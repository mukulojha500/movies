import './App.css';
import { BrowserRouter } from 'react-router-dom'
import Moives from './Components/Moives';

function App() {
  return (
    <BrowserRouter>
      <Moives apiKey={process.env.REACT_APP_MOVIES_API}/>
    </BrowserRouter>
  );
}

export default App;
