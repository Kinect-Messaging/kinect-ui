'use client';
import MessageTable from 'components/admin/messages/MessageTable';
import React from 'react';

const Tables = () => {
    const handleAddMoreData = () => {
        alert("Add More Data functionality here"); // Replace this with the actual functionality
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mt-5">
                <div>
                    {/* You can place additional elements here if needed */}
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleAddMoreData}
                >
                    Add More Data
                </button>
            </div>
            <div className="mt-5 grid h-full grid-cols-1 gap-5">
                <div className="col-span-1 w-full">
                    <MessageTable />
                </div>
            </div>
        </div>
    );
};

export default Tables;