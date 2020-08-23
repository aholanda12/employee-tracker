INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Accounting");
INSERT INTO department (name) VALUES ("IT");

INSERT into role (title, salary, department_id) VALUES ("Marketing Manager", 100000, 1);
INSERT into role (title, salary, department_id) VALUES ("Marketing Coordinator", 50000, 1);
INSERT into role (title, salary, department_id) VALUES ("Accounting Manager", 100000, 2);
INSERT into role (title, salary, department_id) VALUES ("Accounts Payable", 70000, 2);
INSERT into role (title, salary, department_id) VALUES ("Accounts Receivable", 70000, 2);
INSERT into role (title, salary, department_id) VALUES ("IT Manager", 100000, 3);
INSERT into role (title, salary, department_id) VALUES ("Engineer", 90000, 3);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Faraz", "Rose", 1, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Stefinia", "Hull", 2, 1);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Caelen", "Gallegos", 2, 1);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Hadi", "Ayers", 3, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Derek", "Mendez", 4, 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Liliana", "Santana", 4, 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Marisa", "Haney", 5, 3);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Adrienne", "Andrew", 6, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Sheldon", "Kirkland", 7, 6);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Arissa", "Dejesus", 7, 6);

