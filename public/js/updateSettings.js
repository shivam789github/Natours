import { showAlert } from "./alerts";

//updateData
//type is either password or data
export const updateSettings = async (dat, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";
    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        //"content-type": `multipart/form-data; boundary=${form._boundary}`
        //'Access-Control-Allow-Origin': 'http://127.0.0.1:3000'
        //"Authorization":"Bearer jwt"
      },
      credentials:'include',
      body: dat
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
    }
    
    // console.log('fetching json');
    const data = await response.json();
    // console.log(data);
    if (data.status === "success") {
      showAlert("success", `${type} updated successfully`);
    } else {
      // Server responded with an error
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    showAlert("error", err.message);
  }
};
