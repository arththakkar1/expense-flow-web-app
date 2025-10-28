// Your existing imports
import { createClient, supabase } from "./client";

// Create a single instance
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

export type TransactionType = "expense" | "income" | "transfer";

// Data structure for inserting a NEW transaction
export type NewTransactionData = {
  user_id: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // Format: 'yyyy-MM-dd'
  notes?: string | null;
  tags?: string[] | null;
};

// Data structure for UPDATING a transaction (used in EditTransactionDialog)
// Note: This is equivalent to Partial<NewTransactionData> plus 'transaction_date' for the date field
export type UpdateTransactionData = Partial<{
  user_id: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string; // Using the DB column name for updates
  notes?: string | null;
  tags?: string[] | null;
}>;

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category(name)") // Join with categories to get category name
    .eq("user_id", userId)
    .order("date", { ascending: false }); // Order by date, newest first

  if (error) {
    console.error("Error fetching transactions for export:", error);
    throw error;
  }
  return data || [];
}

// Full transaction object FROM the database
export type Transaction = {
  id: string;
  created_at: string;
} & NewTransactionData;

// Account object
export type Account = {
  id: string;
  user_id: string;
  name: string;
  // ... any other account fields
};

// -------------------------------------------------------------------
// --- FUNCTIONS ---
// -------------------------------------------------------------------

/**
 * Inserts a new transaction into the database.
 */
export const addTransaction = async (transactionData: NewTransactionData) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert(transactionData)
    .select()
    .single();

  if (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }

  return data;
};

/**
 * Updates an existing transaction. Uses Partial updates for flexibility.
 */
export const updateTransaction = async (
  transactionId: string,
  // Using UpdateTransactionData here (which is Partial)
  transactionData: UpdateTransactionData
) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .update(transactionData)
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }

  return data;
};

/**
 * Fetches all accounts belonging to a user.
 */
export const getUserAccounts = async (userId: string): Promise<Account[]> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }

  return data || [];
};

/**
 * Fetches a single transaction by its ID.
 */
export const getSingleTransaction = async (
  transactionId: string
): Promise<Transaction | null> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching single transaction:", error);
    throw error;
  }

  return data as Transaction | null;
};

export type ExportTransaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "expense" | "income";
  category_id: string | null;
  account_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Fetches all transactions for a specific user
 * @param userId - The user's ID
 * @returns Array of transactions or null if error occurs
 */
export async function getUserTransactions(
  userId: string
): Promise<ExportTransaction[] | null> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching user transactions:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to get user transactions:", error);
    return null;
  }
}

/**
 * Optional: Fetches transactions with additional filters
 * @param userId - The user's ID
 * @param options - Optional filters (date range, type, category)
 */
export async function getUserTransactionsFiltered(
  userId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    type?: "expense" | "income";
    categoryId?: string;
    limit?: number;
  }
): Promise<Transaction[] | null> {
  try {
    let query = supabase.from("transactions").select("*").eq("user_id", userId);

    // Apply filters if provided
    if (options?.startDate) {
      query = query.gte("date", options.startDate);
    }
    if (options?.endDate) {
      query = query.lte("date", options.endDate);
    }
    if (options?.type) {
      query = query.eq("type", options.type);
    }
    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    query = query.order("date", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered transactions:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to get filtered transactions:", error);
    return null;
  }
}
