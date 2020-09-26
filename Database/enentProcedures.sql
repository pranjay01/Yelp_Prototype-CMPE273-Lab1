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