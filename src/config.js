export default {
  
  // apiBaseURL: "http://localhost:3000",
  apiBaseURL: "http://100.26.214.101:3000",
  remote: "https://flatlogic-node-backend.herokuapp.com",
  isBackend: process.env.REACT_APP_BACKEND,
  language:'en',
  defaultAuthToken:'@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#KULAN',
  key: 'pvmkzdhgskwofksdalfjdqapfhtyabnvkghtofgdhapbvmghgahfhbuntydjsdflafdhflaflhpifnxoamc',
  emailRegex:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordRegex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,18})/,
  contentType:'application/json',
  auth: {
    email: "admin@flatlogic.com",
    password: "password"
  }
};
