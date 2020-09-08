-- Constraints 

-- Private keys

ALTER TABLE DELIVERY_OPTIONS
ADD CONSTRAINT PK_Delivery_Options PRIMARY KEY (ID);

ALTER TABLE MENU_CATEGORY
ADD CONSTRAINT PK_Menu_Category PRIMARY KEY (ID);

ALTER TABLE CUISINES
ADD CONSTRAINT PK_Cuisines PRIMARY KEY (ID);

ALTER TABLE COUNTRY
ADD CONSTRAINT PK_Country PRIMARY KEY (ID);

ALTER TABLE STATE
ADD CONSTRAINT PK_State PRIMARY KEY (ID);

ALTER TABLE DELIVERY_STATUS
ADD CONSTRAINT PK_Delivery_Status PRIMARY KEY (ID);

ALTER TABLE SIGNUP
ADD CONSTRAINT PK_Signup PRIMARY KEY (ID);

ALTER TABLE RESTURANT
ADD CONSTRAINT PK_Resturant PRIMARY KEY (ID);

ALTER TABLE DELIVERY_TYPE_RESTURANT_MAPPINGS
ADD CONSTRAINT PK_Delivery_Type_Resturant_Mapping PRIMARY KEY (Delivery_ID,Resturant_ID);

ALTER TABLE APPETIZER
ADD CONSTRAINT PK_Appetizer PRIMARY KEY (ID);

ALTER TABLE SALADS
ADD CONSTRAINT PK_Salads PRIMARY KEY (ID);

ALTER TABLE DESSERTS
ADD CONSTRAINT PK_Desserts PRIMARY KEY (ID);

ALTER TABLE BEVERAGES
ADD CONSTRAINT PK_Beverages PRIMARY KEY (ID);

ALTER TABLE MAIN_COURSE
ADD CONSTRAINT PK_Main_Course PRIMARY KEY (ID);

ALTER TABLE REVIEWS
ADD CONSTRAINT PK_Reviews PRIMARY KEY (ID);

ALTER TABLE ORDERS
ADD CONSTRAINT PK_Orders PRIMARY KEY (ID);

ALTER TABLE EVENTS
ADD CONSTRAINT PK_Events PRIMARY KEY (ID);

ALTER TABLE REGISTERATION
ADD CONSTRAINT PK_Registeration PRIMARY KEY (Event_ID,Customer_ID);

ALTER TABLE CUSTOMER
ADD CONSTRAINT PK_Customer PRIMARY KEY (ID);

-- ALTER TABLE SocialMedia
-- ADD CONSTRAINT PK_Social_Media PRIMARY KEY (Customer_ID,Media_Type);
-- 
ALTER TABLE FAVOURITES
ADD CONSTRAINT PK_Favourites PRIMARY KEY (Customer_ID,Resturant_ID);


-- Autoincrement constraint added

ALTER TABLE DELIVERY_OPTIONS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE MENU_CATEGORY MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE CUISINES MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE COUNTRY MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE STATE MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE DELIVERY_STATUS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE SIGNUP MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE RESTURANT MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE APPETIZER MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE SALADS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE DESSERTS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE BEVERAGES MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE MAIN_COURSE MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE REVIEWS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE ORDERS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE EVENTS MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE CUSTOMER MODIFY ID INTEGER NOT NULL AUTO_INCREMENT;



-- Foreign Keys

 -- RESTURANT
ALTER TABLE RESTURANT
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES SIGNUP (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE RESTURANT
ADD FOREIGN KEY (Country_ID)
  REFERENCES COUNTRY (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE RESTURANT
ADD FOREIGN KEY (State_ID)
  REFERENCES STATE (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE RESTURANT
ADD FOREIGN KEY (Country_Code)
  REFERENCES COUNTRY (Country_Code)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;


-- DELIVERY_TYPE_RESTURANT_MAPPINGS
ALTER TABLE DELIVERY_TYPE_RESTURANT_MAPPINGS
ADD FOREIGN KEY (Delivery_ID)
  REFERENCES DELIVERY_OPTIONS (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE DELIVERY_TYPE_RESTURANT_MAPPINGS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
-- APPETIZER
ALTER TABLE APPETIZER
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE APPETIZER
ADD FOREIGN KEY (Cuisine_ID)
  REFERENCES CUISINES (ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
  
-- SALADS
ALTER TABLE SALADS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE SALADS
ADD FOREIGN KEY (Cuisine_ID)
  REFERENCES CUISINES (ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
  
-- DESSERTS
ALTER TABLE DESSERTS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE DESSERTS
ADD FOREIGN KEY (Cuisine_ID)
  REFERENCES CUISINES (ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
  
  
-- BEVERAGES
ALTER TABLE BEVERAGES
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE BEVERAGES
ADD FOREIGN KEY (Cuisine_ID)
  REFERENCES CUISINES (ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
  
-- MAIN_COURSE
ALTER TABLE MAIN_COURSE
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE MAIN_COURSE
ADD FOREIGN KEY (Cuisine_ID)
  REFERENCES CUISINES (ID)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
  
  
-- REVIEWS
ALTER TABLE REVIEWS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE REVIEWS
ADD FOREIGN KEY (Customer_ID)
  REFERENCES CUSTOMER (Customer_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
  
-- ORDERS
ALTER TABLE ORDERS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE ORDERS
ADD FOREIGN KEY (Customer_ID)
  REFERENCES CUSTOMER (Customer_ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE ORDERS
ADD FOREIGN KEY (Delivery_Status)
  REFERENCES DELIVERY_STATUS (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  

-- EVENTS
ALTER TABLE EVENTS
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE EVENTS
ADD FOREIGN KEY (Country_ID)
  REFERENCES COUNTRY (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE EVENTS
ADD FOREIGN KEY (State_ID)
  REFERENCES STATE (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
  
-- REGISTERATION
ALTER TABLE REGISTERATION
ADD FOREIGN KEY (Customer_ID)
  REFERENCES CUSTOMER (Customer_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE REGISTERATION
ADD FOREIGN KEY (Event_ID)
  REFERENCES EVENTS (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
  
 -- CUSTOMER
ALTER TABLE CUSTOMER
ADD FOREIGN KEY (Customer_ID)
  REFERENCES SIGNUP (ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE CUSTOMER
ADD FOREIGN KEY (Country_ID)
  REFERENCES COUNTRY (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE CUSTOMER
ADD FOREIGN KEY (State_ID)
  REFERENCES STATE (ID)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE CUSTOMER
ADD FOREIGN KEY (Country_Code)
  REFERENCES COUNTRY (Country_Code)
  -- ON DELETE CASCADE
  ON UPDATE CASCADE;


-- FAVOURITES
ALTER TABLE FAVOURITES
ADD FOREIGN KEY (Resturant_ID)
  REFERENCES RESTURANT (Resturant_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
ALTER TABLE FAVOURITES
ADD FOREIGN KEY (Customer_ID)
  REFERENCES CUSTOMER (Customer_ID)
  ON DELETE CASCADE
  ON UPDATE CASCADE;