INSERT INTO department (name) VALUES ('Customer Service'), ('Bakery'), ('Butchery'), ('Produce'), ('Management');

INSERT INTO role (title, salary, department_id) VALUES ('Cashier', 55000, 1), ('Baker', 60000, 2), ('Butcher', 65000, 3), ('Stocker', 50000, 4), ('Manager', 105000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 1),
('Jane', 'Smith', 2, 2),
('Mark', 'Johnson', 3, 2),
('Emily', 'Williams', 4, 1),
('Chris', 'Brown', 5, 3),
('Emma', 'Davis', 5, 3),
('Michael', 'Wilson', 1, 1),
('Olivia', 'Martinez', 4, 1);
