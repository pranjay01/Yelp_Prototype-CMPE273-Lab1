
-- Restaurant signup
DELIMITER  $$
CREATE PROCEDURE `resturantSignup` (IN _email varchar(50),IN _password varchar(100),IN _name varchar(50), IN _country INT, IN _state INT,IN _city varchar(25),IN _zip INT, IN _street varchar(50),IN _c_code INT,IN _phone bigint)
BEGIN
declare _resturantId int;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO SIGNUP(Email,Password,Role) VALUES(_email,_password,1);
set _resturantId = (SELECT ID FROM SIGNUP WHERE Email=_email);
INSERT INTO RESTAURANT(Restaurant_ID,Name,Country_ID,State_ID,City,Zip,Street,Country_Code,Phone_no) 
VALUES(_resturantId,_name,_country,_state,_city,_zip,_street,_c_code,Phone_no);
commit;
END  $$


-- Fetch details based on email
use Yelp_Prototype;
DELIMITER  $$
CREATE PROCEDURE `getEmail` (IN email1 varchar(50))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM SIGNUP WHERE Email like email1;
commit;
END  $$
