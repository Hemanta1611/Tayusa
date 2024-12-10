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
