import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";

class Index extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={App} />
          {/* {easter egg} */}
          <Route
            path="/LeoLifestyle"
            exact
            render={() => <App specificPath="LeoLifestyle" />}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

render(<Index />, document.getElementById("root"));
registerServiceWorker();
