-- Procedure to get order details by new order and pagination

drop procedure  if exists getOrderDetails;

DELIMITER  $$
CREATE PROCEDURE `getOrderDetails`
(IN RestroId INT, IN OrderType VARCHAR(20) )
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
if OrderType='All' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL as ImageUrl,
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, Date, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId;
end if;
if OrderType='New' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL as ImageUrl,
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, Date, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId and Delivery_Status<5;
end if;
if OrderType='Delivered' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL as ImageUrl,
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, Date, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId and (Delivery_Status=6 or Delivery_Status=5);
end if;
if OrderType='Canceled' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, 
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, Date, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId and Delivery_Status=7;
end if;
commit;
END  $$




-- Procedure to get order details by new order and pagination

drop procedure  if exists orderFetch;

DELIMITER  $$
CREATE PROCEDURE `orderFetch`
(IN RestroId INT,  IN OrderId INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

SELECT Ordered_Dishes from ORDERS where ID=OrderId and Restaurant_ID=RestroId;

SELECT * FROM APPETIZER WHERE Restaurant_ID=RestroId;

SELECT * FROM BEVERAGES WHERE Restaurant_ID=RestroId;

SELECT * FROM DESSERTS WHERE Restaurant_ID=RestroId;

SELECT * FROM MAIN_COURSE WHERE Restaurant_ID=RestroId;

SELECT * FROM SALADS WHERE Restaurant_ID=RestroId;



commit;
END  $$



drop procedure  if exists updateOrderStatus;

DELIMITER  $$
CREATE PROCEDURE `updateOrderStatus`
(IN orderID INT,  IN restroID INT, IN deliveryStatus INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

UPDATE ORDERS SET Delivery_Status=deliveryStatus
WHERE ID=orderID and Restaurant_ID=restroID;



commit;
END  $$

