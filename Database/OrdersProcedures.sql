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
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL 
    as ImageUrl, concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName,
    date_format(Date, '%D %M, %Y %I:%i %p')  as OrderedTime, Order_Type, 	
    Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , 
    Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId;
end if;
if OrderType='New' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL as ImageUrl,
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, 
    date_format(Date, '%D %M, %Y %I:%i %p')  as OrderedTime, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId and Delivery_Status<5;
end if;
if OrderType='Delivered' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, CUSTOMER.ImageURL as ImageUrl,
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, 
    date_format(Date, '%D %M, %Y %I:%i %p')  as OrderedTime, Order_Type, 
	Delivery_Status as DeliverStatusID,DELIVERY_STATUS.Status as DeliverStatusValue , Bill
	FROM ORDERS LEFT JOIN CUSTOMER ON CUSTOMER.Customer_ID=ORDERS.Customer_ID 
	LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
	WHERE Restaurant_ID=RestroId and (Delivery_Status=6 or Delivery_Status=5);
end if;
if OrderType='Canceled' Then
	select ORDERS.ID as ID, CUSTOMER.Customer_ID as CustomerID, 
	concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name) as CustomerName, 
    date_format(Date, '%D %M, %Y %I:%i %p')  as OrderedTime, Order_Type, 
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

SELECT * FROM SALADS WHERE Restaurant_ID=RestroId;

SELECT * FROM DESSERTS WHERE Restaurant_ID=RestroId;

SELECT * FROM MAIN_COURSE WHERE Restaurant_ID=RestroId;


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


-- Order Creation

drop procedure  if exists generateOrder;

DELIMITER  $$
CREATE PROCEDURE `generateOrder`
(IN _Restaurant_ID INT,IN _Customer_ID INT,IN _Order_Type enum('Delivery','Pick_up'),IN _Ordered_Dishes VARCHAR(1000)
,IN _Bill DECIMAL(5,2),IN _Address VARCHAR(100))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

INSERT INTO ORDERS(Restaurant_ID,Customer_ID,Order_Type,Delivery_Status,Ordered_Dishes
,Bill,Date,Address)
Values(_Restaurant_ID,_Customer_ID,_Order_Type,1,_Ordered_Dishes,_Bill,NOW(),_Address);


commit;
END  $$



-- Procedure to get order details of the customer

drop procedure  if exists getAllOrdersPlacedByCustomer;

DELIMITER  $$
CREATE PROCEDURE `getAllOrdersPlacedByCustomer`
(IN cusId INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

select ORDERS.ID as ID, date_format(Date, '%D %M, %Y %I:%i %p')  as OrderedTime, Order_Type as OrderType,
DELIVERY_STATUS.Status as DeliverStatusValue , Bill, Restaurant_ID as restroId
FROM ORDERS 
LEFT JOIN DELIVERY_STATUS ON (DELIVERY_STATUS.ID=Delivery_Status)
WHERE Customer_ID=cusId;

commit;
END  $$