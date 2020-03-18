/**
 * Create React App entry point. This and `public/index.html` files can not be
 * changed or moved.
 */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import store, { persistor } from "./app/store/store";
import App from "./App";

import "./index.scss"; // Standard version
// import "./sass/style.react.rtl.css"; // RTL version
import "socicon/css/socicon.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./_metronic/_assets/plugins/line-awesome/css/line-awesome.css";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { getUser } from './app/store/app_services/user/userApi';
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/* const mock = */
//  mockAxios(axios);

/**
 * Inject metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
// setupAxios(axios, store);

const Layout = React.lazy(() => import("./_metronic/layout/Layout.js"));
localStorage.setItem("jwtToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc19hY3RpdmUiOjEsImlzX2RlbGV0ZWQiOjAsInN1YiI6NDQ4LCJpc3MiOiJodHRwczovL2JldGEuY2FsbGJ1cm4uY29tL2F1dGgvbG9naW4iLCJpYXQiOjE1ODM4MTMzMTIsImV4cCI6MTU4NTAyMjkxMiwibmJmIjoxNTgzODEzMzEyLCJqdGkiOiJ5U2pOdFlWODVwWEhFakc0In0.jkRTkEeTy2w0I8XHfjgj9RPk-qzkEoHK6P1eP1V9l8w");

async function getUserFun() {
  var userDataResult = getUser();
  try {
    await userDataResult.then((data) => {
      if (data.resource.error.no === 0) {
        ReactDOM.render(
          <App
            store={store}
            Layout={Layout}
            persistor={persistor}
            basename="myaccount"
          />,
          document.getElementById("root")
        );
      }
      else {
        window.location.href = "/login";
      }
    })
  } catch (error) {
    window.location.href = "/login";
  }

};
if (localStorage.getItem("jwtToken")) {
  getUserFun();
} else {
  window.location.href = "/login";
}

