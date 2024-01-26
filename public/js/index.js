//import '@babel/polyfill';
import "core-js/stable";
import { displayMap } from "./leaflet";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import {bookTour} from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".login-form");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-settings");
const bookBtn=document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log("hi");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form=new FormData();
    form.append('name',document.getElementById("name").value);
    form.append('email',document.getElementById("email").value);
    form.append('photo',document.getElementById("photo").files[0]);
    // console.log(form);
    // console.log(form.get('name'));
    // console.log(form.get('email'));
    // console.log(form.get('photo'));
    
    // console.log("hello updating user data");
    updateSettings(form, "data");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent='Updating...'
    // console.log("updating user password using fetch api");
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    // console.log(password);
    await updateSettings({ passwordCurrent, password, passwordConfirm },"password");

    document.querySelector('.btn--save-password').textContent='Save password'
    document.getElementById("password-current").value="";
    document.getElementById("password").value="";
    document.getElementById("password-confirm").value="";
  });

  if(bookBtn)
    bookBtn.addEventListener('click',e=>{
    e.target.textContent='processing...'
    const {tourId}=e.target.dataset;
    // console.log(tourId);
    bookTour(tourId);
})