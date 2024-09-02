import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

type JourneyData = {
    journeyId: string;
    journeyName: string;
    journeySteps: { seqId: number; eventName: string; stepCondition: string; messageConfigs: { [key: string]: string }; }[] | null;
    auditInfo: { createdBy: string; createdTime: string; updatedBy: string; updatedTime: string };
};

function JourneyTable() {
    const [data, setData] = useState<JourneyData[]>([]);
    const [selectedRow, setSelectedRow] = useState<JourneyData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<JourneyData | null>(null);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                        'X-Transaction-Id': uuidv4()
                    }
                });
                const result: JourneyData[] = await response.json();
                setData(result);
                console.log(result)
            } catch (error) {
                console.error("Error fetching journey data:", error);
            }
        };
        fetchData();
    }, []);

    const openModal = (row: JourneyData) => {
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

    const handleInputChange = (field: keyof JourneyData, value: string) => {
        if (editedData) {
            setEditedData(prevData => ({
                ...prevData!,
                [field]: value
            }));
        }
    };

    const columns: GridColumn[] = [
        { title: "Journey Name", id: "journeyName" },
        { title: "Journey Step Length", id: "journeyStepLength" },
        { title: "Created Time", id: "createdTime" },
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

        // Handle the "Journey Step Length" column
        if (columnId === "journeyStepLength") {
            const length = dataRow.journeySteps ? dataRow.journeySteps.length.toString() : "0";
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: length,
                data: length,
            };
        }

        // Handle the "Created Time" column
        if (columnId === "createdTime") {
            const createdTime = new Date(dataRow.auditInfo.createdTime).toLocaleString();
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: createdTime,
                data: createdTime,
            };
        }

        // Safely access the data for the "Journey Name" column
        if (columnId === "journeyName") {
            const journeyName = dataRow.journeyName || "Unnamed Journey";
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: journeyName,
                data: journeyName,
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
                        Journeys Data Grid
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
                        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Journey Details" : "View Journey Details"}</h2>
                        {selectedRow && (
                            <div>
                                <div>
                                    <label><strong>Journey Name:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.journeyName}
                                            onChange={(e) => handleInputChange('journeyName', e.target.value)}
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.journeyName}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Event Name:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.journeySteps?.[0]?.eventName || ""}
                                            onChange={(e) => handleInputChange('journeySteps', e.target.value)} // Update as necessary
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.journeySteps?.[0]?.eventName || "N/A"}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Message Config 1:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.journeySteps?.[0]?.messageConfigs["1"] || ""}
                                            onChange={(e) => handleInputChange('journeySteps', e.target.value)} // Update as necessary
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.journeySteps?.[0]?.messageConfigs["1"] || "N/A"}</p>
                                    )}
                                </div>
                                <div>
                                    <label><strong>Message Config 2:</strong></label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData?.journeySteps?.[0]?.messageConfigs["2"] || ""}
                                            onChange={(e) => handleInputChange('journeySteps', e.target.value)} // Update as necessary
                                            className="w-full border rounded p-2"
                                        />
                                    ) : (
                                        <p>{selectedRow.journeySteps?.[0]?.messageConfigs["2"] || "N/A"}</p>
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

export default JourneyTable;