USE Yelp_Prototype;

-- Procedure to fetch the items froM the menu table asked
drop procedure IF EXISTS fetchAppetizerItems;

DELIMITER $$
CREATE PROCEDURE `fetchAppetizerItems` (IN ID_check INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM APPETIZER WHERE Restaurant_ID = ID_check;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS fetchBeveragesItems;

DELIMITER $$
CREATE PROCEDURE `fetchBeveragesItems` (IN ID_check INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM BEVERAGES WHERE Restaurant_ID = ID_check;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS fetchDessertsItems;
DELIMITER $$
CREATE PROCEDURE `fetchDessertsItems` (IN ID_check INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM DESSERTS WHERE Restaurant_ID = ID_check;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS fetchMainCourseItems;
DELIMITER $$
CREATE PROCEDURE `fetchMainCourseItems` (IN ID_check INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM MAIN_COURSE WHERE Restaurant_ID = ID_check;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS fetchSaladsItems;
DELIMITER $$
CREATE PROCEDURE `fetchSaladsItems` (IN ID_check INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
SELECT * FROM SALADS WHERE Restaurant_ID = ID_check;
commit;
END$$appetizer
DELIMITER ;



-- Procedure to insert items in the menu

drop procedure IF EXISTS insertAppetizerItems;
DELIMITER $$
CREATE PROCEDURE `insertAppetizerItems` (IN RestaurantID INT,IN Dishname_check varchar(50),
 IN Price_check decimal(4,2) , IN _cuisineId INT, IN ingredients_check varchar(100), 
 IN description_check varchar(100),IN _ImageUrl VARCHAR(500))
BEGIN
DECLARE newID INT;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO APPETIZER (Restaurant_ID, Name, Price, Cuisine_ID, Main_Ingredients, 
Description,ImageURL) 
VALUES (RestaurantID,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_ImageUrl);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM APPETIZER WHERE ID=newID;
commit;
END$$
DELIMITER ;


drop procedure IF EXISTS insertBeveragesItems;
DELIMITER $$
CREATE PROCEDURE `insertBeveragesItems` (IN RestaurantID INT,IN Dishname_check varchar(50),
 IN Price_check decimal(4,2) , IN _cuisineId INT, IN ingredients_check varchar(100), 
 IN description_check varchar(100),IN _ImageUrl VARCHAR(500))
BEGIN
DECLARE newID INT;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO BEVERAGES (Restaurant_ID, Name, Price, Cuisine_ID, Main_Ingredients, 
Description,ImageURL) 
VALUES (RestaurantID,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_ImageUrl);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM BEVERAGES WHERE ID=newID;
commit;
END$$
DELIMITER ;


drop procedure IF EXISTS insertDessertsItems;
DELIMITER $$
CREATE PROCEDURE `insertDessertsItems` (IN RestaurantID INT,IN Dishname_check varchar(50),
 IN Price_check decimal(4,2) , IN _cuisineId INT, IN ingredients_check varchar(100), 
 IN description_check varchar(100),IN _ImageUrl VARCHAR(500))
BEGIN
declare newID INT;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO DESSERTS (Restaurant_ID, Name, Price, Cuisine_ID, Main_Ingredients, 
Description,ImageURL) 
VALUES (RestaurantID,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_ImageUrl);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM DESSERTS WHERE ID=newID;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS insertMainCourseItems;
DELIMITER $$
CREATE PROCEDURE `insertMainCourseItems` (IN RestaurantID INT,IN Dishname_check varchar(50),
 IN Price_check decimal(4,2) , IN _cuisineId INT, IN ingredients_check varchar(100), 
 IN description_check varchar(100),IN _ImageUrl VARCHAR(500))
BEGIN
declare newID INT;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO MAIN_COURSE (Restaurant_ID, Name, Price, Cuisine_ID, Main_Ingredients, 
Description,ImageURL) 
VALUES (RestaurantID,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_ImageUrl);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM MAIN_COURSE WHERE ID=newID;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS insertSaladsItems;
DELIMITER $$
CREATE PROCEDURE `insertSaladsItems` (IN RestaurantID INT,IN Dishname_check varchar(50),
 IN Price_check decimal(4,2) , IN _cuisineId INT, IN ingredients_check varchar(100), 
 IN description_check varchar(100),IN _ImageUrl VARCHAR(500))
BEGIN
declare newId INT;
declare exit handler for sqlexception rollback;
start transaction;
INSERT INTO SALADS (Restaurant_ID, Name, Price, Cuisine_ID, Main_Ingredients, 
Description,ImageURL) 
VALUES (RestaurantID,Dishname_check, Price_check, _cuisineId, ingredients_check, description_check,_ImageUrl);
set newID =(SELECT LAST_INSERT_ID());
SELECT * FROM SALADS WHERE ID=newID;
commit;
END$$
DELIMITER ;




-- Procedure to delete items from Menu
drop procedure IF EXISTS deleteAppetizerItems;
DELIMITER $$
CREATE PROCEDURE `deleteAppetizerItems` (IN ID_check bigint, IN FoodId INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM APPETIZER WHERE RestaurantID = ID_check AND ID = FoodId;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS deleteBeveragesItems;
DELIMITER $$
CREATE PROCEDURE `deleteBeveragesItems` (IN ID_check bigint, IN FoodId INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM BEVERAGES WHERE RestaurantID = ID_check AND ID = FoodId;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS deleteDessertsItems;
DELIMITER $$
CREATE PROCEDURE `deleteDessertsItems` (IN ID_check bigint, IN FoodId INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM DESSERTS WHERE RestaurantID = ID_check AND ID = FoodId;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS deleteMainCourseItems;
DELIMITER $$
CREATE PROCEDURE `deleteMainCourseItems` (IN ID_check bigint, IN FoodId INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM MAIN_COURSE WHERE RestaurantID = ID_check AND ID = FoodId;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS deleteSaladsItems;
DELIMITER $$
CREATE PROCEDURE `deleteSaladsItems` (IN ID_check bigint, IN FoodId INT)
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
DELETE FROM SALADS WHERE RestaurantID = ID_check AND ID = FoodId;
commit;
END$$
DELIMITER ;


-- Procedure to update food items

drop procedure IF EXISTS updateAppetizerItems;
DELIMITER $$
CREATE PROCEDURE `updateAppetizerItems` (IN _ID INT,IN _Resto_ID INT, IN _Name VARCHAR(50),
IN _Main_Ingredients VARCHAR(100), IN _Price DECIMAL(4,2),IN _Cuisine_ID INT ,
IN _Description VARCHAR(100), IN _ImageUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE APPETIZER 
set Name=_Name, Main_Ingredients=_Main_Ingredients, Price=_Price, 
Cuisine_ID=_Cuisine_ID, Description=_Description ,ImageURL=_ImageUrl
where ID=_ID and Restaurant_ID=_Resto_ID;
commit;
END$$

DELIMITER ;

drop procedure IF EXISTS updateBeveragesItems;
DELIMITER $$
CREATE PROCEDURE `updateBeveragesItems` (IN _ID INT,IN _Resto_ID INT, IN _Name VARCHAR(50),
IN _Main_Ingredients VARCHAR(100), IN _Price DECIMAL(4,2),IN _Cuisine_ID INT ,
IN _Description VARCHAR(100), IN _ImageUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE BEVERAGES 
set Name=_Name, Main_Ingredients=_Main_Ingredients, Price=_Price, 
Cuisine_ID=_Cuisine_ID, Description=_Description ,ImageURL=_ImageUrl
where ID=_ID and Restaurant_ID=_Resto_ID;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS updateDessertItems;
DELIMITER $$
CREATE PROCEDURE `updateDessertItems` (IN _ID INT,IN _Resto_ID INT, IN _Name VARCHAR(50),
IN _Main_Ingredients VARCHAR(100), IN _Price DECIMAL(4,2),IN _Cuisine_ID INT ,
IN _Description VARCHAR(100), IN _ImageUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE DESSERTS 
set Name=_Name, Main_Ingredients=_Main_Ingredients, Price=_Price, 
Cuisine_ID=_Cuisine_ID, Description=_Description ,ImageURL=_ImageUrl
where ID=_ID and Restaurant_ID=_Resto_ID;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS updateMainCourseItems;
DELIMITER $$
CREATE PROCEDURE `updateMainCourseItems` (IN _ID INT,IN _Resto_ID INT, IN _Name VARCHAR(50),
IN _Main_Ingredients VARCHAR(100), IN _Price DECIMAL(4,2),IN _Cuisine_ID INT ,
IN _Description VARCHAR(100), IN _ImageUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE MAIN_COURSE 
set Name=_Name, Main_Ingredients=_Main_Ingredients, Price=_Price, 
Cuisine_ID=_Cuisine_ID, Description=_Description ,ImageURL=_ImageUrl
where ID=_ID and Restaurant_ID=_Resto_ID;
commit;
END$$
DELIMITER ;

drop procedure IF EXISTS updateSaladsItems;
DELIMITER $$
CREATE PROCEDURE `updateSaladsItems` (IN _ID INT,IN _Resto_ID INT, IN _Name VARCHAR(50),
IN _Main_Ingredients VARCHAR(100), IN _Price DECIMAL(4,2),IN _Cuisine_ID INT ,
IN _Description VARCHAR(100), IN _ImageUrl VARCHAR(500))
BEGIN
declare exit handler for sqlexception rollback;
start transaction;
UPDATE SALADS 
set Name=_Name, Main_Ingredients=_Main_Ingredients, Price=_Price, 
Cuisine_ID=_Cuisine_ID, Description=_Description ,ImageURL=_ImageUrl
where ID=_ID and Restaurant_ID=_Resto_ID;
commit;
END$$
DELIMITER ;
