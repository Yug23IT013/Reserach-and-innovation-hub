# Gujarat Research & Innovation Hub

A comprehensive platform connecting researchers, entrepreneurs, investors, IPR professionals, and government officials to foster innovation and research collaboration in Gujarat.

## 🚀 Features

### For Researchers
- Create and manage research projects
- Track project status and progress
- Share research findings and publications
- Collaborate with other researchers

### For Entrepreneurs
- Create and manage startup profiles
- Showcase innovations and business ideas
- Connect with potential investors
- Track startup progress

### For Investors
- Browse promising startups
- View detailed startup information
- Track investment opportunities

### For IPR Professionals
- Manage intellectual property records
- Track patent, trademark, and copyright applications
- Monitor IPR status
- Document IPR processes

### For Government Officials
- Monitor research activities
- Track IPR registrations
- Access comprehensive reports
- Oversee innovation ecosystem

## 💻 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Font Awesome icons
- Modern UI/UX principles

### Backend
- Node.js and Express.js
- MongoDB for database
- JWT for authentication
- Role-based access control

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/research-innovation-hub.git
cd research-innovation-hub
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the application:
```bash
# Start backend server
cd backend
npm start

# Start frontend (in a new terminal)
cd frontend
npm start
```

## 🔐 User Roles and Permissions

### Researcher
- Create/edit research projects
- Upload research documents
- View other research projects

### Entrepreneur
- Create/manage startup profiles
- Update startup information
- Connect with investors

### Investor
- View startup listings
- Access startup details
- Track investment opportunities

### IPR Professional
- Create/manage IPR records
- Update IPR status
- Track IPR applications

### Government Official
- View research projects
- Monitor IPR records
- Access reports and statistics

## 📱 API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Research
- POST /api/research - Create research project
- GET /api/research - Get all research projects
- PUT /api/research/:id - Update research project
- DELETE /api/research/:id - Delete research project

### Startups
- POST /api/startups - Create startup
- GET /api/startups - Get all startups
- PUT /api/startups/:id - Update startup
- DELETE /api/startups/:id - Delete startup

### IPR
- POST /api/ipr - Create IPR record
- GET /api/ipr - Get all IPR records
- PUT /api/ipr/:id - Update IPR record
- DELETE /api/ipr/:id - Delete IPR record

## 🔄 Future Enhancements

- Messaging system for user communication
- Advanced search and filtering
- Analytics dashboard
- Document management system
- Event management
- Mobile application
- Mentorship program
- Integration with external platforms

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any queries or support, please contact:
- Email: your.email@example.com
- Website: https://www.example.com
- Phone: +91-XXXXXXXXXX

## 🙏 Acknowledgments

- Government of Gujarat
- Academic institutions
- Research organizations
- Startup incubators
- Innovation centers 