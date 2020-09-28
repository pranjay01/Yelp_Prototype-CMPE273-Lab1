DROP VIEW IF EXISTS COMBINED_TABLE_DATA_VIEW_FOR_SEARCH;


CREATE VIEW COMBINED_TABLE_DATA_VIEW_FOR_SEARCH AS
SELECT Uni.Restaurant_ID as RestroId,Uni.Name as FoodName,RESTAURANT.Name as RestroName,
Category,City,Zip,Street,Options  FROM 
(SELECT Restaurant_ID,Name,Cuisine_ID FROM BEVERAGES UNION 
SELECT Restaurant_ID,Name,Cuisine_ID FROM  APPETIZER UNION 
SELECT Restaurant_ID,Name,Cuisine_ID FROM DESSERTS UNION 
SELECT Restaurant_ID,Name,Cuisine_ID FROM MAIN_COURSE UNION 
SELECT Restaurant_ID,Name,Cuisine_ID FROM SALADS
) as Uni JOIN CUISINES ON CUISINES.ID=Uni.Cuisine_ID
JOIN RESTAURANT ON RESTAURANT.Restaurant_ID=Uni.Restaurant_ID
JOIN DELIVERY_TYPE_RESTAURANT_MAPPINGS ON 
DELIVERY_TYPE_RESTAURANT_MAPPINGS.Restaurant_ID=Uni.Restaurant_ID
JOIN DELIVERY_OPTIONS ON DELIVERY_OPTIONS.ID=DELIVERY_TYPE_RESTAURANT_MAPPINGS.Delivery_ID


DROP VIEW IF EXISTS FINAL_CONCATINATED_TABLE;

CREATE VIEW FINAL_CONCATINATED_TABLE AS
SELECT combinedFood.RestroId,combinedFood.RestroName,Food,
Delivery,Category,NameLocation FROM 
((SELECT RestroId,RestroName,GROUP_CONCAT(distinct(FoodName) ) as Food FROM 
COMBINED_TABLE_DATA_VIEW_FOR_SEARCH GROUP BY RestroId) as combinedFood JOIN 
(SELECT RestroId,RestroName,GROUP_CONCAT(distinct(Options)) as Delivery
FROM COMBINED_TABLE_DATA_VIEW_FOR_SEARCH GROUP BY RestroId) as CombinedDelivery
ON combinedFood.RestroId=CombinedDelivery.RestroId JOIN 
(SELECT RestroId,RestroName,GROUP_CONCAT(distinct(Category)) as Category
FROM COMBINED_TABLE_DATA_VIEW_FOR_SEARCH GROUP BY RestroId)as CombinedCategory
ON combinedFood.RestroId=CombinedCategory.RestroId JOIN 
(SELECT RestroId,RestroName,CONCAT(RestroName, City,Zip,Street) as NameLocation 
FROM COMBINED_TABLE_DATA_VIEW_FOR_SEARCH GROUP BY RestroId) 
as CombinedNameLocation ON combinedFood.RestroId=CombinedNameLocation.RestroId) ;


-- Procedure For Search Tab


drop procedure  if exists getSearchTabResults;

DELIMITER  $$
CREATE PROCEDURE `getSearchTabResults`
(IN _EventID INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

SELECT RestroId, RestroName, Concat(NameLocation,Delivery,Category,Food)
FROM FINAL_CONCATINATED_TABLE;

commit;
END  $$