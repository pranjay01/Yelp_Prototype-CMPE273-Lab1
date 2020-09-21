-- Restaurant signup
drop procedure customerSignup

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

delimiter ;

-- Restaurant name, address and review counts

drop procedure getBasicInfo;
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

drop procedure getRestaurantCompleteInfoQuery;
delimiter $$

create procedure `getRestaurantCompleteInfoQuery`(in userID int)
begin
declare exit handler for sqlexception rollback;
start transaction;
	SELECT * FROM RESTAURANT WHERE Restaurant_ID=userID;
    commit;
end $$

delimiter ;

