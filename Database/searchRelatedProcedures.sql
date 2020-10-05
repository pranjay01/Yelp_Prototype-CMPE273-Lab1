
-- procedure to fetch STrings For Search
drop procedure  if exists fetchSTringsForSearch;

DELIMITER  $$
CREATE PROCEDURE `fetchSTringsForSearch`
()
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

select Distinct(Name) from RESTAURANT;

SELECT DISTINCT(Name) FROM APPETIZER UNION SELECT DISTINCT(Name) FROM BEVERAGES UNION 
SELECT DISTINCT(Name) FROM DESSERTS UNION SELECT DISTINCT(Name) FROM MAIN_COURSE UNION 
SELECT DISTINCT(Name) FROM  SALADS;

SELECT DISTINCT(Category) as Name FROM CUISINES;

SELECT CONCAT(STATE.Name,', ',City,', ',Street,' ,',Zip) as Name FROM RESTAURANT JOIN STATE
ON STATE.ID= RESTAURANT.State_ID;

commit;
END  $$





-- procedure to fetch Restaurant Results
drop procedure  if exists fetchRestaurantResults;

DELIMITER  $$
CREATE PROCEDURE `fetchRestaurantResults`
(IN _filterCriteria VARCHAR(100), IN _searchedString VARCHAR(100))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
 IF _filterCriteria='1' THEN
SELECT RESTAURANT.Restaurant_ID as ID, RESTAURANT.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,TIME_FORMAT(RESTAURANT.Opening_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
count(REVIEWS.ID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Rating),0)) as AvgRating,
RESTAURANT.Latitude as lat, RESTAURANT.Longitude as lng
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.Restaurant_ID=RESTAURANT.Restaurant_ID
WHERE RESTAURANT.Restaurant_ID IN (
SELECT Restaurant_ID FROM RESTAURANT where Name like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.Restaurant_ID, RESTAURANT.Name,
RESTAURANT.Opening_Time, RESTAURANT.Closing_Time;

ELSEIF _filterCriteria='2' THEN
SELECT RESTAURANT.Restaurant_ID as ID, RESTAURANT.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Opening_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
count(REVIEWS.ID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Rating),0)) as AvgRating,
RESTAURANT.Latitude as lat, RESTAURANT.Longitude as lng
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.Restaurant_ID=RESTAURANT.Restaurant_ID
WHERE RESTAURANT.Restaurant_ID IN (
SELECT Restaurant_ID FROM APPETIZER where Name like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM BEVERAGES where Name like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM MAIN_COURSE where Name like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM DESSERTS where Name like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM SALADS where Name like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.Restaurant_ID, RESTAURANT.Name,
RESTAURANT.Opening_Time, RESTAURANT.Closing_Time;

ELSEIF _filterCriteria='3' THEN

SELECT RESTAURANT.Restaurant_ID as ID, RESTAURANT.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Opening_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime,  
count(REVIEWS.ID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Rating),0)) as AvgRating,
RESTAURANT.Latitude as lat, RESTAURANT.Longitude as lng
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.Restaurant_ID=RESTAURANT.Restaurant_ID
WHERE RESTAURANT.Restaurant_ID IN (
SELECT Restaurant_ID FROM APPETIZER JOIN CUISINES ON CUISINES.ID=APPETIZER.Cuisine_ID 
where Category like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM BEVERAGES JOIN CUISINES ON CUISINES.ID=BEVERAGES.Cuisine_ID 
where Category like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM MAIN_COURSE JOIN CUISINES ON CUISINES.ID=MAIN_COURSE.Cuisine_ID 
where Category like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM DESSERTS JOIN CUISINES ON CUISINES.ID=DESSERTS.Cuisine_ID 
where Category like  CONCAT('%', _searchedString , '%') UNION
SELECT Restaurant_ID FROM SALADS JOIN CUISINES ON CUISINES.ID=SALADS.Cuisine_ID 
where Category like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.Restaurant_ID, RESTAURANT.Name,
RESTAURANT.Opening_Time, RESTAURANT.Closing_Time;

ELSE 

SELECT RESTAURANT.Restaurant_ID as ID, RESTAURANT.Name as Name, 
IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=1),false) 
as CurbsidePickup, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=2),false) 
as DineIn, IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=3),false) 
as YelpDelivery,RESTAURANT.ImageURL as ImageUrl,
TIME_FORMAT(RESTAURANT.Opening_Time, "%h:%i %p") 
 as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime,  
