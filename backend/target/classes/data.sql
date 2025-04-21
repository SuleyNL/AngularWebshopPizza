-- Insert demo users if they don't exist
INSERT INTO users (id, username, email, password, first_name, last_name, address, phone, role)
SELECT 1, 'admin', 'admin@pizzadeliziosa.com', '$2a$10$dS5AhbQYi5Xj0UzWWjWxz.WZ.TS.UYnC7GNmsyM3.JlI8d/3tYRV2', 'Admin', 'User', '123 Main St', '555-123-4567', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (id, username, email, password, first_name, last_name, address, phone, role)
SELECT 2, 'customer', 'customer@example.com', '$2a$10$dS5AhbQYi5Xj0UzWWjWxz.WZ.TS.UYnC7GNmsyM3.JlI8d/3tYRV2', 'John', 'Doe', '456 Oak St', '555-987-6543', 'CUSTOMER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'customer');

-- Insert demo products if they don't exist
INSERT INTO products (id, name, description, price, category, is_available)
SELECT 1, 'Margherita', 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil', 11.99, 'PIZZA', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Margherita');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 2, 'Pepperoni', 'Classic pizza with tomato sauce, mozzarella cheese, and pepperoni', 13.99, 'PIZZA', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pepperoni');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 3, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese', 5.99, 'SIDE', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Caesar Salad');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 4, 'Garlic Bread', 'Freshly baked bread with garlic butter and herbs', 4.99, 'SIDE', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garlic Bread');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 5, 'Soda', 'Choice of cola, lemon-lime, or orange soda (600ml)', 1.99, 'BEVERAGE', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Soda');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 6, 'Supreme', 'Loaded pizza with pepperoni, sausage, bell peppers, onions, and olives', 15.99, 'PIZZA', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Supreme');

INSERT INTO products (id, name, description, price, category, is_available)
SELECT 7, 'Buffalo Wings', '8 pieces of spicy buffalo wings served with blue cheese dip', 9.99, 'SIDE', true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Buffalo Wings');

-- Insert demo promocodes if they don't exist
INSERT INTO promocodes (id, code, discount_percentage, is_active)
SELECT 1, 'WELCOME10', 10.00, true
WHERE NOT EXISTS (SELECT 1 FROM promocodes WHERE code = 'WELCOME10');

INSERT INTO promocodes (id, code, discount_percentage, is_active)
SELECT 2, 'SUMMER20', 20.00, true
WHERE NOT EXISTS (SELECT 1 FROM promocodes WHERE code = 'SUMMER20');

-- Insert demo orders for the customer user
INSERT INTO orders (id, user_id, total_amount, status, discount_amount, delivery_address, delivery_phone, created_at)
SELECT 1, 2, 35.97, 'DELIVERED', 0.00, '456 Oak St, Anytown, USA', '555-987-6543', '2023-04-15 10:30:00'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = 1);

INSERT INTO orders (id, user_id, total_amount, status, discount_amount, delivery_address, delivery_phone, created_at)
SELECT 2, 2, 29.97, 'CONFIRMED', 5.00, '456 Oak St, Anytown, USA', '555-987-6543', '2023-04-20 18:45:00'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = 2);

INSERT INTO orders (id, user_id, total_amount, status, discount_amount, delivery_address, delivery_phone, created_at)
SELECT 3, 2, 45.96, 'PENDING', 0.00, '456 Oak St, Anytown, USA', '555-987-6543', '2023-04-25 20:15:00'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE id = 3);

-- Insert order items for Order #1
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 1, 1, 1, 2, 11.99, 23.98
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 1);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 2, 1, 3, 2, 5.99, 11.98
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 2);

-- Insert order items for Order #2
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 3, 2, 2, 1, 13.99, 13.99
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 3);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 4, 2, 4, 2, 4.99, 9.98
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 4);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 5, 2, 5, 3, 1.99, 5.97
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 5);

-- Insert order items for Order #3
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 6, 3, 6, 2, 15.99, 31.98
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 6);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 7, 3, 7, 1, 9.99, 9.99
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 7);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
SELECT 8, 3, 5, 2, 1.99, 3.98
WHERE NOT EXISTS (SELECT 1 FROM order_items WHERE id = 8); 