-- Add password column to Customers table
IF NOT EXISTS (SELECT 1 FROM sys.columns 
                WHERE name = 'password' AND object_id = OBJECT_ID('Customers'))
BEGIN
    ALTER TABLE Customers
    ADD password NVARCHAR(255) NOT NULL DEFAULT 'Default@123';
END 