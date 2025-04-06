# Tayusa
TAYUSA: A New Age Personalized Social EdTech Platform

### Overview
TAYUSA is an innovative platform that merges social networking, education, and content creation into a cohesive experience. It is designed to provide personalized, engaging, and tech-focused learning for individuals of all backgrounds. Combining the best features of platforms like YouTube, Twitter, LinkedIn, and Coursera, TAYUSA fosters a vibrant community for learning and collaboration.

---

### Features
- Personalized Tech Learning: AI-powered recommendations tailored to user preferences.  
- Social Interaction: Like, share, comment, and collaborate on tech-related posts and videos.  
- Content Creation: Upload and monetize tech content.  
- Integrated Hub: Seamless navigation between short videos, long-form content, and saved items.  
- Scalability: Deployed on a robust cloud infrastructure for high performance and reliability.  

---

### Technology Stack 

#### Front-End
- React.js  
- Material-UI / Bootstrap  
- Redux / Context API  

#### Back-End  
- Node.js  
- Express.js  
- MongoDB  

#### Machine Learning  
- Python (Scikit-learn, TensorFlow)  
- Flask / FastAPI for serving ML models  

#### Deployment & DevOps  
- Docker for containerization  
- AWS/GCP for cloud hosting and database management  
- GitHub Actions for CI/CD  

---

### Setup & Installation  

1. Clone the Repository  
   ```bash
   git clone https://github.com/your-username/tayusa.git
   cd tayusa
   ```

2. Install Dependencies  

   Back-End:  
   ```bash
   cd backend
   npm install
   ```

   Front-End:  
   ```bash
   cd frontend
   npm install
   ```

   Machine Learning API:  
   ```bash
   cd ml_api
   pip install -r requirements.txt
   ```

3. Environment Variables  
   - Create `.env` files in the respective directories and add the required keys:
     - Backend: Database URI, API keys, JWT secret.
     - ML API: Paths for model files and API keys.
     - Deployment: AWS/GCP credentials.

4. Run the Application Locally  

   Backend:  
   ```bash
   cd backend
   npm start
   ```

   Frontend:  
   ```bash
   cd frontend
   npm start
   ```

   ML API:  
   ```bash
   cd ml_api
   python app.py
   ```

5. Access the Application  
   Open your browser and navigate to:  
   ```  
   http://localhost:3000  
   ```

---

### Project Structure  
```
tayusa/
├── backend/               # Server-side logic and APIs
├── frontend/              # Client-side application
├── ml_api/                # Machine Learning models and APIs
├── docker/                # Docker configuration files
├── .github/               # GitHub Actions workflows
└── README.md              # Project documentation
```

---

