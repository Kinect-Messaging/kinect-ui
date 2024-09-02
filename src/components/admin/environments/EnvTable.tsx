import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';

type ChangeLog = {
    user: string;
    time: string;
    comment: string;
};

type EnvData = {
    envId: string;
    envName: string;
    journeyId: string;
    messageId: string;
    eventName: string;
    changeLog: ChangeLog[];
};

function EnvTable() {
    const [data, setData] = useState<EnvData[]>([]);
    const [selectedRow, setSelectedRow] = useState<EnvData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<EnvData | null>(null);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/env', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                        'X-Transaction-Id': uuidv4()
                    }
                });
                const result: EnvData[] = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error("Error fetching environment data:", error);
            }
        };
        fetchData();
    }, []);

    const openModal = (row: EnvData) => {
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

    const handleInputChange = (field: keyof EnvData, value: string) => {
        if (editedData) {
            setEditedData(prevData => ({
                ...prevData!,
                [field]: value
            }));
        }
    };

    const columns: GridColumn[] = [
        { title: "Environment Name", id: "envName" },
        { title: "Journey ID", id: "journeyId" },
        { title: "Message ID", id: "messageId" },
        { title: "Event Name", id: "eventName" },
        { title: "View", id: "view" }
    ];

    const getCellContent = useCallback((cell: [number, number]): GridCell => {
        const [col, row] = cell;
        const dataRow = data[row];

        if (!dataRow) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: "",
                data: "",
            };
        }

        const columnId = columns[col].id;

        // Handle the "View" column separately with a button
        if (columnId === "view") {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "View",
                data: <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>,
            };
        }

        // Safely access the data for other columns
        const cellData = (dataRow as any)[columnId];

        if (typeof cellData === "string") {
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: cellData,
                data: cellData,
            };
        }

        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            displayData: "",
            data: "",
        };
    }, [data, columns]);

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
                        Environments Data Grid
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Environment Details" : "View Environment Details"}</h2>
                        {selectedRow && (
                            <div>
                                <div>
                                    <label><strong>Environment Name:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.envName}
                                            onChange={(e) => handleInputChange('envName', e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.envName}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Journey ID:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.journeyId}
                                            onChange={(e) => handleInputChange('journeyId', e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.journeyId}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Message ID:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.messageId}
                                            onChange={(e) => handleInputChange('messageId', e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.messageId}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Event Name:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.eventName}
                                            onChange={(e) => handleInputChange('eventName', e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.eventName}</p>
                                    )}
                                </div>
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

export default EnvTable;