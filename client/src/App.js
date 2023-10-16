import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         <code>Håkon er .....</code> hallo
        </p>
          <p>
              <code>Håkon er .....</code> hallo
          </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>UiA utleie</p>
      </header>
    </div>
  );
}

export default App;
