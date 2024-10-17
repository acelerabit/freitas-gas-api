DO $$ 
BEGIN
    -- Check if the value 'INCOME' exists in the enum 'TransactionCategory'
    IF NOT EXISTS (SELECT 1 FROM pg_enum 
                   WHERE enumlabel = 'INCOME' 
                   AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'TransactionCategory')) THEN
        -- Add the value to the enum if it doesn't exist
        ALTER TYPE "TransactionCategory" ADD VALUE 'INCOME';
    END IF;
END $$;
