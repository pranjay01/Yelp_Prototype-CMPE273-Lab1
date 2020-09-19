drop procedure getSignupMasterData
delimiter $$

create procedure getSignupMasterData()
begin
	select ID,Name,Country_Code from COUNTRY order by ID asc;
    
    select ID,Name from COUNTRY order by Name asc;
    
end $$

delimiter ;