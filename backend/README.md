# FreshMart SQL Server API

## 1. Create the database

Open `database.sql` in SSMS, select your SQL Server instance, and execute it. It creates the `FreshMartDb` database and the `Categories`, `Products`, and `Users` tables.

## 2. Set the connection string

Edit `appsettings.json` if your SQL Server instance is not the default local instance:

```json
{
  "ConnectionStrings": {
    "FreshMart": "Server=YOUR_SERVER\\YOUR_INSTANCE;Database=FreshMartDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Common server values are:

- `localhost`
- `localhost\\SQLEXPRESS`
- `(localdb)\\MSSQLLocalDB`
- `YOUR-COMPUTER-NAME\\SQLEXPRESS`

For SQL authentication, use:

```text
Server=YOUR_SERVER;Database=FreshMartDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;
```

Do not commit real passwords to source control.

## 3. Start the API

From the `backend` folder:

```text
dotnet run --urls http://localhost:5050
```

The API is then available at `http://localhost:5050/api`.

Available endpoints:

- `GET/POST /api/products`
- `PUT/DELETE /api/products/{id}`
- `GET/POST /api/categories`
- `PUT/DELETE /api/categories/{id}`
- `GET/POST /api/users`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/products/{id}`
- `POST /api/orders`
- `DELETE /api/users/{id}`

The storefront, product detail page, login/register pages, checkout, and admin page call these endpoints. Keep the API running while using the site.

The browser login is still the demo login layer. Use `admin@freshmart.lk` / `admin123` to open the admin panel until authentication is also moved fully to SQL Server.
