# Spatial Furbish

## Overview  
Spatial Furbish is a full-stack furniture e-commerce platform with an integrated 3D room planner. Users can browse and purchase furniture, visualize pieces in a customizable room layout, and manage orders — all in one place. Admins have a dedicated dashboard for managing products, categories, orders, customers, reviews, and textures.

## Features  
- 3D Room Planner with furniture placement and floor/wall texture customization  
- User authentication with JWT and role-based access control  
- Product browsing, filtering, and detailed product views  
- Shopping cart and order placement  
- Real-time updates via Socket.IO  
- Image uploads via Cloudinary  
- Admin dashboard for full platform management  
- Responsive UI with Tailwind CSS and shadcn/ui components

## Tech Stack  
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Three.js / React Three Fiber  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Real-time:** Socket.IO  
- **Storage:** Cloudinary  
- **Deployment:** Docker

## Project Structure  
```
├── client/      # React frontend (Vite + TypeScript)
├── server/      # Express backend (Node.js)
└── README.md    # Project documentation
```

## Getting Started Guide  
This guide will help you set up the project locally for development.

### Prerequisites  
- Node.js 18+  
- MongoDB Atlas account (or local MongoDB)  
- Cloudinary account

### Installation  
1. Clone the repository:  
   `git clone https://github.com/your-username/spatial-furbish.git`  
2. Navigate to the project directory:  
   `cd spatial-furbish`  
3. Install dependencies for both client and server:  
   ```
   cd client && npm install
   cd ../server && npm install
   ```

### Environment Setup  
Create a `.env` file in the `server/` directory based on the following:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development and Production Deployment  
### Development  
Run the client and server in separate terminals:
```
# Client
cd client && npm run dev

# Server
cd server && npm run dev
```

### Production  
Build the client and start the server:
```
cd client && npm run build
cd ../server && npm start
```

### Docker  
Both client and server include Dockerfiles for containerized deployment.

## Available Scripts  
- `npm run dev`: Starts the development server (client or server)  
- `npm run build`: Builds the client for production  
- `npm start`: Starts the production server  
- `npm run lint`: Runs ESLint on the client

## Contributing Guidelines  
Contributions are welcome. Please fork the repository and submit a pull request.  
Follow the existing code style and ensure new features are tested before submitting.

## License  
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author  
Nayananayaka Ranasinghe
Lokupulukkuttiralage Perera 
Ungamandadige Fernando
Rathnayaka Rathnayake 

## Support  
For support, please open an issue in the repository.
