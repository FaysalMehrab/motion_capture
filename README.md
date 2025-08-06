# Real-Time Pose Estimation with TensorFlow.js

<p align="center">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img alt="TensorFlow" src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge"/>
</p>

<p align="center">
  A high-performance web application that performs real-time human pose detection directly in the browser. This project uses TensorFlow.js and the powerful MoveNet model to detect and visualize 17 key body points from a live webcam feed.
</p>

<p align="center">
  <a href="https://motion-capture-with-tensorflow-js-and.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-WebApp-brightgreen?style=for-the-badge&logo=google-chrome" />
  </a>
</p>

<p align="center">
  <!-- Replace with a GIF of your application in action! -->
  <img src="demo-screenshot.png" alt="Application Demo" width="100%"/>
</p>

---

## ✨ Key Features

-   **⚡ Blazing-Fast Real-Time Detection:** Leverages GPU acceleration via TensorFlow.js to run the MoveNet model smoothly in the browser.
-   **🤖 Two Powerful Model Options:** Instantly switch between:
    -   **MoveNet Lightning:** Optimized for maximum speed and lower-latency applications.
    -   **MoveNet Thunder:** Optimized for higher accuracy and more robust detection.
-   **🎨 Customizable Visualization:** Dynamically adjust the confidence threshold for keypoints and toggle the visibility of the skeleton overlay.
-   **📊 Performance Monitoring:** Includes a live stats panel to display Frames Per Second (FPS) and model processing time.
-   **📱 Clean & Responsive UI:** A simple and intuitive interface that works seamlessly on any device with a webcam.

---

## 🛠️ Technology Stack

-   **Core Logic:** **TensorFlow.js**
-   **Pose Detection Model:** **MoveNet (Single-Pose)**
-   **Backend & Server:** **Node.js**, **Express.js**
-   **Frontend:** **HTML5**, **CSS3**, **JavaScript**

---

## 🚀 Quick Start Guide

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher is recommended)
-   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/FaysalMehrab/motion_capture_with_TensorFlow.js_and_MoveNet.git
    cd motion_capture_with_TensorFlow.js_and_MoveNet
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Run the Development Server**
    ```sh
    npm start
    ```

4.  **Open in Browser**
    -   Navigate to **[http://localhost:3000](http://localhost:3000)**.
    -   **Allow camera access** when prompted by the browser.

---

## 🔬 How It Works

-   `server.js`: A minimal Express.js server responsible for serving the static files from the `public` directory.
-   `public/index.html`: The main HTML structure of the application.
-   `public/js/tracker.js`: The core of the application. It handles loading the TensorFlow.js MoveNet model, accessing the webcam feed, running the detection on each frame, and drawing the keypoints and skeleton on the canvas.
-   `public/js/app.js`: Manages the UI elements, user controls (like model switching and threshold adjustment), and the stats panel.

---

## ☁️ Deployment

This application is built as a static site with a simple Node.js server, making it easy to deploy on various platforms.

-   **Render:** Ready to deploy out-of-the-box. Set the start command to `npm start`.
-   **Vercel/Netlify:** Can be deployed as a static site. The `server.js` is only needed for local development.
-   **Heroku:** Can be deployed as a standard Node.js application.

---

## 📄 License

This project is licensed under the MIT License.
Copyright (c) 2024 Faysal Mehrab Chowdhury
