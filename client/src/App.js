import "./App.css";
import React, {useState} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Book from "./components/Book";
import Calendar from "./components/Timetable";
import Home from "./components/Home";


function App() {
  const [navIcon, setNavIcon] = useState({icon: 'home'});
  return (
    <React.Fragment>
      <BrowserRouter>
        <Nav navIcon={navIcon}/>
        <Switch>
          <Route exact path='/' render={()=> <Home setNavIcon={setNavIcon}/>} />
          <Route exact path='/Book' render={()=> <Book setNavIcon={setNavIcon} />} />
          <Route exact path='/Timetable' render={()=> <Calendar setNavIcon={setNavIcon} />} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
