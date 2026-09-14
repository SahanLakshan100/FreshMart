IF DB_ID(N'FreshMartDb') IS NULL
    THROW 50000, 'FreshMartDb does not exist. Create the database first, then run this update script.', 1;
GO

USE FreshMartDb;
GO

-- WARNING: this permanently deletes all catalog, user, and order records.
DROP TABLE IF EXISTS dbo.Orders;
DROP TABLE IF EXISTS dbo.Cart;
DROP TABLE IF EXISTS dbo.Products;
DROP TABLE IF EXISTS dbo.Users;
DROP TABLE IF EXISTS dbo.Categories;
GO

-- Recreate the schema and reload the current catalog seed.
:r backend/database.sql
