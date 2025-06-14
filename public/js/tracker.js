// Copyright Marcin "szczyglis" Szczyglinski, 2022. All Rights Reserved.
// tracker.js - Pose detection logic

class PoseTracker {
    constructor() {
        this.detector = null;
        this.isDetecting = false;
        this.pointSize = 8;
        this.lineWidth = 6;
        this.minScore = 0.35;
        this.lastDetectionTime = 0;
        this.fps = 0;
        this.processingTime = 0;
        this.keypoints = [];
        this.videoElement = document.getElementById('webcam-video');
        this.canvasElement = document.getElementById('output-canvas');
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.keypointsOutput = document.getElementById('keypoints-output');
        this.statusIndicator = document.getElementById('status-indicator');
        this.statusText = document.getElementById('status-text');
    }

    async init() {
        try {
            // Set backend to WebGL for GPU acceleration
            await tf.setBackend('webgl');
            await tf.ready();
            
            this.statusText.textContent = 'Loading model...';
            
            // Create detector - using MoveNet SinglePose Lightning by default
            this.detector = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet,
                {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
                }
            );
            
            this.statusText.textContent = 'Model loaded. Ready to detect!';
            this.statusIndicator.style.background = '#2ed573';
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            this.statusText.textContent = 'Error loading model. See console for details.';
            this.statusIndicator.style.background = '#ff4757';
            return false;
        }
    }

    async setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: "user" 
                }, 
                audio: false 
            });
            this.videoElement.srcObject = stream;
            
            return new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.statusText.textContent = 'Camera access denied. Please allow camera permissions.';
            this.statusIndicator.style.background = '#ff4757';
            return Promise.reject(error);
        }
    }

    async startDetection() {
        if (!this.detector) {
            const success = await this.init();
            if (!success) return;
        }
        
        if (!this.isDetecting) {
            this.isDetecting = true;
            this.statusText.textContent = 'Detecting poses...';
            this.detectPoses();
        }
    }

    stopDetection() {
        this.isDetecting = false;
        this.statusText.textContent = 'Detection stopped.';
        this.statusIndicator.style.background = '#ff4757';
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.keypointsOutput.innerHTML = '<p>Detection stopped</p>';
    }

    async detectPoses() {
        if (!this.isDetecting) return;

        const startTime = performance.now();
        
        try {
            // Estimate poses
            const poses = await this.detector.estimatePoses(this.videoElement);
            
            // Calculate FPS
            const now = performance.now();
            this.processingTime = now - startTime;
            if (this.lastDetectionTime) {
                this.fps = Math.round(1000 / (now - this.lastDetectionTime));
            }
            this.lastDetectionTime = now;
            
            // Draw video frame to canvas
            this.canvasCtx.save();
            this.canvasCtx.scale(-1, 1);
            this.canvasCtx.translate(-this.canvasElement.width, 0);
            this.canvasCtx.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
            this.canvasCtx.restore();
            
            // Process poses
            if (poses && poses.length > 0) {
                const pose = poses[0];
                this.keypoints = pose.keypoints;
                
                // Draw keypoints and skeleton
                this.drawKeypoints(pose.keypoints);
                this.drawSkeleton(pose.keypoints);
                
                // Update keypoints display
                this.updateKeypointsDisplay(pose.keypoints);
            } else {
                this.keypointsOutput.innerHTML = '<p>No poses detected</p>';
            }
        } catch (error) {
            console.error('Error detecting poses:', error);
        }
        
        // Continue detection loop
        requestAnimationFrame(() => this.detectPoses());
    }

    drawKeypoints(keypoints) {
        for (const keypoint of keypoints) {
            if (keypoint.score >= this.minScore) {
                // Flip x coordinate because canvas is mirrored
                const x = this.canvasElement.width - keypoint.x;
                const y = keypoint.y;
                
                // Draw keypoint
                this.canvasCtx.beginPath();
                this.canvasCtx.arc(x, y, this.pointSize, 0, 2 * Math.PI);
                this.canvasCtx.fillStyle = '#ff4757';
                this.canvasCtx.fill();
                
                // Draw highlight
                this.canvasCtx.beginPath();
                this.canvasCtx.arc(x, y, this.pointSize / 2, 0, 2 * Math.PI);
                this.canvasCtx.fillStyle = '#ffffff';
                this.canvasCtx.fill();
            }
        }
    }

    drawSkeleton(keypoints) {
        this.canvasCtx.lineWidth = this.lineWidth;
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.strokeStyle = '#4db8ff';
        
        // Define connections between keypoints
        const connections = [
            // Face
            ['left_ear', 'left_eye'], ['left_eye', 'nose'], 
            ['nose', 'right_eye'], ['right_eye', 'right_ear'],
            
            // Torso
            ['left_shoulder', 'right_shoulder'], 
            ['left_shoulder', 'left_hip'], 
            ['right_shoulder', 'right_hip'],
            ['left_hip', 'right_hip'],
            
            // Left arm
            ['left_shoulder', 'left_elbow'], 
            ['left_elbow', 'left_wrist'],
            
            // Right arm
            ['right_shoulder', 'right_elbow'], 
            ['right_elbow', 'right_wrist'],
            
            // Left leg
            ['left_hip', 'left_knee'], 
            ['left_knee', 'left_ankle'],
            
            // Right leg
            ['right_hip', 'right_knee'], 
            ['right_knee', 'right_ankle'],
        ];
        
        for (const [start, end] of connections) {
            const startPoint = keypoints.find(kp => kp.name === start);
            const endPoint = keypoints.find(kp => kp.name === end);
            
            if (startPoint && endPoint && 
                startPoint.score >= this.minScore && 
                endPoint.score >= this.minScore) {
                
                // Flip x coordinates because canvas is mirrored
                const startX = this.canvasElement.width - startPoint.x;
                const startY = startPoint.y;
                const endX = this.canvasElement.width - endPoint.x;
                const endY = endPoint.y;
                
                this.canvasCtx.beginPath();
                this.canvasCtx.moveTo(startX, startY);
                this.canvasCtx.lineTo(endX, endY);
                this.canvasCtx.stroke();
            }
        }
    }

    updateKeypointsDisplay(keypoints) {
        let html = '';
        
        for (const keypoint of keypoints) {
            if (keypoint.score >= this.minScore) {
                const scoreColor = keypoint.score > 0.75 ? '#2ed573' : 
                                  keypoint.score > 0.5 ? '#ffa502' : '#ff4757';
                
                html += `
                    <div class="keypoint-card">
                        <div class="keypoint-name">${keypoint.name}</div>
                        <div class="keypoint-value">x: ${keypoint.x.toFixed(1)}</div>
                        <div class="keypoint-value">y: ${keypoint.y.toFixed(1)}</div>
                        <div class="keypoint-value" style="color: ${scoreColor}">
                            Score: ${keypoint.score.toFixed(2)}
                        </div>
                    </div>
                `;
            }
        }
        
        this.keypointsOutput.innerHTML = html || '<p>No keypoints detected</p>';
    }
}

// Create a global tracker instance
window.tracker = new PoseTracker();
