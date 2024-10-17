-- This is an empty migration.



-- This is an empty migration.

DO $$ 
BEGIN
    -- Check if the value 'WITHDRAW' exists in the enum 'TransactionCategory'
    IF NOT EXISTS (SELECT 1 FROM pg_enum 
                   WHERE enumlabel = 'WITHDRAW' 
                   AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'TransactionCategory')) THEN
        -- Add the value to the enum if it doesn't exist
        ALTER TYPE "TransactionCategory" ADD VALUE 'WITHDRAW';
    END IF;
END $$;
