import {showAlert} from './alerts';
// console.log('hello from parcel');

export const login = async (email, password) => {
  // console.log('hiiiiiiiiiiiiiiiiii from login');
  
  try {
    const response = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //credentials:'include',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      showAlert('success',"Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 10);
    }else {
      // Server responded with an error
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    showAlert('error',"Error: " + err.message);
  }
};

export const logout = async () => {
  // console.log('hiiiiiiiiiiiiiiiiii from logout');
  
  try {
    const response = await fetch("/api/v1/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      //credentials:'include',
      
    });

    const data = await response.json();

    if (data.status === "success") location.assign('/');
    else {
      // Server responded with an error
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    showAlert('error','Error logging out! Try again');
  }
};
