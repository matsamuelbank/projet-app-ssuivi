import './App.css';
import { SideBar } from './components/SideBar/SideBar';
import { Outlet } from "react-router-dom";

function App() {
  
  return (
    <div className="App">
      <div className="sideBar">
        <SideBar />
      </div>
      <div className="container">
        {/* Outlet permet de spécifier les sous routes de app qui seront le reste de tous les composants sauf login et inscription */}
        <Outlet />
      </div>
    </div>
  );
}

export default App;
