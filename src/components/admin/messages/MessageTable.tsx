import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';

type MessageData = {
    name: string;
    company: string;
    email: string;
    phone: string;
};

function MessageTable() {
    const [data, setData] = useState<MessageData[]>([
        {
            "name": "Hines Fowler",
            "company": "BUZZNESS",
            "email": "hinesfowler@buzzness.com",
            "phone": "+1 (869) 405-3127"
        },
        {
            "name": "Hines Fowler",
            "company": "BUZZNESS",
            "email": "hinesfowler@buzzness.com",
            "phone": "+1 (869) 405-3127"
        },
        {
            "name": "Hines Fowler",
            "company": "BUZZNESS",
            "email": "hinesfowler@buzzness.com",
            "phone": "+1 (869) 405-3127"
        },
        {
            "name": "Hines Fowler",
            "company": "BUZZNESS",
            "email": "hinesfowler@buzzness.com",
            "phone": "+1 (869) 405-3127"
        },
    ]);

    const [selectedRow, setSelectedRow] = useState<MessageData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<MessageData | null>(null);

    const openModal = (row: MessageData) => {
        setSelectedRow(row);
        setEditedData(row);
        setIsModalOpen(true);
        setIsEditing(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        if (editedData) {
            setData(prevData =>
                prevData.map(item => item === selectedRow ? editedData : item)
            );
        }
        setIsEditing(false);
        closeModal();
    };

    const handleInputChange = (field: keyof MessageData, value: string) => {
        if (editedData) {
            setEditedData(prevData => ({
                ...prevData!,
                [field]: value
            }));
        }
    };

    const columns: GridColumn[] = [
        { title: "Name", id: "name" },
        { title: "Company", id: "company" },
        { title: "Email", id: "email" },
        { title: "Phone", id: "phone" },
        { title: "View", id: "view" }
    ];

    const getCellContent = useCallback((cell: [number, number]): GridCell => {
        const [col, row] = cell;
        const dataRow = data[row];

        if (columns[col].id === "view") {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "View",
                data: <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>, // Render a button in the View column
            };
        }

        const indexes: (keyof MessageData)[] = ["name", "company", "email", "phone"];
        const d = dataRow[indexes[col]];
        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            displayData: d,
            data: d,
        };
    }, [data]);

    const handleCellClick = (cell: [number, number]) => {
        const [col, row] = cell;
        if (columns[col].id === "view") {
            openModal(data[row]);
        }
    };

    return (
        <div>
            <Card extra={'w-full h-full sm:overflow-auto px-6'} className="w-full">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">
                        Messages Data Grid
                    </div>
                </header>

                <div className="mt-8 h-full w-full">
                    <DataEditor
                        getCellContent={getCellContent}
                        columns={columns}
                        rows={data.length}
                        className="custom-data-editor h-full w-full"
                        headerHeight={40}
                        rowHeight={40}
                        onCellClicked={handleCellClick}  // Handle cell clicks for opening the modal
                    />
                </div>
            </Card>

            {/* Modal for viewing and editing */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Details" : "View Details"}</h2>
                        {selectedRow && (
                            <div>
                                {isEditing ? (
                                    <div>
                                        <div>
                                            <label><strong>Name:</strong></label>
                                            <input
                                                type="text"
                                                value={editedData?.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                        <div>
                                            <label><strong>Company:</strong></label>
                                            <input
                                                type="text"
                                                value={editedData?.company}
                                                onChange={(e) => handleInputChange('company', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                        <div>
                                            <label><strong>Email:</strong></label>
                                            <input
                                                type="email"
                                                value={editedData?.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                        <div>
                                            <label><strong>Phone:</strong></label>
                                            <input
                                                type="tel"
                                                value={editedData?.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Name:</strong> {selectedRow.name}</p>
                                        <p><strong>Company:</strong> {selectedRow.company}</p>
                                        <p><strong>Email:</strong> {selectedRow.email}</p>
                                        <p><strong>Phone:</strong> {selectedRow.phone}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-4 flex justify-end space-x-2">
                            {isEditing ? (
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={handleEditClick}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={closeModal}
                            >
                                {isEditing ? "Cancel" : "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageTable;