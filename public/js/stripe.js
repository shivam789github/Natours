import { showAlert } from "./alerts";
import {loadStripe} from '@stripe/stripe-js';
import Stripe from "stripe";



export const bookTour = async (tourId) => {
  try {
    const url = `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`;
    //1)Get checkout session from api
    const session = await fetch(url, {
      method: "GET",
    });
    const response=await session.json();
    console.log("session:", response);
    
    const stripe = await loadStripe(
      "pk_test_51OacP8SHX7lSA75f5EQxspjiWBj5CfyXXAh8uhgAw6SW3WPwCig0nvMOxhjr5jKhRZc2yjXrYspsuC6jyeLCqpPo00qhLPXDUY"
    );
    
    //2)Create checkout from + change credit card
    stripe.redirectToCheckout({
      sessionId:response.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error',err);
  }
};
