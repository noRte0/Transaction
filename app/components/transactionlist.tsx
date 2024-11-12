'use client';

import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  name: string;
}

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/getTable');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleClick = (tableId: string) => {
    // เปลี่ยนจาก id เป็น tableId ที่จะถูกส่งไปใน URL
    window.location.href = `/?tableId=${tableId}`; 
  };

  return (
    <div>
      {transactions.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <button
                onClick={() => handleClick(transaction.id)} // ส่ง tableId
                className="hover:bg-slate-600 h-full w-full rounded-full mt-3 pt-1 pb-1"
              >
                {transaction.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
