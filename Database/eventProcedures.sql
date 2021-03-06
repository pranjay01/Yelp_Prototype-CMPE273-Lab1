
-- procedure to create new event
drop procedure  if exists createNewEvent;

DELIMITER  $$
CREATE PROCEDURE `createNewEvent`
(IN _Name VARCHAR(100), IN _Restaurant_ID INT, IN _Description VARCHAR(100),
IN _Date Date,IN _StartTime TIME,IN _EndTime TIME,IN _Country_ID INT,IN _State_ID INT,
IN _City VARCHAR(25),IN _Zip INT,IN _Street VARCHAR(50),IN _Hashtags VARCHAR(100))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

INSERT INTO EVENTS(Name,Restaurant_ID,Description,Date,StartTime,EndTime,
Country_ID,State_ID,City,Zip,Street,Hashtags) 
VALUES(_Name,_Restaurant_ID,_Description,_Date,_StartTime,_EndTime,
_Country_ID,_State_ID,_City,_Zip,_Street,_Hashtags);

commit;
END  $$


-- procedure to get events based on filter
drop procedure  if exists getEventList;

DELIMITER  $$
CREATE PROCEDURE `getEventList`
(IN _Restaurant_ID INT, IN _filter VARCHAR(20))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
 IF _filter='upcoming' THEN
	select EVENTS.ID as ID, EVENTS.Name as Name, Description, date_add(Date,interval 1 day) as EventDate, 
	StartTime as EventStartTime, EndTime as EventEndTime, Hashtags as hashtags,
	concat(STATE.Name,' ', City, ', ',Street, ' - ',Zip ) as Address
	FROM EVENTS
	JOIN STATE ON STATE.ID=State_ID
	WHERE Restaurant_ID=_Restaurant_ID and Date>=current_date()
	ORDER BY Date;
END IF;
 IF _filter='past' THEN
	select EVENTS.ID as ID, EVENTS.Name as Name, Description, Date as EventDate, 
	StartTime as EventStartTime, EndTime as EventEndTime, Hashtags as hashtags,
	concat(STATE.Name,' ', City, ', ',Street, ' - ',Zip ) as Address
	FROM EVENTS
	JOIN STATE ON STATE.ID=State_ID
	WHERE Restaurant_ID=_Restaurant_ID and Date<current_date()
	ORDER BY Date;
END IF;
commit;
END  $$



-- procedure to get customer List
drop procedure  if exists getRegisteredCustomers;

DELIMITER  $$
CREATE PROCEDURE `getRegisteredCustomers`
(IN _EventID INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;

select concat(CUSTOMER.First_Name, ' ', CUSTOMER.Last_Name)
 as cusName, CUSTOMER.Customer_ID as ID, Email FROM REGISTRATION JOIn CUSTOMER ON 
 CUSTOMER.Customer_ID=REGISTRATION.Customer_ID JOIN SIGNUP ON SIGNUP.ID=CUSTOMER.Customer_ID
 WHERE REGISTRATION.Event_ID=_EventID;

commit;
END  $$





-- procedure to get events based on filter
drop procedure  if exists getEventListForCustomer;

DELIMITER  $$
CREATE PROCEDURE `getEventListForCustomer`
(IN _cusId INT, IN _filter VARCHAR(20))
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
 IF _filter='upcoming' THEN
	select EVENTS.ID as ID, EVENTS.Name as Name, Description, date_add(Date,interval 1 day) as EventDate, 
	TIME_FORMAT(StartTime, "%h:%i %p") as EventStartTime, TIME_FORMAT(EndTime, "%h:%i %p") as EventEndTime, Hashtags as hashtags,
	concat(STATE.Name,' ', City, ', ',Street, ' - ',Zip ) as Address
	FROM EVENTS
	JOIN STATE ON STATE.ID=State_ID
	WHERE Date>=current_date()
	ORDER BY Date;

ELSEIF _filter='registered' THEN
	select EVENTS.ID as ID, EVENTS.Name as Name, Description, date_add(Date,interval 1 day) as EventDate, 
	StartTime as EventStartTime, EndTime as EventEndTime, Hashtags as hashtags,
	concat(STATE.Name,' ', City, ', ',Street, ' - ',Zip ) as Address
	FROM EVENTS 
	JOIN STATE ON STATE.ID=State_ID
	WHERE Date>=current_date() and EVENTS.ID IN (SELECT Event_ID as ID 
    FROM REGISTRATION WHERE Customer_ID=_cusId)
	ORDER BY Date;

ELSE 
	select EVENTS.ID as ID, EVENTS.Name as Name, Description, date_add(Date,interval 1 day) as EventDate, 
	StartTime as EventStartTime, EndTime as EventEndTime, Hashtags as hashtags,
	concat(STATE.Name,' ', City, ', ',Street, ' - ',Zip ) as Address
	FROM EVENTS 
	JOIN STATE ON STATE.ID=State_ID
	WHERE Date>=current_date() and EVENTS.ID IN (SELECT ID as ID 
    FROM EVENTS WHERE Name like CONCAT('%', _filter , '%'))
	ORDER BY Date;

END IF;
commit;
END  $$



-- procedure to register for event
drop procedure  if exists registerForEvent;

DELIMITER  $$
CREATE PROCEDURE `registerForEvent`
(IN _cusId INT, IN _eventId INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
INSERT INTO REGISTRATION(Event_ID,Customer_ID) VALUES (_eventId,_cusId);

commit;
END  $$



-- procedure to register for event
drop procedure  if exists getRegisteredEventIds;

DELIMITER  $$
CREATE PROCEDURE `getRegisteredEventIds`
(IN _cusId INT)
BEGIN
    
declare exit handler for sqlexception
rollback;
start transaction;
SELECT Event_ID as ID FROM REGISTRATION WHERE Customer_ID=_cusId;

commit;
END  $$





