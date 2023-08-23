import { useEffect } from 'react';
import './App.css';
import { requestPermission } from './firebase';
import ChatBox from './components/ChatBox';

function App() {

  useEffect(() => {
     requestPermission();
  },[])

  return (
    <div className="App">
     <ChatBox />
    </div>
  );
}

export default App;
