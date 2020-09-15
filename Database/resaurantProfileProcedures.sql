
-- Restaurant signup
DELIMITER  $$
CREATE PROCEDURE `resturantSignup`
(IN _email varchar
(50),IN _password varchar
(100),IN _name varchar
(50), IN _country INT, IN _state INT,IN _city varchar
(25),IN _zip INT, IN _street varchar
(50),IN _c_code INT,IN _phone bigint)
BEGIN
    declare _resturantId int;
declare exit handler for sqlexception
rollback;
start transaction;
INSERT INTO SIGNUP
    (Email,Password,Role)
VALUES(_email, _password, 2);
set _resturantId
=
(SELECT ID
FROM SIGNUP
WHERE Email=_email and Role=2);
INSERT INTO RESTAURANT
    (Restaurant_ID,Name,Country_ID,State_ID,City,Zip,Street,Country_Code,Phone_no)
VALUES(_resturantId, _name, _country, _state, _city, _zip, _street, _c_code, _phone);
commit;
END  $$


-- Fetch details based on email common for both restaurant and customer
use Yelp_Prototype;
DELIMITER  $$
CREATE PROCEDURE `getEmail`
(IN _email varchar
(50),IN _role enum('Customer','Restaurant'))
BEGIN
    declare exit handler for sqlexception
    rollback;
    start transaction;
    SELECT *
    FROM SIGNUP
    WHERE Email like _email and Role=_role;
    commit;
END
$$
