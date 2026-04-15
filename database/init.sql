-- Create database
CREATE DATABASE IF NOT EXISTS hotel_booking_dbs;
USE hotel_booking_dbs;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    rating DOUBLE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Categories table
CREATE TABLE IF NOT EXISTS room_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    room_category_id BIGINT NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_category_id) REFERENCES room_categories(id) ON DELETE RESTRICT
);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100)
);

-- Hotel_Amenities junction table
CREATE TABLE IF NOT EXISTS hotel_amenities (
    hotel_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_number VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, COMPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT
);

-- Insert initial roles
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Insert dummy admin user ('admin@hotel.com' / 'admin123')
-- BCrypt hash for 'admin123' is '$2a$10$fV2hJ7b/.R27Hn6S.vYf1.tK8b5u5p1w3g9rFdL2rF8/g3wV5fUqC'
INSERT IGNORE INTO users (email, password, first_name, last_name, role_id) 
VALUES ('admin@hotel.com', '$2a$10$fV2hJ7b/.R27Hn6S.vYf1.tK8b5u5p1w3g9rFdL2rF8/g3wV5fUqC', 'System', 'Admin', (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'));

-- Insert some dummy amenities
INSERT IGNORE INTO amenities (name, icon) VALUES 
('Free Wi-Fi', 'wifi'),
('Swimming Pool', 'pool'),
('Gym', 'dumbbell'),
('Spa', 'spa'),
('Restaurant', 'utensils'),
('Room Service', 'bell');

-- Insert dummy hotel
INSERT IGNORE INTO hotels (name, description, address, city, country, rating, image_url) VALUES 
('Grand Luxury Resort', 'Experience ultimate luxury at our beachfront resort.', '123 Ocean Drive', 'Miami', 'USA', 4.8, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'),
('City Center Inn', 'Conveniently located in the heart of downtown.', '456 Main St', 'New York', 'USA', 4.2, 'https://images.unsplash.com/photo-1551882547-ff40c0d129fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');

-- Insert room categories
INSERT IGNORE INTO room_categories (name, description) VALUES 
('Standard', 'Basic comfortable room'),
('Deluxe', 'Spacious room with a view'),
('Suite', 'Luxurious suite with separate living area');

-- Link amenities to hotels
INSERT IGNORE INTO hotel_amenities (hotel_id, amenity_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 5);

-- Insert dummy rooms
INSERT IGNORE INTO rooms (hotel_id, room_category_id, room_number, price_per_night, capacity, image_url) VALUES 
(1, 1, '101', 150.00, 2, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'),
(1, 2, '201', 250.00, 3, 'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'),
(1, 3, '301', 500.00, 4, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'),
(2, 1, '1A', 100.00, 2, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'),
(2, 2, '2A', 180.00, 2, 'https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
