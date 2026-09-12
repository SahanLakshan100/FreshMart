IF DB_ID(N'FreshMartDb') IS NULL
    CREATE DATABASE FreshMartDb;
GO

USE FreshMartDb;
GO

IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Categories PRIMARY KEY,
        Slug NVARCHAR(100) NOT NULL CONSTRAINT UQ_Categories_Slug UNIQUE,
        Label NVARCHAR(150) NOT NULL,
        Icon NVARCHAR(100) NOT NULL CONSTRAINT DF_Categories_Icon DEFAULT N'fas fa-tag',
        Image NVARCHAR(1000) NOT NULL
    );
END
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Products PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Price DECIMAL(18,2) NOT NULL CONSTRAINT CK_Products_Price CHECK (Price >= 0),
        Unit NVARCHAR(50) NOT NULL,
        Featured BIT NOT NULL CONSTRAINT DF_Products_Featured DEFAULT 0,
        Image NVARCHAR(1000) NOT NULL,
        CategoryId INT NOT NULL CONSTRAINT FK_Products_Categories REFERENCES dbo.Categories(Id)
    );
    CREATE INDEX IX_Products_Name ON dbo.Products(Name);
END
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Users PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        Email NVARCHAR(320) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        Role NVARCHAR(20) NOT NULL CONSTRAINT CK_Users_Role CHECK (Role IN ('customer', 'admin')),
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Orders PRIMARY KEY,
        OrderId NVARCHAR(40) NOT NULL CONSTRAINT UQ_Orders_OrderId UNIQUE,
        CustomerJson NVARCHAR(MAX) NOT NULL,
        ShippingJson NVARCHAR(MAX) NOT NULL,
        Payment NVARCHAR(40) NOT NULL,
        ItemsJson NVARCHAR(MAX) NOT NULL,
        TotalsJson NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Categories)
BEGIN
    INSERT INTO dbo.Categories (Slug, Label, Icon, Image) VALUES
    (N'desserts', N'Desserts', N'fas fa-ice-cream', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/CDE.png'),
    (N'snacks', N'Snacks', N'fas fa-cookie-bite', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GSN.png'),
    (N'biscuits', N'Biscuits', N'fas fa-cookie', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GBS.png'),
    (N'coffee', N'Coffee', N'fas fa-mug-hot', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/BCF.png'),
    (N'eggs', N'Eggs', N'fas fa-egg', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GC3.png'),
    (N'bakery', N'Bakery', N'fas fa-bread-slice', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/GW2.png'),
    (N'family-beverages', N'Family Consumption Beverages', N'fas fa-bottle-water', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0B.png'),
    (N'individual-beverages', N'Individual Consumption Beverages', N'fas fa-bottle-water', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0C.png'),
    (N'water', N'Water', N'fas fa-glass-water', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0D.png'),
    (N'malt-chocolate', N'Malt & Chocolate Drinks', N'fas fa-mug-hot', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0F.png'),
    (N'milk', N'Powdered & Liquid Milk', N'fas fa-glass-water', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0G.png'),
    (N'tea', N'Tea', N'fas fa-mug-hot', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/B0H.png'),
    (N'cheese', N'Cheese', N'fas fa-cheese', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/C0I.png'),
    (N'yoghurts-curd', N'Yoghurts & Curd', N'fas fa-bowl-food', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/C0P.png'),
    (N'frozen-snacks', N'Frozen RTC Snacks', N'fas fa-snowflake', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/D0V.png'),
    (N'pasta-noodles', N'Pasta & Noodles', N'fas fa-bowl-food', N'https://essstr.blob.core.windows.net/essimg/subdepartment/images/desktop/G1F.png');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Slug = N'fruits')
    INSERT INTO dbo.Categories (Slug, Label, Icon, Image) VALUES (N'fruits', N'Fruits', N'fas fa-apple-whole', N'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Slug = N'dairy')
    INSERT INTO dbo.Categories (Slug, Label, Icon, Image) VALUES (N'dairy', N'Dairy', N'fas fa-cow', N'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Slug = N'pantry')
    INSERT INTO dbo.Categories (Slug, Label, Icon, Image) VALUES (N'pantry', N'Pantry', N'fas fa-box', N'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80');
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Slug = N'meat')
    INSERT INTO dbo.Categories (Slug, Label, Icon, Image) VALUES (N'meat', N'Meat & Seafood', N'fas fa-drumstick-bite', N'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80');
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Products)
BEGIN
    INSERT INTO dbo.Products (Name, Price, Unit, Featured, Image, CategoryId)
    SELECT source.Name, source.Price, source.Unit, source.Featured, source.Image, category.Id
    FROM (VALUES
      (N'Cavendish Bananas', 450, N'1 kg', 1, N'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', N'fruits'),
      (N'Hass Avocados', 320, N'each', 1, N'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', N'fruits'),
      (N'Strawberries', 1350, N'400 g punnet', 1, N'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80', N'fruits'),
      (N'Royal Gala Apples', 950, N'1 kg bag', 1, N'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', N'fruits'),
      (N'Whole Milk', 420, N'1 L', 1, N'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', N'dairy'),
      (N'Free-Range Eggs', 900, N'12 pack', 1, N'https://images.unsplash.com/photo-1491524062933-cb0289261700?auto=format&fit=crop&w=600&q=80', N'dairy'),
      (N'Greek Style Yoghurt', 550, N'500 g', 0, N'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', N'dairy'),
      (N'Mild Cheddar Cheese', 1650, N'250 g', 0, N'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80', N'dairy'),
      (N'Farmhouse White Bread', 300, N'loaf', 1, N'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', N'bakery'),
      (N'Butter Croissants', 850, N'4 pack', 0, N'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', N'bakery'),
      (N'Spaghetti Pasta', 650, N'500 g', 0, N'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80', N'pantry'),
      (N'Extra Virgin Olive Oil', 2400, N'750 ml', 1, N'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', N'pantry'),
      (N'Basmati Rice', 1600, N'5 kg', 0, N'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', N'pantry'),
      (N'Tomato Ketchup', 650, N'500 ml', 0, N'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', N'pantry'),
      (N'Chicken Breast Fillets', 1800, N'500 g', 1, N'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', N'meat'),
      (N'Atlantic Salmon Fillet', 4200, N'300 g', 0, N'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80', N'meat')
    ) AS source(Name, Price, Unit, Featured, Image, Slug)
    INNER JOIN dbo.Categories category ON category.Slug = source.Slug;
END
GO

-- Create the first administrator once the database exists.
-- Replace the password hash with one generated by the API before using this in production.
-- The API's admin user creation endpoint hashes passwords automatically.
