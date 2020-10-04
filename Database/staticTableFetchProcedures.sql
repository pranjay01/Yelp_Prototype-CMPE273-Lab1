drop procedure if EXISTS getSignupMasterData;
delimiter $$

create procedure getSignupMasterData()
begin
	select ID,Name,Country_Code from COUNTRY order by ID asc;
    
    select ID,Name from STATE order by Name asc;
    
end $$

delimiter ;


drop procedure IF EXISTS getSignupMasterDataCustomer;
delimiter $$

create procedure getSignupMasterDataCustomer()
begin
	select ID,Gender from GENDER_LIST order by ID asc;
    
end $$

delimiter ;