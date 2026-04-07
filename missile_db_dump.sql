-- Database: missile_db
-- Table: MISSILE
DROP TABLE IF EXISTS MISSILE;
CREATE TABLE MISSILE (
    missile_id INT AUTO_INCREMENT PRIMARY KEY,
    missile_name VARCHAR(255) NOT NULL,
    missile_type VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    manufacture_date VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

INSERT INTO MISSILE VALUES (1, 'nucler', 'bomba', 'iran', '0005-12-20', 'Active');
INSERT INTO MISSILE VALUES (2, 'Trident-II', 'Ballistic', 'Lockheed Martin', '2026-03-26', 'Active');
INSERT INTO MISSILE VALUES (3, 'missile', 'bomba', 'china', '1981-08-14', 'Maintenance');
INSERT INTO MISSILE VALUES (4, 'patotoya ko', 'dako kog oten', 'davao', '3333-03-31', 'Decommissioned');
