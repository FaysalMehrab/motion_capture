# Real-Time Pose Detection Web App

# Live-model: https://motion-capture-system01.onrender.com/
A real-time human pose detection web application using [TensorFlow.js](https://www.tensorflow.org/js) and MoveNet. Detects and visualizes body keypoints from your webcam directly in the browser.

## Features

- Real-time pose detection using MoveNet (Lightning & Thunder)
- Adjustable keypoint and skeleton visualization
- Live FPS and processing time display
- Easy model switching and confidence threshold adjustment
- Clean, responsive UI

## Demo

![Demo Screenshot](demo-screenshot.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/js-ai-body-tracker.git
   cd js-ai-body-tracker
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the server:**
   ```sh
   npm start
   ```

4. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Allow camera access when prompted

## Deployment

This app is ready for deployment on [Render](https://render.com/) or any Node.js-compatible hosting.  
The included `server.js` serves static files from the `public` directory.

## Project Structure

```
.
├── public/
│   ├── index.html
│   └── js/
│       ├── app.js
│       └── tracker.js
├── server.js
├── package.json
└── README.md
```

## License

MIT License  
Copyright © 2022 Marcin "szczyglis" Szczyglinski

---

**Note:**  
All code and assets are for educational and demonstration
