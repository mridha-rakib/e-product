# 🌟 Advanced e-product shop
 
## 🚀 Tools & Technologies
 <ul> <li>Node.js</li> </ul>
  <ul> <li>Express.js</li> </ul>
  <ul> <li>TypeScript</li> </ul>
  <ul> <li>Mongodb & Mongoose</li> </ul>

## 🔄 Getting Started

🔄 Getting Started
1. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:
 
 ```bash

MONGO_URI=your_mongodb_connection_string
NODE_ENV=development # or "production"
PORT=3000 # or your preferred port
BASE_PATH=/api # optional, adjust as needed
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

```
2. Run the Application
Install dependencies and start the server:
bun install  # Install dependencies
bun dev     # Start the development server

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Entity Relationship Diagram for e-Product
### Database Tables and Relationships
Category ↔ Product (One-to-Many) </br>
Product ↔ ProductVariant (One-to-Many)

<img width="784" height="508" alt="image" src="https://github.com/user-attachments/assets/cac89a32-2f37-4242-b856-110fd9bf797d" />
