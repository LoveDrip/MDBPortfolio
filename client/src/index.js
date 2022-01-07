import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./index.css";
import 'react-notifications/lib/notifications.css';
import App from "./App";

import registerServiceWorker from './registerServiceWorker';
// const element = <h1>Hello, world</h1>;
// ReactDOM.render(element, document.getElementById('root'));
ReactDOM.render( <App /> , document.getElementById('root'));

registerServiceWorker();