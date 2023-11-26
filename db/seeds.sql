-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS=0;

-- Department Data
INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

-- Role Data
INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000.00, 1),
    ('Salesperson', 80000.00, 1),
    ('Lead Engineer', 150000.00, 2),
    ('Software Engineer', 120000.00, 2),
    ('Accountant', 125000.00, 3),
    ('Legal Team Lead', 250000.00, 4),
    ('Lawyer', 190000.00, 4);

-- Employee Data
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, NULL),
    ('Johnny', 'Handly', 2, 1),
    ('Jane', 'Smith', 3, NULL),
    ('Abby', 'Johnson', 4, 3),
    ('Todd', 'Evans', 5, NULL),
    ('Will', 'Tate', 6, 5),
    ('Brenda', 'Williams', 7, 5),
    ('Tom', 'Ford', 8, 5),
    ('ManagerFirstName', 'ManagerLastName', 2, NULL);

-- Enable foreign key checks again
SET FOREIGN_KEY_CHECKS=1;