import React, { useState } from "react";
import styles from '../cssModules/LoginModal.module.css'
import { requestPermission } from "../firebase";

export default function LoginModal( props ) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogin = async () => {
    const inputElement = document.querySelector("#phoneNumber");
    const input = inputElement.value.toString().trim();
    if(input.length !== 10){

        window.alert("Please Enter Proper Mobile Number");
        return;
    }

    const response = await fetch( "https://chatappserver1.onrender.com/login" , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: input,
      })
    });

    if (response.ok) {
      localStorage.setItem('myPhoneNumber', input);
      if(localStorage.getItem('myPhoneNumber')) props.func(input);
      closeModal();
      requestPermission();
    } 
    else {
      console.error('Error:', response.statusText);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
        handleLogin();
    }
  }
  return (
    <div>
      <button onClick={openModal} className={styles.openModalBtn}>Login</button>

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.flex} onClick={closeModal}>
              &times;
            </span>
            <div className={styles.modalBody}>
                <strong className={styles.flex}>Login</strong>
                <input type="Number" id="phoneNumber" placeholder="Enter 10 digit Number" className={styles.inputNumber} onKeyDown={handleKeyPress}/>
                <button className={styles.loginBtn} onClick={handleLogin}>Enter Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
