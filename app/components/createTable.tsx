"use client";
import React, { useState } from 'react';

interface CreateTableProps {
  name: string; // The name prop for the label
}

const CreateTable: React.FC<CreateTableProps> = ({ name }) => {
  const [inputValue, setInputValue] = useState('');

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Send the input value to the API
      const response = await fetch('/api/addTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ transactionName: inputValue }),
      });

      if (response.ok) {
        // Handle successful response
        alert('Transaction successfully added!');
        setInputValue(''); // Clear input field
      } else {
        // Handle error response
        alert('Error adding transaction.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-0">
      <input
        type="text"
        id="transactionname"
        value={inputValue}
        onChange={handleInputChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
      />
      <label
        htmlFor="transactionname"
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
      >
        {name}
      </label>
    </form>
  );
};

export default CreateTable;
