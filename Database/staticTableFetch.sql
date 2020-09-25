drop procedure if exists getSignupMasterData;
delimiter $$

create procedure getSignupMasterData()
begin
	select ID,Name,Country_Code from COUNTRY order by ID asc;
    
    select ID,Name from STATE order by Name asc;
    
    select ID,Options from DELIVERY_OPTIONS order by Options asc;
    
end $$

delimiter ;



drop procedure if exists getCusinesForMenuQuery;
delimiter $$

create procedure getCusinesForMenuQuery()
begin
	select ID,Category from CUISINES order by Category asc;
    
    
end $$

delimiter ;


drop procedure if exists getDeliverStatusDELIVERY_STATUS;
delimiter $$

create procedure getDeliverStatus()
begin
	select ID,Status from DELIVERY_STATUS order by ID asc;
    
    
end $$

delimiter ;


