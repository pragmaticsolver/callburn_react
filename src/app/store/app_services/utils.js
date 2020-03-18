import axios from 'axios';
export const wrapRequest = func => {
  return async (...args) => {
    const res = await func(...args);
    if (
      res &&
      res.status &&
      res.status !== 200 &&
      res.status !== 201 &&
      res.status !== 204
    ) {
      throw res;
    } else {
      return res.data;
    }
  };
};

export const xapi = () => {
  localStorage.setItem("jwtToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc19hY3RpdmUiOjEsImlzX2RlbGV0ZWQiOjAsInN1YiI6NDQ4LCJpc3MiOiJodHRwczovL2JldGEuY2FsbGJ1cm4uY29tL2F1dGgvbG9naW4iLCJpYXQiOjE1ODM4MTMzMTIsImV4cCI6MTU4NTAyMjkxMiwibmJmIjoxNTgzODEzMzEyLCJqdGkiOiJ5U2pOdFlWODVwWEhFakc0In0.jkRTkEeTy2w0I8XHfjgj9RPk-qzkEoHK6P1eP1V9l8w");
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    charset: 'UTF-8',
    JWTAuthorization: "Bearer " + localStorage.getItem("jwtToken")
  };
  var token = localStorage.getItem("jwtToken");
  if (token) {
    headers = {
      ...headers,
      JWTAuthorization: "Bearer " + token
    };
  }
  let xapi = axios.create({
    baseURL: "https://beta.callburn.com",
    headers: headers
  });

  // Check expired token
  xapi.interceptors.response.use(undefined, function (err) {
    if (err.response && err.response.status === 401) {
      //   store.dispatch(logout());
    }

    if (typeof err.response === 'undefined') {
      throw err;
    }

    if (err.response && err.response.status !== 200) {
      throw err.response;
    }
  });

  return xapi;
};
export const getBase64 = file => {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
