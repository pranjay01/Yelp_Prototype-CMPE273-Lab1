-- Customer signup
drop procedure if exists customerSignup ;

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



-- Customer signup
drop procedure if exists getBasicInfoCustomer ;

DELIMITER  $$
CREATE PROCEDURE getBasicInfoCustomer
(IN userID INT)
BEGIN

select concat(First_Name,' ',substr(Last_Name,1,1),'.') as Name, City as Address 
From CUSTOMER where Customer_ID=userID;

select count(ID) as ReviewCount from REVIEWS where Customer_ID = userID;

END  $$

delimiter ;


-- Procedure For Customer Update Profile, Fetch all static data+ Profile data

drop procedure if exists getDataForCustomerUpdateProfile;
delimiter $$

create procedure getDataForCustomerUpdateProfile(IN cusID INT)
begin
declare exit handler for sqlexception rollback;
start transaction;
	SELECT * FROM CUSTOMER WHERE Customer_ID=cusID;
    
	select ID,Name from COUNTRY order by ID asc;
    
    select ID,Name from STATE order by Name asc;

    select ID,Gender from GENDER_LIST order by Gender asc;    
    
commit;
end $$