ShopOnline Backend API

Backend API cho hệ thống E-Commerce được xây dựng bằng Node.js, ExpressJS, MongoDB, GraphQL và Cloudinary.

🚀 Technologies
Node.js
ExpressJS
MongoDB + Mongoose
JWT Authentication
GraphQL (Apollo Server v4)
Swagger API Documentation
Cloudinary Image Upload
Multer
Zod Validation
Docker
📂 Project Structure
src/
│
├── config/
├── controllers/
├── graphql/
├── middlewares/
├── models/
├── routes/
├── swagger/
├── utils/
├── validations/
│
├── app.js
├── server.js
└── seed.js
⚙️ Installation
1. Clone project
git clone https://github.com/AlexanderPhan04/Back-End-Development-Framework
cd Back-End-Development-Framework
2. Install dependencies
npm install
3. Seed sample data
npm run seed
🔐 Environment Variables

Tạo file .env

PORT=5000

MONGO_URI=mongodb://localhost:27017/shoponline

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
🐳 Docker MongoDB

Run MongoDB bằng Docker:

docker run -d \
--name shoponline-mongo \
-p 27017:27017 \
mongo

Kiểm tra MongoDB:

docker ps
▶️ Run Project

Development mode:

npm run dev

Production mode:

npm start

Server:

http://localhost:5000
📘 Swagger Documentation

Swagger UI:

http://localhost:5000/api-docs
⚡ GraphQL Playground

GraphQL endpoint:

http://localhost:5000/graphql
⚡ GraphQL Features

Queries:
me
users (admin)
categories
products(filter, pagination)
product(id)
cart
orders
order(id)
productReviews(productId)

Mutations:
register
login
updateProfile
createCategory / updateCategory / deleteCategory (admin)
createProduct / updateProduct / deleteProduct (admin)
addToCart / updateCartItem / removeFromCart / clearCart
createOrder
updateOrderStatus (admin)
createReview

📸 Screenshots

Sau khi chạy project, chụp và lưu screenshot để nộp bài:

Swagger UI:
http://localhost:5000/api-docs

GraphQL Sandbox:
http://localhost:5000/graphql

Checklist trước khi nộp:

- README có link repo, hướng dẫn chạy, biến môi trường, seed script, Swagger và GraphQL endpoint.
- `.env.example` có `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` và Cloudinary config.
- Swagger UI cần chụp màn hình tại `http://localhost:5000/api-docs`.
- GraphQL Sandbox cần chụp màn hình tại `http://localhost:5000/graphql`.
- Video demo nên test login, một API public, một API admin/protected và một query GraphQL.
🔑 Authentication

Hệ thống sử dụng JWT Authentication.

Sau khi login/register sẽ nhận được:

{
  "token": "JWT_TOKEN"
}

Gửi token bằng header:

Authorization: Bearer YOUR_TOKEN
📦 REST API Features
Auth
Register
Login
Get Profile
Update Profile
Users
Get Users (admin)
Categories
Create Category
Get Categories
Update Category
Delete Category
Products
Create Product
Upload Product Images
Get Products
Get Product Detail
Update Product
Delete Product
Cart
Add To Cart
Update Cart Item
Remove From Cart
Clear Cart
Get Cart
Orders
Create Order
Get Orders
Get Order Detail
Update Order Status
Reviews
Create Review
Get Product Reviews
🖼️ Cloudinary Upload

Project hỗ trợ upload ảnh sản phẩm lên Cloudinary.

Ảnh được lưu dưới dạng URL trong MongoDB.

Ví dụ:

{
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
🧪 Example Product Upload

Endpoint:

POST /api/products

Body (form-data):

Key	Type
name	Text
description	Text
price	Text
stock	Text
category	Text
images	File
🔍 Validation

Project sử dụng Zod validation.

Ví dụ lỗi:

{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "Invalid email address"
    ]
  }
}
🛡️ Security
JWT Authentication
Admin Authorization
Input Validation
Protected Routes
Error Handling Middleware
📌 Example Admin Account
{
  "email": "admin@gmail.com",
  "password": "123456"
}
👨‍💻 Author

Phan Nhật Quân
Alexander Phan

GitHub: AlexanderPhan04
Website: alexanderphan.dev
📄 License

MIT License
