
-- Restaurant signup
drop procedure  if exists resturantSignup;

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
drop procedure  if exists getEmail;
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



-- Restaurant name, address and review counts

drop procedure  if exists getBasicInfo;
delimiter $$

create procedure `getBasicInfo`(in userID int)
begin
declare exit handler for sqlexception rollback;
start transaction;
	select RESTAURANT.Name as Name,City,Street,Zip,STATE.Name as State 
    from RESTAURANT JOIN STATE ON (RESTAURANT.State_ID=STATE.ID) where RESTAURANT.Restaurant_ID=userID;
    
    select count(REVIEWS.ID) as ReviewCount
    FROM REVIEWS
    where Restaurant_ID=userID
    GROUP BY ID,Restaurant_ID;
    commit;
end $$

delimiter ;

-- Restaurant complete information

drop procedure  if exists getRestaurantCompleteInfoQuery;
delimiter $$

create procedure `getRestaurantCompleteInfoQuery`(in userID int)
begin
declare exit handler for sqlexception rollback;
start transaction;
	SELECT Name,Country_ID,State_ID,City,Zip,Street,Phone_no,Country_Code,Opening_Time,Closing_Time
    ,Email FROM RESTAURANT 
    JOIN SIGNUP ON (Restaurant_ID=SIGNUP.ID) 
    WHERE Restaurant_ID=userID;
    commit;
end $$

delimiter ;


-- Update Restaurant ProfileRESTAURANT

drop procedure  if exists updateRestaurantProfileQuery;
delimiter $$

create procedure `updateRestaurantProfileQuery`
(in _Name varchar(50),in _Country_ID INT,in _State_ID INT,
in _City varchar(25),in _Zip INT,in _Street VARCHAR(50),
_Phone_no BIGINT,in _Country_Code INT,in _Opening_Time VARCHAR(10),
in _Closing_Time VARCHAR(10),in _Restaurant_ID INT)
begin
-- declare _startTime TIME;
-- declare _closingTime TIME;
declare exit handler for sqlexception rollback;
start transaction;
-- set _startTime=(SELECT CONVERT(_Opening_Time,TIME));
-- 	set _closingTime=(SELECT CONVERT(_Closing_Time,TIME));

	UPDATE RESTAURANT SET
    Name=_Name,
    Country_ID=_Country_ID,
    State_ID=_State_ID,
    City=_City,
    Zip=_Zip,
    Street=_Street,
    Phone_no=_Phone_no,
    Country_Code=_Country_Code,
    Opening_Time=_Opening_Time,
    Closing_Time=_Closing_Time
    where Restaurant_ID=_Restaurant_ID;
    commit;
end $$

delimiter ;