count(REVIEWS.ID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Rating),0)) as AvgRating,
RESTAURANT.Latitude as lat, RESTAURANT.Longitude as lng
FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.Restaurant_ID=RESTAURANT.Restaurant_ID
WHERE RESTAURANT.Restaurant_ID IN (
SELECT Restaurant_ID FROM RESTAURANT JOIN STATE ON STATE.ID=State_ID where concat(STATE.NAME,City,Zip,Street) 
like  CONCAT('%', _searchedString , '%')
)
 GROUP BY RESTAURANT.Restaurant_ID, RESTAURANT.Name,
RESTAURANT.Opening_Time, RESTAURANT.Closing_Time;
END IF;

commit;
END  $$


-- 
drop procedure  if exists fetchRestaurantProfileForCustomer;
 delimiter $$
 
 create procedure `fetchRestaurantProfileForCustomer`(IN RestroId INT)
 begin
 declare exit handler for sqlexception rollback;
 start transaction;
 
 SELECT RESTAURANT.Restaurant_ID as ID, RESTAURANT.Name as Name, 
 IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
 DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=1),false) 
 as CurbsidePickup, 
 IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
 DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=2),false) 
 as DineIn, 
 IFNULL((SELECT true FROM DELIVERY_TYPE_RESTAURANT_MAPPINGS WHERE 
 DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=RESTAURANT.Restaurant_ID and Delivery_ID=3),false) 
 as YelpDelivery,
 RESTAURANT.ImageURL as ImageUrl,TIME_FORMAT(RESTAURANT.Opening_Time, "%h:%i %p") 
  as OpeningTime,TIME_FORMAT(RESTAURANT.Closing_Time, "%h:%i %p")  as ClosingTime, 
 count(REVIEWS.ID) as ReviewCounts, round(IFNULL(avg(REVIEWS.Rating),0)) as AvgRating
 FROM  RESTAURANT LEFT JOIN REVIEWS ON REVIEWS.Restaurant_ID=RESTAURANT.Restaurant_ID
 WHERE RESTAURANT.Restaurant_ID = RestroId;
 
 commit;
 end $$



-- Fetch menu for order
drop procedure  if exists menuFetchForOrder;
delimiter $$

create procedure `menuFetchForOrder`(IN RestroId INT)
begin
declare exit handler for sqlexception rollback;
start transaction;

SELECT APPETIZER.ID as ID, Name, Main_Ingredients as Ingredients, CUISINES.Category as cuisine,
Description, Price 
FROM APPETIZER LEFT JOIN CUISINES ON CUISINES.ID=Cuisine_ID
WHERE Restaurant_ID=RestroId;


SELECT BEVERAGES.ID as ID, Name, Main_Ingredients as Ingredients, CUISINES.Category as cuisine,
Description, Price 
FROM BEVERAGES LEFT JOIN CUISINES ON CUISINES.ID=Cuisine_ID
WHERE Restaurant_ID=RestroId;


SELECT MAIN_COURSE.ID as ID, Name, Main_Ingredients as Ingredients, CUISINES.Category as cuisine,
Description, Price 
FROM MAIN_COURSE LEFT JOIN CUISINES ON CUISINES.ID=Cuisine_ID
WHERE Restaurant_ID=RestroId;


SELECT SALADS.ID as ID, Name, Main_Ingredients as Ingredients, CUISINES.Category as cuisine,
Description, Price 
FROM SALADS LEFT JOIN CUISINES ON CUISINES.ID=Cuisine_ID
WHERE Restaurant_ID=RestroId;


SELECT DESSERTS.ID as ID, Name, Main_Ingredients as Ingredients, CUISINES.Category as cuisine,
Description, Price 
FROM DESSERTS LEFT JOIN CUISINES ON CUISINES.ID=Cuisine_ID
WHERE Restaurant_ID=RestroId;


commit;
end $$