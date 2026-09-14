IF DB_ID(N'FreshMartDb') IS NULL
    THROW 50000, 'FreshMartDb does not exist. Create the database first, then run this update script.', 1;
GO

USE FreshMartDb;
GO

IF COL_LENGTH(N'dbo.Orders', N'CustomerName') IS NULL
    ALTER TABLE dbo.Orders ADD CustomerName NVARCHAR(150) NOT NULL CONSTRAINT DF_Orders_CustomerName DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'CustomerEmail') IS NULL
    ALTER TABLE dbo.Orders ADD CustomerEmail NVARCHAR(320) NOT NULL CONSTRAINT DF_Orders_CustomerEmail DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'CustomerPhone') IS NULL
    ALTER TABLE dbo.Orders ADD CustomerPhone NVARCHAR(40) NOT NULL CONSTRAINT DF_Orders_CustomerPhone DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'ShippingAddress') IS NULL
    ALTER TABLE dbo.Orders ADD ShippingAddress NVARCHAR(500) NOT NULL CONSTRAINT DF_Orders_ShippingAddress DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'ShippingCity') IS NULL
    ALTER TABLE dbo.Orders ADD ShippingCity NVARCHAR(150) NOT NULL CONSTRAINT DF_Orders_ShippingCity DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'ShippingPostalCode') IS NULL
    ALTER TABLE dbo.Orders ADD ShippingPostalCode NVARCHAR(30) NOT NULL CONSTRAINT DF_Orders_ShippingPostalCode DEFAULT N'';
IF COL_LENGTH(N'dbo.Orders', N'TotalItems') IS NULL
    ALTER TABLE dbo.Orders ADD TotalItems INT NOT NULL CONSTRAINT DF_Orders_TotalItems DEFAULT 0;
IF COL_LENGTH(N'dbo.Orders', N'Subtotal') IS NULL
    ALTER TABLE dbo.Orders ADD Subtotal DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_Subtotal DEFAULT 0;
IF COL_LENGTH(N'dbo.Orders', N'Delivery') IS NULL
    ALTER TABLE dbo.Orders ADD Delivery DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_Delivery DEFAULT 0;
IF COL_LENGTH(N'dbo.Orders', N'Total') IS NULL
    ALTER TABLE dbo.Orders ADD Total DECIMAL(18,2) NOT NULL CONSTRAINT DF_Orders_Total DEFAULT 0;
GO

UPDATE dbo.Orders
SET CustomerName = COALESCE(NULLIF(JSON_VALUE(CustomerJson, '$.name'), N''), N'Unknown customer'),
    CustomerEmail = COALESCE(NULLIF(JSON_VALUE(CustomerJson, '$.email'), N''), N''),
    CustomerPhone = COALESCE(NULLIF(JSON_VALUE(CustomerJson, '$.phone'), N''), N''),
    ShippingAddress = COALESCE(NULLIF(JSON_VALUE(ShippingJson, '$.address'), N''), N''),
    ShippingCity = COALESCE(NULLIF(JSON_VALUE(ShippingJson, '$.city'), N''), N''),
    ShippingPostalCode = COALESCE(NULLIF(JSON_VALUE(ShippingJson, '$.postal'), N''), N''),
    TotalItems = COALESCE(TRY_CONVERT(INT, JSON_VALUE(TotalsJson, '$.totalItems')), 0),
    Subtotal = COALESCE(TRY_CONVERT(DECIMAL(18,2), JSON_VALUE(TotalsJson, '$.subtotal')), 0),
    Delivery = COALESCE(TRY_CONVERT(DECIMAL(18,2), JSON_VALUE(TotalsJson, '$.delivery')), 0),
    Total = COALESCE(TRY_CONVERT(DECIMAL(18,2), JSON_VALUE(TotalsJson, '$.total')), 0);
GO

IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems (
        Id INT IDENTITY(1,1) CONSTRAINT PK_OrderItems PRIMARY KEY,
        OrderId INT NOT NULL,
        ProductId INT NOT NULL,
        ProductName NVARCHAR(250) NOT NULL,
        UnitPrice DECIMAL(18,2) NOT NULL,
        Quantity INT NOT NULL,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId)
            REFERENCES dbo.Orders(Id)
            ON DELETE CASCADE
    );
END
GO

INSERT INTO dbo.OrderItems (OrderId, ProductId, ProductName, UnitPrice, Quantity)
SELECT orders.Id, items.ProductId, items.ProductName, items.UnitPrice, items.Quantity
FROM dbo.Orders AS orders
CROSS APPLY OPENJSON(orders.ItemsJson)
WITH (
    ProductId INT '$.id',
    ProductName NVARCHAR(250) '$.name',
    UnitPrice DECIMAL(18,2) '$.price',
    Quantity INT '$.qty'
) AS items
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.OrderItems AS existing
    WHERE existing.OrderId = orders.Id
);
GO
