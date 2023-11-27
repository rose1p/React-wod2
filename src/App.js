import { Container } from 'react-bootstrap';
import './App.css';
import HeaderPage from './components/HeaderPage';
import FooterPage from './components/FooterPage';
import NaviPage from './components/NaviPage';

function App() {
    return (
        <Container>
            <HeaderPage/>
            <NaviPage/>
            <FooterPage/>
        </Container>
    );
}

export default App;
