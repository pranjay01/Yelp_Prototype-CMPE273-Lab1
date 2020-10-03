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

select concat(First_Name,' ',substr(Last_Name,1,1),'.') as Name, City as Address, ImageURL
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



-- Update Customer Profile
drop procedure  if exists updateCustomerProfile;
delimiter $$

create procedure `updateCustomerProfile`
(IN _Customer_ID INT,  IN _First_Name VARCHAR(50), IN _Last_Name VARCHAR(50),
IN _Nick_Name VARCHAR(50), IN _Gender INT, IN _Date_Of_Birth DATE,  IN _Country_ID int,
IN _State_ID INT, IN _City VARCHAR(25), IN _Zip INT, IN _Street VARCHAR(100),
IN _Headline VARCHAR(100), IN _I_Love VARCHAR(1024), IN _Find_Me_In VARCHAR(100), 
IN _Website VARCHAR(100),IN _ImageUrl VARCHAR(500))
begin

declare exit handler for sqlexception rollback;
start transaction;
	
	UPDATE CUSTOMER 
    SET First_Name=_First_Name,
    Last_Name=_Last_Name,
    Nick_Name=_Nick_Name,
    Gender=_Gender,
    Date_Of_Birth=_Date_Of_Birth,
    Country_ID=_Country_ID,
    State_ID=_State_ID,
    City=_City,
    Zip=_Zip,
    Street=_Street,
    Headline=_Headline,
    I_Love=_I_Love,
    Find_Me_In=_Find_Me_In,
    Website=_Website,
    ImageURL=_ImageUrl
    where Customer_ID=_Customer_ID;
    
    commit;
end $$



-- Procedure For Customer Contact Info, Fetch required static data+ Profile data

drop procedure if exists getContactInfoProfile;
delimiter $$

create procedure getContactInfoProfile(IN cusID INT)
begin
declare exit handler for sqlexception rollback;
start transaction;
	
    SELECT Email, Phone_no as ContactNo, Country_Code as CountryCode
    FROM SIGNUP JOIN CUSTOMER ON CUSTOMER.Customer_ID=SIGNUP.ID
    WHERE SIGNUP.ID=cusID;
    
    SELECT * FROM COUNTRY;
    
commit;
end $$


drop procedure  if exists updateContactInformation;
delimiter $$

create procedure `updateContactInformation`(IN cusID INT, IN oldEmail VARCHAR(50),
IN newEmail VARCHAR(50),IN contactNo BIGINT, IN Code INT)
begin

declare exit handler for sqlexception rollback;
start transaction;

IF (EXISTS(SELECT * FROM SIGNUP WHERE Email=newEmail and Role=1)) THEN
	SELECT 'Email Already Exists' as result;
else
	UPDATE SIGNUP SET Email=newEmail WHERE Email=oldEmail and Role=1;
    
	UPDATE CUSTOMER SET Phone_no=contactNo, Country_Code=Code
    WHERE Customer_ID=cusID;

END IF;

commit;
end $$


drop procedure  if exists updateContactInformation2;
delimiter $$

create procedure `updateContactInformation2`(IN cusID INT,IN contactNo BIGINT, IN Code INT)
begin

declare exit handler for sqlexception rollback;
start transaction;


	UPDATE CUSTOMER SET Phone_no=contactNo, Country_Code=Code
    WHERE Customer_ID=cusID;

commit;
end $$


drop procedure  if exists getPassword;
delimiter $$

create procedure `getPassword`(IN cusID INT)
begin

declare exit handler for sqlexception rollback;
start transaction;


	SELECT password FROM SIGNUP WHERE ID=cusID;

commit;
end $$




drop procedure  if exists getCustomerCompleteProfile;
delimiter $$

create procedure `getCustomerCompleteProfile`(IN cusID INT)
begin

declare exit handler for sqlexception rollback;
start transaction;


	SELECT Nick_Name as NickName, DATE_FORMAT(Date_Of_Birth,'%D %M %Y') as DOB, 
    concat(City,', ',STATE.Name) as Address1, Street as Address2,
    Headline, I_Love as ILove, Find_Me_In as FMI, 
    DATE_FORMAT(Join_Date,'%M %Y') as JoinDate, Website , ImageURL
    FROM CUSTOMER JOIN STATE ON STATE.ID=State_ID
    WHERE Customer_ID=cusID;

commit;
end $$



-- Creating New Review
drop procedure if exists submitReview ;

DELIMITER  $$
CREATE PROCEDURE `submitReview`
(IN _rating INT
,IN _restroID INT
,IN _cusID INT
,IN _description VARCHAR(1000))
BEGIN
    declare _customerId int;
declare exit handler for sqlexception
rollback;
start transaction;

INSERT INTO REVIEWS (Rating,Restaurant_ID,Customer_ID,Date,Description) 
VALUES(_rating, _restroID, _cusID,curdate(),_description);


commit;
END  $$

delimiter ;




