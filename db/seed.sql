use employees;

INSERT INTO department
    (name)
VALUES
    ('Program'),
    ('Human Resource'),
    ('IT'),
    ('Finance'),
    ('Admin');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Program Manager', 100000, 1),
    ('Program Officer', 80000, 1),
    ('HR Manager', 150000, 2),
    ('HR OFficer', 120000, 2),
    ('IT Manager', 160000, 3),
    ('IT Officer', 125000, 3),
    ('Finance Manager', 250000, 4),
    ('Finance Officer', 190000, 4),
    ('Admin Manager', 19000, 5),
    ('Admin Officer', 15000, 5);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Farid', 'Gardoon', 1, NULL),
    ('Mike', 'Tyson', 2, 1),
    ('Ashley', 'Attar', 3, NULL),
    ('Albert', 'Owens', 4, 3),
    ('Bob', 'Logab', 5, NULL),
    ('Nabi', 'Roshan', 6, 5),
    ('Sarah', 'loony', 7, NULL),
    ('Tom', 'Cleveland', 8, 7);
