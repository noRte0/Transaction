'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'bad-words';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  note: string;
  attachmentUrl: string;
  createdAt: string;  // วันที่ที่เราจะใช้ในการกรอง
  updatedAt: string;
  date: string;
}

const TransactionData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ฟิลเตอร์วัน, เดือน, ปี
  const [filterDay, setFilterDay] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const tableId = searchParams.get('tableId');

  useEffect(() => {
    if (tableId) {
      const fetchTransactionData = async () => {
        try {
          const response = await fetch(`/api/getTransaction?tableId=${tableId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch transaction details');
          }

          const data = await response.json();
          console.log('Data received:', data);

          if (Array.isArray(data)) {
            setTransactions(data);
          } else if (data) {
            setTransactions([data]);
          } else {
            setError('No transaction found');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTransactionData();
    } else {
      setError('Select Table');
      setLoading(false);
    }
  }, [tableId]);

  // Logic for pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const filter = new Filter({ placeHolder: '*' });

  // ฟังก์ชันกรองตามวัน, เดือน, ปี
  const filteredTransactions = currentTransactions.filter(transaction => {
    const createdDate = new Date(transaction.createdAt);
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;  // เดือนใน JS เป็น 0-11
    const year = createdDate.getFullYear();

    const matchesDay = filterDay ? day === filterDay : true;
    const matchesMonth = filterMonth ? month === filterMonth : true;
    const matchesYear = filterYear ? year === filterYear : true;

    return matchesDay && matchesMonth && matchesYear;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (transactions.length === 0) return <div>No transaction found</div>;

  return (
    <div>
      <h1>Transaction List</h1>

      {/* Filter controls */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="filterDay">Day: </label>
        <input
          className='bg-slate-700 rounded-lg mr-2'
          type="number"
          id="filterDay"
          value={filterDay ?? ''}
          onChange={(e) => setFilterDay(Number(e.target.value) || null)}
          min="1"
          max="31"
        />
        <label htmlFor="filterMonth">Month: </label>
        <input
          className='bg-slate-700 rounded-lg mr-2'
          type="number"
          id="filterMonth"
          value={filterMonth ?? ''}
          onChange={(e) => setFilterMonth(Number(e.target.value) || null)}
          min="1"
          max="12"
        />
        <label htmlFor="filterYear">Year: </label>
        <input
          className='bg-slate-700 rounded-lg mr-2'
          type="number"
          id="filterYear"
          value={filterYear ?? ''}
          onChange={(e) => setFilterYear(Number(e.target.value) || null)}
        />
      </div>

      <label htmlFor="itemsPerPage">Items per page: </label>
      <select className='bg-slate-700 rounded-lg' id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>

      {/* Display transactions in a table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Note</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Attachment URL</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Intl.NumberFormat('en-US', { style: 'decimal' }).format(transaction.amount)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.category}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{filter.clean(transaction.note)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <a href={transaction.attachmentUrl} target="_blank" rel="noopener noreferrer">
                  {transaction.attachmentUrl}
                </a>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(transaction.createdAt).toLocaleDateString('en-GB')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              cursor: currentPage === index + 1 ? 'not-allowed' : 'pointer',
              backgroundColor: currentPage === index + 1 ? '#ddd' : '#007bff',
              color: currentPage === index + 1 ? '#666' : '#fff',
              border: 'none',
              borderRadius: '3px',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionData;
