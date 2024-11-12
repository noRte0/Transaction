import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface TransactionFormValues {
  amount: string;
  type: string;
  note: string;
  imageUrl: string;
  tableId: string;
}

interface Table {
  id: string;
  name: string;
}

const InputForm: React.FC = () => {
  const [formValues, setFormValues] = useState<TransactionFormValues>({
    amount: '',
    type: '',
    note: '',
    imageUrl: '',
    tableId: '',
  });
  
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchTables = async () => {
        try {
          const response = await fetch('/api/getTable');
          if (!response.ok) {
            throw new Error('Failed to fetch tables');
          }
          const data: Table[] = await response.json();
          setTables(data);
        } catch (err: any) {
          setError('Could not load tables. Please try again.');
          console.error('Error fetching tables:', err.message);
        }
      };

      fetchTables();
    }
  }, [status]);

  if (status === 'unauthenticated') {
    return <div>Please sign in to view tables.</div>; // Or redirect to login
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountAsFloat = parseFloat(formValues.amount);
    if (isNaN(amountAsFloat) || !formValues.type || !formValues.tableId) {
      setError('Amount must be a valid number, Type and Table must be selected!');
      return;
    }
    setError('');

    const data = {
      amount: amountAsFloat,
      type: formValues.type,
      note: formValues.note || '-',
      imageUrl: formValues.imageUrl || '-',
      tableId: formValues.tableId,
    };

    try {
      const response = await fetch('/api/addtransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const result = await response.json();
      console.log('Transaction added successfully:', result);

      setFormValues({
        amount: '',
        type: '',
        note: '',
        imageUrl: '',
        tableId: '',
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error occurred while submitting: ${error.message}`);
        console.error('Error occurred while submitting:', error.message);
      } else {
        setError('An unknown error occurred');
        console.error('An unknown error occurred', error);
      }
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="relative">
      {/* Form container */}
      <div
        className={`fixed left-0 bottom-0 w-full h-80 transition-transform duration-300 ${
          isFormVisible ? 'translate-y-0' : 'translate-y-full'
        } border-t-2 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
      >
        <section className="h-full bg-gray-800 text-white p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-1">
                {error}
              </div>
            )}

            {/* Flex container to divide form into two sections */}
            <div className="flex space-x-4">
              {/* Left Side */}
              <div className="w-1/2">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-white">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formValues.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-slate-700 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-white">
                    Type (Category)
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formValues.type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-slate-700 border-gray-700 text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              {/* Right Side */}
              <div className="w-1/2">
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-white">
                    Note
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formValues.note}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-slate-700 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                    rows={3}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-white">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formValues.imageUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-slate-700 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="tableId" className="block text-sm font-medium text-white">
                    Select Table
                  </label>
                  <select
                    id="tableId"
                    name="tableId"
                    value={formValues.tableId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-slate-700 border-gray-700 text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="" disabled>
                      Select a table
                    </option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Centered Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="mt-6 w-full max-w-xs py-2 rounded-full bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 hover:bg-gradient-to-l text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Centered toggle button at the top of the form */}

      <button
        onClick={toggleFormVisibility}
        className={`fixed ${isFormVisible ? 'bottom-80' : 'bottom-0'} h-7 w-20 left-1/2 transform -translate-x-1/2 rounded-t-xl bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white font-semibold transition-all duration-300`}
      >
        {isFormVisible ? '▼' : '▲'}
      </button>
    </div>
  );
};

export default InputForm;
