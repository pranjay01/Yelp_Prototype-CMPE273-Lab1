-- Restaurant signup
DELIMITER  $$
CREATE PROCEDURE `customerSignup`
(IN _email varchar
(50),IN _password varchar
(100),IN _first_name varchar
(50),IN _last_name varchar
(50),IN _gender INT)
BEGIN
    declare _customerId int;
declare exit handler for sqlexception
rollback;
start transaction;
INSERT INTO SIGNUP
    (Email,Password,Role)
VALUES(_email, _password, 1);
set _customerId
=
(SELECT ID
FROM SIGNUP
WHERE Email=_email and Role=1);
INSERT INTO CUSTOMER
    (Customer_ID,First_Name,Last_Name,Gender,Join_Date)
VALUES(_customerId, _first_name, _last_name, _gender,CURDATE());
commit;
END  $$
