import './App.css';
import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Nav from './components/Nav';
import Book from './components/Book';
import Timetable from './components/Timetable';
import Home from './components/Home';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Nav/>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/Book' component={Book} />
          <Route exact path="/Timetable" component={Timetable} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
