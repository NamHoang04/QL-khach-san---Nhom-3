-- Add password column to customers table
IF NOT EXISTS (SELECT 1 FROM sys.columns 
                WHERE name = 'password' AND object_id = OBJECT_ID('customers'))
BEGIN
    ALTER TABLE customers
    ADD password NVARCHAR(255) NOT NULL DEFAULT 'Default@123';
END 