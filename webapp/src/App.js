import React from "react";
//import logo from "./logo.svg";
import { BrowserRouter , Route, Switch } from "react-router-dom";
import "./App.css";
import LoginComponent from "./components/login";
import ParentViewComponent from "./components/parentviewlist";
import UpNavigation from "./components/upnavigationlist";
import CompanyBusListComponent from "./components/companybuslist";
import BusViewComponent from "./components/busviewlist";
import RegisterComponent from "./components/register";
import MapComponent from "./components/map"
import BusMapComponent from "./components/busmap"
//import MapComponent from "./components/denememap"
import { browserHistory } from "react-router";

function App() {
  return (
    <BrowserRouter >
      <Switch>
        <Route exact= {true} path="/" history={browserHistory} component={LoginComponent} />
        <Route path="/parentview" component={ParentView} />
        <Route path="/companyview"  history={browserHistory} component={CompanyBusListComponent} />
        <Route path="/busview"  history={browserHistory} component={BusViewComponent} />
        <Route path="/adminview" component={AdminView} />
        <Route path="/register" history={browserHistory} component={RegisterComponent} />
        <Route path = "/map" history={browserHistory} component={MapComponent} />
        <Route path = "/busmap" history={browserHistory} component={BusMapComponent} />
      </Switch>
    </BrowserRouter>
  );
}
// dummy
function AdminView() {
  return <LoginComponent history={browserHistory} />;
}
function ParentView() {
  return (
    <div>
      <UpNavigation history={browserHistory}/>
      <ParentViewComponent history={browserHistory} />
    </div>
  );
}

export default App;