### Contributing  
We welcome contributions to TAYUSA!  
1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature-name`).  
3. Commit your changes (`git commit -m "Add feature"`).  
4. Push to the branch (`git push origin feature-name`).  
5. Create a Pull Request.  

---

### License 
This project is licensed under the [MIT License](LICENSE).  

---

### Contact Us  
For any queries or support, reach out at:  
- Email: hemantabhoi16112003@gmail.com  
- GitHub Issues: [Report an Issue](https://github.com/your-username/tayusa/issues)  

Let’s build the future of tech learning together! 🚀  

--- 


tayusa/
├── backend/               
│   ├── controllers/        # Handles request logic
│   │   ├── authController.js       # Authentication-related logic
│   │   ├── userController.js       # User-related logic
│   │   ├── contentController.js    # Content-related logic
│   │   ├── reportController.js     # Handles reporting feature
│   │   └── commentController.js    # Handles comments and replies
│   ├── models/             # Defines data schemas
│   │   ├── User.js                 # User schema
│   │   ├── Video.js                # Video content schema
│   │   ├── ShortVideo.js           # Short video schema
│   │   ├── Article.js              # Article schema
│   │   ├── Comment.js              # Comment schema
│   │   ├── Report.js               # Report schema
│   │   └── index.js                # Database connection setup
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js           # Authentication routes
│   │   ├── userRoutes.js           # User-related routes
│   │   ├── contentRoutes.js        # Video, Short video, Article routes
│   │   ├── commentRoutes.js        # Comment routes
│   │   ├── reportRoutes.js         # Report content routes
│   │   └── index.js                # Consolidates all routes
│   ├── utils/              # Utility functions and middleware
│   │   ├── authMiddleware.js       # Protects routes
│   │   ├── errorHandler.js         # Handles errors globally
│   │   ├── validateInput.js        # Validates request inputs
│   │   └── logger.js               # Logger utility
│   ├── config/             # Configuration files
│   │   ├── db.js                   # Database connection logic
│   │   ├── env.js                  # Environment variable loader
│   │   ├── cloudStorage.js         # Cloud storage config (S3, Firebase, etc.)
│   │   └── secrets.js              # API keys and secrets management
│   ├── tests/              # Backend tests
│   │   ├── authTests.js            # Tests for authentication
│   │   ├── userTests.js            # Tests for users
│   │   └── contentTests.js         # Tests for content
│   ├── app.js               # Main application entry point
│   └── package.json         # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   ├── Sidebar.jsx           # Sidebar navigation
│   │   │   ├── VideoCard.jsx         # Video content preview
│   │   │   ├── ShortVideoCard.jsx    # Short video preview
│   │   │   ├── ArticleCard.jsx       # Article preview
│   │   │   ├── CommentBox.jsx        # Comment input field
│   │   │   └── LikeDislikeButton.jsx # Like/dislike buttons
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx             # Home feed
│   │   │   ├── VideoPage.jsx        # Video player page
│   │   │   ├── ShortVideoPage.jsx   # Short video display
│   │   │   ├── ArticlePage.jsx      # Full article view
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── UploadContent.jsx    # Content upload form
│   │   │   ├── Login.jsx            # User login
│   │   │   └── Register.jsx         # User registration
│   │   ├── services/       # API calls and services
│   │   │   ├── authService.js       # Handles authentication API calls
│   │   │   ├── contentService.js    # Handles content API calls
│   │   │   ├── userService.js       # User-related API calls
│   │   │   └── commentService.js    # Comment-related API calls
│   │   ├── assets/         # Images, stylesheets, etc.
│   │   ├── App.js          # Root component
│   │   └── index.js        # Entry point
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
│
├── ml_api/                 # Machine Learning models and APIs
│   ├── models/             # ML models
│   │   ├── classifier_model.py      # Tech content classification model
│   │   ├── summarizer.py           # Text summarization model
│   │   ├── sentiment_analyzer.py    # Sentiment analysis model
│   │   └── __init__.py              # Initializes the ML models
│   ├── preprocessing/      # Data preprocessing scripts
│   │   ├── text_cleaner.py         # Cleans extracted text
│   │   ├── feature_extractor.py    # Extracts relevant features
│   │   ├── transcript_parser.py    # Parses video/audio transcripts
│   │   └── __init__.py             # Initializes preprocessing module
│   ├── api/                # FastAPI endpoints for ML model inference
│   │   ├── mlRoutes.py             # API endpoints for ML features
│   │   ├── __init__.py             # Initializes API module
│   ├── utils/              # Helper functions
│   │   ├── fileHandler.py          # Handles file uploads
│   │   ├── apiHelper.py            # Utility functions for API processing
│   │   └── __init__.py             # Initializes utils module
│   ├── config/             # ML-related configurations
│   │   ├── settings.py            # ML model settings
│   │   └── database.py            # ML API database connection
│   ├── tests/              # ML API testing
│   │   ├── test_ml_api.py         # ML API tests
│   ├── main.py             # ML API entry point
│   └── requirements.txt    # Dependencies for ML API
│
├── docker/                 # Docker configuration files
│   ├── backend/            # Docker setup for backend
│   │   ├── Dockerfile              # Backend container setup
│   ├── frontend/           # Docker setup for frontend
│   │   ├── Dockerfile              # Frontend container setup
│   ├── ml_api/             # Docker setup for ML API
│   │   ├── Dockerfile              # ML API container setup
│   ├── docker-compose.yml  # Docker Compose for multi-container setup
│   └── .dockerignore       # Files to ignore in Docker builds
│
├── shared/                 # Public assets shared by backend and frontend
│   ├── uploads/            # User-uploaded content
│   ├── static/             # Static assets (e.g., icons, fonts)
│   ├── utils/              # Shared utility functions
│   │   ├── fileUploader.js         # File upload handler
│   │   ├── dataValidator.js        # Validates inputs before processing
│   │   └── commonHelpers.js        # Common helper functions
│   ├── constants/          # Shared constants
│   │   ├── appConstants.js         # General app-wide constants
│   │   ├── errorMessages.js        # Standardized error messages
│   │   └── apiEndpoints.js         # API endpoint definitions
│   └── README.md           # Documentation for shared resources
│
├── .github/                # GitHub Actions workflows
│   ├── workflows/          # CI/CD pipeline definitions
│   └── README.md           # GitHub Actions documentation
│
└── README.md               # Project documentation


### **📌 Full Explanation of the Project Structure (tayusa)**
This breakdown will explain the **role of each directory and file** to ensure clarity on how your project is structured.  

---

## **🛠 Root Directory (`tayusa/`)**
This is the **main project directory**, containing all the major folders for different parts of the application.  

```
tayusa/
├── backend/               
├── frontend/              
├── ml_api/                
├── docker/                
├── shared/               
├── .github/               
└── README.md              
```

- **`backend/`** → Manages the server-side logic, database interactions, and API endpoints.  
- **`frontend/`** → The client-side React application that interacts with the backend.  
- **`ml_api/`** → Machine learning models for content verification and analysis.  
- **`docker/`** → Docker configurations for containerizing the application.  
- **`shared/`** → Public/shared resources accessible by both the backend and frontend.  
- **`.github/`** → GitHub Actions for CI/CD automation.  
- **`README.md`** → Project documentation explaining setup and usage.  

---

## **📂 1. Backend (`backend/`)**
Handles authentication, database, content management, and APIs.  

### **🗂 `controllers/` (Handles business logic for API requests)**
Each controller processes API requests and interacts with the database.  
- **`authController.js`** → Handles user registration, login, JWT token management.  
- **`userController.js`** → Manages user profiles, follows/unfollows, account settings.  
- **`contentController.js`** → Handles video/article upload, retrieval, and deletion.  
- **`reportController.js`** → Manages reporting of inappropriate content.  
- **`commentController.js`** → Manages comments, replies, and likes on comments.  

### **🗂 `models/` (Defines database schemas)**
Each file represents a MongoDB schema using Mongoose.  
- **`User.js`** → Stores user details, passwords (hashed), followers, and likes.  
- **`Video.js`** → Stores long video metadata (title, owner, domain, views, etc.).  
- **`ShortVideo.js`** → Stores short video details.  
- **`Article.js`** → Stores tech articles uploaded by users.  
- **`Comment.js`** → Manages comment structure, replies, and likes.  
- **`Report.js`** → Stores reports for moderation.  
- **`index.js`** → Centralizes and exports all database models.  

### **🗂 `routes/` (Defines API endpoints)**
- **`authRoutes.js`** → Routes for login, signup, logout, password reset.  
- **`userRoutes.js`** → Routes for profile, following, saved content.  
- **`contentRoutes.js`** → Routes for uploading videos/articles.  
- **`commentRoutes.js`** → Routes for adding comments and replies.  
- **`reportRoutes.js`** → Routes for reporting inappropriate content.  
- **`index.js`** → Combines all routes for easy import.  

### **🗂 `utils/` (Helper functions & middlewares)**
- **`authMiddleware.js`** → Verifies JWT tokens and protects routes.  
- **`errorHandler.js`** → Standardized error responses.  
- **`validateInput.js`** → Validates request data before processing.  
- **`logger.js`** → Logs API calls, errors, and activities.  

### **🗂 `config/` (Configuration files)**
- **`db.js`** → Connects to MongoDB database.  
- **`env.js`** → Loads environment variables from `.env` file.  
- **`cloudStorage.js`** → Configures file storage (AWS S3, Firebase, etc.).  
- **`secrets.js`** → Stores secret keys for JWT, database, etc.  

### **Other Backend Files**
- **`tests/`** → Unit tests for backend features.  
- **`app.js`** → Initializes Express server and middleware.  
- **`package.json`** → Contains backend dependencies.  

---

## **🎨 2. Frontend (`frontend/`)**
This is the **React.js frontend** for the application.  

### **🗂 `src/components/` (Reusable UI components)**
- **`Navbar.jsx`** → Top navigation bar.  
- **`Sidebar.jsx`** → Left sidebar for navigation.  
- **`VideoCard.jsx`** → Displays video previews.  
- **`ShortVideoCard.jsx`** → Displays short videos.  
- **`ArticleCard.jsx`** → Displays articles.  
- **`CommentBox.jsx`** → Comment input field.  
- **`LikeDislikeButton.jsx`** → Like/dislike buttons.  

### **🗂 `src/pages/` (Page components)**
- **`Home.jsx`** → Main feed (For You & Following tabs).  
- **`VideoPage.jsx`** → Full video player page.  
- **`ShortVideoPage.jsx`** → Short video player page.  
- **`ArticlePage.jsx`** → Full article reader page.  
- **`Profile.jsx`** → User profile and saved content.  
- **`UploadContent.jsx`** → Upload form for videos/articles.  
- **`Login.jsx`** → User login page.  
- **`Register.jsx`** → User signup page.  

### **🗂 `src/services/` (Handles API requests)**
- **`authService.js`** → Manages login, signup, logout API calls.  
- **`contentService.js`** → Fetches videos/articles from backend.  
- **`userService.js`** → Fetches and updates user data.  
- **`commentService.js`** → Fetches and posts comments.  

### **Other Frontend Files**
- **`assets/`** → Stores images, logos, stylesheets.  
- **`App.js`** → Main React component.  
- **`index.js`** → Entry point for React.  
- **`package.json`** → Frontend dependencies.  

---

## **🤖 3. Machine Learning API (`ml_api/`)**
Handles AI-based **content verification and processing**.  

### **🗂 `models/` (Machine learning models)**
- **`classifier_model.py`** → Checks if content is tech-related.  
- **`summarizer.py`** → Summarizes articles.  
- **`sentiment_analyzer.py`** → Analyzes comment sentiments.  

### **🗂 `preprocessing/` (Data preprocessing utilities)**
- **`text_cleaner.py`** → Cleans text inputs.  
- **`feature_extractor.py`** → Extracts features from content.  

### **🗂 `api/` (FastAPI endpoints)**
- **`mlRoutes.py`** → ML API endpoints.  

### **Other ML API Files**
- **`utils/`** → Helper functions for ML.  
- **`config/`** → ML API settings.  
- **`main.py`** → Runs FastAPI server.  

---

## **🐳 4. Docker (`docker/`)**
Handles containerization for deployment.  
- **`backend/Dockerfile`** → Docker setup for backend.  
- **`frontend/Dockerfile`** → Docker setup for frontend.  
- **`ml_api/Dockerfile`** → Docker setup for ML API.  
- **`docker-compose.yml`** → Combines services in one command.  
- **`.dockerignore`** → Files ignored in Docker builds.  

---

## **📂 5. Shared (`shared/`)**
Contains **public/shared assets** for both frontend & backend.  
- **`uploads/`** → Stores uploaded content.  
- **`static/`** → Stores icons, fonts, etc.  
- **`utils/`** → Shared helper functions.  
- **`constants/`** → App-wide constants (e.g., API endpoints, error messages).  

---

## **📂 6. GitHub (`.github/`)**
Manages **GitHub Actions for CI/CD**.  
- **`workflows/`** → Defines build/test deployment workflows.  

---

### **🚀 Conclusion**
This structure ensures:  
✅ **Scalability** – Easily add new features.  
✅ **Maintainability** – Clearly separated concerns.  
✅ **Reusability** – Shared utilities and components.  
✅ **Performance** – Optimized backend & frontend workflows.  

