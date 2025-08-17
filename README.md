# SpringShop - E-commerce Application

SpringShop is a robust and secure e-commerce application built with Spring Boot, designed to provide a comprehensive platform for online shopping. This project includes features for user authentication, product catalog management, shopping cart functionality, order processing, and image handling for products.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema) (Conceptual)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management:** Secure user registration, login (JWT authenticated), retrieval, update, and deletion of user accounts.
- **Authentication & Authorization:** JWT (JSON Web Token) based authentication for secure API access, with role-based authorization (e.g., Admin roles for specific operations).
- **Product Catalog:** Full CRUD operations for products (Admin only for add/update/delete) and extensive search/filter capabilities by brand, name, and category.
- **Category Management:** Full CRUD operations for product categories.
- **Shopping Cart:** Add, remove, and update product quantities in the shopping cart, retrieve cart details, clear cart, and calculate total price.
- **Order Processing:** Place new orders and retrieve order history for users.
- **Image Management:** Upload, download, update, and delete product images.

## Technologies Used

- **Backend:**
    - Spring Boot (v3.3.4)
    - Java 21
    - Spring Security (for authentication and authorization)
    - Spring Data JPA (for database interaction)
    - PostgreSQL (relational database)
    - Hibernate (ORM implementation)
    - JJWT (for JSON Web Token handling)
    - Lombok (to reduce boilerplate code)
    - ModelMapper (for object mapping)
- **Build Tool:** Maven

## Getting Started

### Prerequisites

Before running this application, ensure you have the following installed:

- Java Development Kit (JDK) 21
- Maven (compatible with Spring Boot 3.x)
- PostgreSQL database server

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/springshop.git
    cd springshop
    ```

2.  **Configure PostgreSQL:**
    - Create a database named `shopapp` in your PostgreSQL server.
    - Ensure your PostgreSQL username and password match the configuration in `src/main/resources/application.properties`.

### Configuration

Edit the `src/main/resources/application.properties` file to match your database credentials and other settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shopapp
spring.datasource.username=postgres
spring.datasource.password=1234
# ... other configurations ...
```

**Note on JWT Secret:** The `auth.token.jwtSecret` in `application.properties` is a hardcoded secret for demonstration purposes. **In a production environment, this should be a strong, randomly generated secret stored securely (e.g., environment variable, Kubernetes Secret).**

### Running the Application

You can run the application using Maven:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080` by default.

## API Endpoints

The API base URL is `/api/v1`.

### Authentication

- `POST /api/v1/auth/login`: User login.

### User Management

- `GET /api/v1/users/{userId}/user`: Get user by ID.
- `POST /api/v1/users/add`: Create a new user.
- `PUT /api/v1/users/{userId}/update`: Update user by ID.
- `DELETE /api/v1/users/{userId}/delete`: Delete user by ID.

### Category Management

- `GET /api/v1/categories/all`: Get all categories.
- `POST /api/v1/categories/add`: Add a new category.
- `GET /api/v1/categories/category/{id}/category`: Get category by ID.
- `GET /api/v1/categories/category/{name}/category`: Get category by name.
- `DELETE /api/v1/categories/category/{id}/delete`: Delete category by ID.
- `PUT /api/v1/categories/category/{id}/update`: Update category by ID.

### Product Management

- `GET /api/v1/products/all`: Get all products.
- `GET /api/v1/products/product/{id}/product`: Get product by ID.
- `POST /api/v1/products/add`: Add a new product (Admin only).
- `PUT /api/v1/products/product/{productId}/update`: Update product by ID (Admin only).
- `DELETE /api/v1/products/product/{productId}/delete`: Delete product by ID (Admin only).
- `GET /api/v1/products/product/by/brand-and-name`: Get products by brand and name.
- `GET /api/v1/products/product/by/category-and-brand`: Get products by category and brand.
- `GET /api/v1/products/product/{name}/product`: Get products by name.
- `GET /api/v1/products/product/by-brand`: Get products by brand.
- `GET /api/v1/products/product/{category}/all/product`: Get products by category name.
- `GET /api/v1/products/product/count/by-brand/and-name`: Count products by brand and name.

### Shopping Cart

- `POST /api/v1/cartItems/item/add`: Add an item to the cart.
- `DELETE /api/v1/cartItems/cart/{cartId}/item/{productId}/remove`: Remove an item from the cart.
- `PUT /api/v1/cartItems/cart/{cartId}/item/{productId}/update`: Update item quantity in the cart.
- `GET /api/v1/carts/{cartId}/my-cart`: Get cart by ID.
- `DELETE /api/v1/carts/{cartId}/clear`: Clear all items from the cart.
- `GET /api/v1/carts/{cartId}/cart/total`: Get the total price of items in the cart.

### Order Management

- `POST /api/v1/orders/order`: Create a new order.
- `GET /api/v1/orders/{orderId}/order`: Get order by ID.
- `GET /api/v1/orders/{userId}/orders`: Get all orders for a user.

### Image Management

- `POST /api/v1/images/upload`: Upload images for a product.
- `GET /api/v1/images/image/download/{imageId}`: Download image by ID.
- `PUT /api/v1/images/image/{imageId}/update`: Update image by ID.
- `DELETE /api/v1/images/image/{imageId}/delete`: Delete image by ID.

## Database Schema (Conceptual)

The application uses a PostgreSQL database with the following conceptual entities:

- **Users:** Stores user information, including authentication credentials and roles.
- **Roles:** Defines user roles (e.g., USER, ADMIN).
- **Categories:** Stores product categories (e.g., Electronics, Apparel).
- **Products:** Stores product details, including name, description, price, brand, and a link to its category.
- **Images:** Stores product images, linked to products. Images are stored as `BLOB` or `bytea`.
- **Carts:** Represents a user's shopping cart.
- **CartItems:** Links products to carts, storing quantity.
- **Orders:** Represents a user's placed order.
- **OrderItems:** Links products to orders, storing quantity and price at the time of order.

The `ddl-auto=update` in `application.properties` means Hibernate will automatically create/update the tables based on the JPA entities.

## Contributing

Contributions are welcome! Please feel free to fork the repository, make changes, and submit pull requests.

## License

This project is licensed under the MIT License.