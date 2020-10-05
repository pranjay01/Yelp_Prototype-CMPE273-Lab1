
-- Restaurant signup
drop procedure  if exists resturantSignup;

DELIMITER  $$
CREATE PROCEDURE `resturantSignup`
(IN _email varchar
(50),IN _password varchar
(100),IN _name varchar
(50), IN _country INT, IN _state INT,IN _city varchar
(25),IN _zip INT, IN _street varchar
(50),IN _c_code INT,IN _phone bigint,IN _latitude varchar(50),IN _longitude varchar(50))
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
    (Restaurant_ID,Name,Country_ID,State_ID,City,Zip,Street,Country_Code,Phone_no,Latitude,Longitude)
VALUES(_resturantId, _name, _country, _state, _city, _zip, _street, _c_code, _phone,_latitude,_longitude);
commit;
END  $$


-- Fetch details based on email common for both restaurant and customer

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
	select RESTAURANT.Name as Name,City,Street,Zip,STATE.Name as State, ImageURL
    from RESTAURANT JOIN STATE ON (RESTAURANT.State_ID=STATE.ID) where RESTAURANT.Restaurant_ID=userID;
    
    select count(REVIEWS.ID) as ReviewCount
    FROM REVIEWS
    where Restaurant_ID=userID
    GROUP BY Restaurant_ID;
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
    ,Email,ImageURL FROM RESTAURANT 
    JOIN SIGNUP ON (Restaurant_ID=SIGNUP.ID) 
    WHERE Restaurant_ID=userID;
    commit;
    
    select Delivery_ID as ID from DELIVERY_TYPE_RESTAURANT_MAPPINGS where Restaurant_ID=userID;
end $$

delimiter ;


-- Update Restaurant ProfileRESTAURANT

drop procedure  if exists updateRestaurantProfileQuery;
delimiter $$

create procedure `updateRestaurantProfileQuery`
(in _Name varchar(50),in _Country_ID INT,in _State_ID INT,
in _City varchar(25),in _Zip INT,in _Street VARCHAR(50),
_Phone_no BIGINT,in _Country_Code INT,in _Opening_Time VARCHAR(10),
in _Closing_Time VARCHAR(10),in _Restaurant_ID INT, in CurbsidePickup BOOLEAN,
in DineIn BOOLEAN,in YelpDelivery BOOLEAN,IN _ImageUrl VARCHAR(500))
begin

declare exit handler for sqlexception rollback;
start transaction;
	
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
    Closing_Time=_Closing_Time,
    ImageURL=_ImageUrl
    where Restaurant_ID=_Restaurant_ID;
    
    DELETE FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS where Restaurant_ID=_Restaurant_ID;
    
    IF CurbsidePickup THEN
		INSERT INTO DELIVERY_TYPE_RESTAURANT_MAPPINGS (Delivery_ID,Restaurant_ID) 
        VALUES(1,_Restaurant_ID);
	END IF;
    
    IF DineIn THEN
		INSERT INTO DELIVERY_TYPE_RESTAURANT_MAPPINGS (Delivery_ID,Restaurant_ID) 
        VALUES(2,_Restaurant_ID);
	END IF;
    
    IF YelpDelivery THEN
		INSERT INTO DELIVERY_TYPE_RESTAURANT_MAPPINGS (Delivery_ID,Restaurant_ID) 
        VALUES(3,_Restaurant_ID);
	END IF;
    
    commit;
end $$

delimiter ;
getOrderDetailsNew

-- Procedure to fetch review for the Restaurant
drop procedure  if exists fetchReviews;
DELIMITER $$
CREATE PROCEDURE `fetchReviews` (IN RestroID INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT REVIEWS.ID as ID, REVIEWS.Customer_ID as CustomerId,  CUSTOMER.ImageURL as ImageUrl,
concat(First_Name,' ', Last_Name) as CustomerName,Description,Date,
Rating , concat(City, Zip )
FROM REVIEWS JOIN CUSTOMER on REVIEWS.Customer_ID = CUSTOMER.Customer_ID
WHERE Restaurant_ID = RestroID;
commit;
END$$
DELIMITER ;




-- Procedure to fetch review for the Restaurant
drop procedure  if exists uploadPicToDB;
DELIMITER $$
CREATE PROCEDURE `uploadPicToDB` (IN RestroID INT, 
IN _ImagrUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE RESTAURANT SET ImageURL=_ImagrUrl where Restaurant_ID=RestroID;
commit;
END$$
DELIMITER ;