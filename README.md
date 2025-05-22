# Buy-Sell @ IIITH

##  Tech Stack
- **Frontend:** React.js (Tailwind CSS,Antd for styling)
- **Backend:** Express.js
- **Database:** MongoDB
- **Server Runtime:** Node.js
- **Authentication:** JWT (jsonwebtoken) & bcrypt.js for password hashing

---

##  Features
### **Authentication & User Management**
- User Registration (**Only IIIT email allowed**)
- Secure login with JWT authentication
- Users remain logged in unless they log out
- Password hashing using **bcrypt.js**
- If the user-mail in login is invalid redirecting to Register Page
- Redirecting to Profile Page if the login credentials are valid
- Password Must have more than 1 charecter

### **Profile Page**
- User can edit his basic details like Name,Age,phone number
- Change Password Option also

###  **Item Management**
- Users should add items to sell in the website under different **categories** 
- Buyers can search and filter items
- Each Item has unique page and Item details page has seller information and details of that of that product
- Add-to-cart option to add item to user Cart
- An item can be added to cart only once (if we revist same itempage again remove from cart will be showed)
- User can't add his own items to cart 


###  **Orders & Transactions**
- Users can track **bought and sold items**
- Users can also see **pending and cancelled orders**
- OTP must has to be remembered to close the Tarnsaction
- Sellers see a **"Deliver Items"** page with **OTP-based order confirmation**


###  **Shopping Cart**
- Items can be added or removed from the cart
- Displays total cost
- **Final Order button** for checkout
- Displays OTP after placing succesful order.
- Successful orders reflect in the **Deliver Items** and **Orders History** pages

###  **Chatbot Support**
- AI chatbot (Gemini-pro) for answering user queries
- Chat UI with **session-based** responses

---

## Installation Guide
###  **Download the Zip**
```sh
   Download the Zip file and Extract it.
```
### **Front-End **

```sh
    cd Frontend (Navigate to Frontend Folder)

    npm install

    npm run dev
```

### **Back-End **

```sh
    cd Backend (Navigate to Backend Folder)

    npm install

    npm start
```

## Complete Installation Guide

### **Front-End Setup**

```sh 
   npx create-vite@latest

   npm install axios buffer react react-dom react-google-recaptcha react-markdown react-router-dom antd -D tailwindcss redux moment 

   npx tailwindcss init -p

   configure tailwind.config.js

   /** @type {import('tailwindcss').Config} */
    export default {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
            extend: {},
        },
        plugins: [],
    }

    npm run dev

```

### **Back-End Setup**

```sh
   npm init -y

   npm install @google/generative-ai axios bcrypt bcryptjs bottleneck cookie-parser cors 

   npm i dotenv express jsonwebtoken mongoose
   
   install nodemon globally 

   npm run start

```   