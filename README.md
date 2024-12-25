# **Imagify - AI-Powered Image Generation Platform**

## **Overview**
Imagify is a full-stack web application that empowers users to generate AI-driven images based on their textual prompts. Designed with scalability, security, and user-friendliness in mind, Imagify provides a seamless experience with features like a credit-based system, multiple subscription plans, and an elegant user interface.

---

## **Key Features**
- **AI-Driven Image Generation:** Powered by the Clipdrop API, users can generate high-quality images by simply providing descriptive prompts.
- **Credit-Based System:** Users receive a set number of credits based on their subscription plan (Basic, Advanced, Premium). Each credit corresponds to one image generation.
- **Subscription Plans:** Flexible plans allow users to purchase additional credits with a Stripe-integrated payment system (test mode).
- **User Management:** Includes login, registration, and logout functionality, with user data securely stored in MongoDB.
- **Transaction Logging:** All transactions, including subscription purchases, are stored and displayed in the user dashboard.
- **Responsive UI:** A modern and sleek interface that is fully responsive across all devices.
- **Downloadable Images:** Users can download their generated images directly from the platform.

---

## **Technologies Used**

### **Backend**
- **Node.js** with **Express.js**: RESTful API for server-side operations.
- **MongoDB**: Database for user profiles, transactions, and image metadata.
- **Clipdrop API**: AI service for generating images.
- **Stripe API**: Payment processing in test mode.
- **JWT Authentication**: Secure user sessions.

### **Frontend**
- **React.js**: For building dynamic, responsive user interfaces.
- **Redux**: Manages application state efficiently.
- **Tailwind CSS**: Provides a modern design aesthetic.

## **How It Works**
1. **Sign Up/Login**: Create an account or log in with your credentials.
2. **Select Plan**: Choose from Basic, Advanced, or Premium subscription plans to receive credits.
3. **Generate Images**: Enter a prompt and generate AI-driven images. Each generation deducts one credit.
4. **Manage Account**: View credit balance, transaction history, and previously generated images in the dashboard.
5. **Download Images**: Save generated images directly to your device.

---

## **Installation**

### **Backend**
1. Clone the repository:
   ```bash
   git clone https://github.com/Rishika-108/Imagify.git
   cd Imagify/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`.env` file):
   - `MONGO_URI`: MongoDB connection string.
   - `JWT_SECRET`: Secret for token signing.
   - `STRIPE_SECRET_KEY`: Stripe API key (test mode).
   - `CLIPDROP_API_KEY`: API key for Clipdrop.
4. Start the server:
   ```bash
   npm start
   ```

### **Frontend**
1. Navigate to the frontend directory:
   ```bash
   cd Imagify/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`.env` file):
   - `REACT_APP_API_URL`: URL of the backend server.
4. Start the application:
   ```bash
   npm start
   ```

---

## **Deployment**
- **Frontend:** Hosted on Render
- **Backend:** Deployed on Render with secure environment variable management.
- **Database:** MongoDB Atlas for scalability and reliability.

---

## **Contributions**
Contributions are welcome! Feel free to fork the repository and submit pull requests.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
