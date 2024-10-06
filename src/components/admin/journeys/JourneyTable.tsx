'use client'
import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

type JourneyStep = {
    seqId: number;
    eventName: string;
    stepCondition: string;
    messageConfigs: { [key: string]: string };
};

type JourneyData = {
    journeyId: string;
    journeyName: string;
    journeySteps: JourneyStep[] | null;
    auditInfo: {
        createdBy: string;
        createdTime: string;
        updatedBy: string;
        updatedTime: string;
    };
};

function JourneyTable() {
    const [data, setData] = useState<JourneyData[]>([]);
    const [selectedRow, setSelectedRow] = useState<JourneyData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // View Journey modal
    const [isEditMode, setIsEditMode] = useState(false); // Edit mode state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Journey modal
    const [newJourney, setNewJourney] = useState({ journeyName: "", journeySteps: [] as JourneyStep[] }); // New/Edited Journey State

    const router = useRouter();

    const navigateToJourneyFlow = useCallback((journeyId: string) => {
        router.push(`/admin/journeys/journey-flow?id=${journeyId}`);
    }, [router]);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY || '',
                        'X-Transaction-Id': uuidv4()
                    }
                });
                const result: JourneyData[] = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching journey data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle opening the modal to view/edit details
    const openModal = (row: JourneyData, editMode = false) => {
        setSelectedRow(row);
        setNewJourney({
            journeyName: row.journeyName,
            journeySteps: row.journeySteps || [],
        });
        setIsEditMode(editMode); // Set edit mode based on whether the user clicked "Edit"
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setIsEditMode(false);
    };

    // Handle opening the modal to add new data
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewJourney({ journeyName: "", journeySteps: [] });
    };

    // Add Journey Step to the new or edited journey
    const addJourneyStep = () => {
        setNewJourney({
            ...newJourney,
            journeySteps: [...newJourney.journeySteps, { seqId: newJourney.journeySteps.length + 1, eventName: "", stepCondition: "", messageConfigs: {} }]
        });
    };

    // Handle input change in the form
    const handleInputChange = (field: keyof typeof newJourney, value: any) => {
        setNewJourney((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleStepInputChange = (index: number, field: keyof JourneyStep, value: any) => {
        const updatedSteps = [...newJourney.journeySteps];

        if (field === 'messageConfigs') {
            updatedSteps[index] = {
                ...updatedSteps[index],
                messageConfigs: {
                    ...updatedSteps[index].messageConfigs,
                    ...value // Merge new key-value pair into messageConfigs
                }
            };
        } else {
            updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        }

        setNewJourney((prevData) => ({
            ...prevData,
            journeySteps: updatedSteps,
        }));
    };

    // Handle form submission to POST new data
    const handleSubmit = async () => {
        const currentDate = new Date().toISOString();
        const newJourneyData: JourneyData = {
            journeyId: uuidv4(),
            journeyName: newJourney.journeyName,
            journeySteps: newJourney.journeySteps.length > 0 ? newJourney.journeySteps : null,
            auditInfo: {
                createdBy: "Current User",
                createdTime: currentDate,
                updatedBy: "Current User",
                updatedTime: currentDate,
            },
        };

        try {
            const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                    'X-Transaction-Id': uuidv4()
                },
                body: JSON.stringify(newJourneyData),
            });

            if (response.ok) {
                const result = await response.json();
                setData([...data, result]); // Add the new journey to the data table
                closeAddModal();
            } else {
                console.error('Failed to add new journey');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle Save Edit functionality
    const handleSaveEdit = async () => {
        if (selectedRow) {
            const updatedJourneyData: JourneyData = {
                ...selectedRow,
                journeyName: newJourney.journeyName,
                journeySteps: newJourney.journeySteps,
                auditInfo: {
                    ...selectedRow.auditInfo,
                    updatedBy: "Current User", // Replace with actual user
                    updatedTime: new Date().toISOString(), // Automatically set updatedTime
                },
            };

            try {
                const response = await fetch(`https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey/${selectedRow.journeyId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                        'X-Transaction-Id': uuidv4()
                    },
                    body: JSON.stringify(updatedJourneyData),
                });

                if (response.ok) {
                    const updatedData = await response.json();
                    const updatedDataList = data.map(journey => journey.journeyId === updatedData.journeyId ? updatedData : journey);
                    setData(updatedDataList); // Update the journey in the data table
                    setIsEditMode(false); // Exit edit mode after saving
                } else {
                    console.error('Failed to update journey');
                }
            } catch (error) {
                console.error('Error updating journey:', error);
            }
        }
    };

    // Updated columns for the table
    const columns: GridColumn[] = [
        { title: "Journey Name", id: "journeyName" },
        { title: "Last Updated User", id: "updatedBy" },
        { title: "Last Updated Time", id: "updatedTime" },
        { title: "View", id: "view" },
        { title: "Edit", id: "edit" }
    ];

    const getCellContent = useCallback((cell: [number, number]): GridCell => {
        const [col, row] = cell;
        const dataRow = data[row];

        if (!dataRow) {
            return { kind: GridCellKind.Text, allowOverlay: false, displayData: "", data: "" };
        }

        const columnId = columns[col].id;

        if (columnId === "view") {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "View",
                data: {
                    kind: "button",
                    onClick: () => navigateToJourneyFlow(dataRow.journeyId),
                    label: "View"
                },
            };
        }

        if (columnId === "edit") {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "Edit",
                data: {
                    kind: "button",
                    onClick: () => openModal(dataRow, true),
                    label: "Edit"
                },
            };
        }

        if (columnId === "updatedBy") {
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                displayData: dataRow.auditInfo?.updatedBy || "",
                data: dataRow.auditInfo?.updatedBy || "",
            };
        }

        if (columnId === "updatedTime") {
            const updatedTime = dataRow.auditInfo?.updatedTime ? new Date(dataRow.auditInfo.updatedTime).toLocaleString() : "";
            return { kind: GridCellKind.Text, allowOverlay: false, displayData: updatedTime, data: updatedTime };
        }

        const cellData = (dataRow as any)[columnId];
        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            displayData: typeof cellData === "string" ? cellData : "",
            data: typeof cellData === "string" ? cellData : "",
        };
    }, [data, columns, navigateToJourneyFlow, openModal]);

    const onCellClicked = useCallback((cell: [number, number], event: any) => {
        const [col, row] = cell;
        const columnId = columns[col].id;
        const dataRow = data[row];

        if (columnId === "view") {
            navigateToJourneyFlow(dataRow.journeyId);
        } else if (columnId === "edit") {
            openModal(dataRow, true);
        }
    }, [columns, data, navigateToJourneyFlow, openModal]);

    return (
        <div>
            <Card extra={'w-full h-full sm:overflow-auto px-6'} className="w-full">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Journeys Data Grid</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={openAddModal}>Add Journey</button>
                </header>

                <div className="mt-8 h-full w-full">
                    <DataEditor
                        getCellContent={getCellContent}
                        columns={columns}
                        rows={data.length}
                        className="custom-data-editor h-full w-full"
                        headerHeight={40}
                        rowHeight={40}
                        onCellClicked={onCellClicked}
                    />
                </div>
            </Card>

            {/* Add Journey Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">Add New Journey</h2>

                        {/* Journey Name */}
                        <div className="mb-4">
                            <label><strong>Journey Name:</strong></label>
                            <input
                                type="text"
                                value={newJourney.journeyName}
                                onChange={(e) => handleInputChange("journeyName", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Journey Steps */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Journey Steps</h3>
                            {newJourney.journeySteps.map((step, index) => (
                                <div key={index} className="mb-2">
                                    <label><strong>Seq ID:</strong></label>
                                    <input
                                        type="number"
                                        value={step.seqId}
                                        onChange={(e) => handleStepInputChange(index, 'seqId', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    <label><strong>Event Name:</strong></label>
                                    <input
                                        type="text"
                                        value={step.eventName}
                                        onChange={(e) => handleStepInputChange(index, 'eventName', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    <label><strong>Step Condition:</strong></label>
                                    <input
                                        type="text"
                                        value={step.stepCondition}
                                        onChange={(e) => handleStepInputChange(index, 'stepCondition', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {/* Message Configs */}
                                    <label><strong>Message Configs:</strong></label>
                                    <input
                                        type="text"
                                        value={step.messageConfigs["1"] || ""}
                                        onChange={(e) => handleStepInputChange(index, 'messageConfigs', { "1": e.target.value })}
                                        className="w-full border rounded p-2"
                                        placeholder="Message Config 1"
                                    />
                                    <input
                                        type="text"
                                        value={step.messageConfigs["2"] || ""}
                                        onChange={(e) => handleStepInputChange(index, 'messageConfigs', { "2": e.target.value })}
                                        className="w-full border rounded p-2"
                                        placeholder="Message Config 2"
                                    />
                                </div>
                            ))}
                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={addJourneyStep}>Add Step</button>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex justify-end space-x-2">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeAddModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View and Edit Journey Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Journey' : 'View Journey Details'}</h2>

                        {!isEditMode ? (
                            // View mode
                            <div>
                                {/* Section for Basic Info */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Basic Info</h3>
                                    <p><strong>Journey Name:</strong> {selectedRow.journeyName}</p>
                                </div>

                                {/* Section for Journey Steps */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Journey Steps</h3>
                                    {selectedRow.journeySteps?.length > 0 ? (
                                        selectedRow.journeySteps.map((step, index) => (
                                            <div key={index} className="mb-2">
                                                <p><strong>Seq ID:</strong> {step.seqId}</p>
                                                <p><strong>Event Name:</strong> {step.eventName}</p>
                                                <p><strong>Step Condition:</strong> {step.stepCondition}</p>
                                                <p><strong>Message Configs:</strong></p>
                                                {Object.keys(step.messageConfigs).map(key => (
                                                    <p key={key}><strong>{key}:</strong> {step.messageConfigs[key]}</p>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No Journey Steps available</p>
                                    )}
                                </div>

                                {/* Section for Audit Info */}
                                {/* <div>
                                    <h3 className="text-lg font-semibold">Audit Info</h3>
                                    <p><strong>Created By:</strong> {selectedRow.auditInfo.createdBy}</p>
                                    <p><strong>Created Time:</strong> {new Date(selectedRow.auditInfo.createdTime).toLocaleString()}</p>
                                    <p><strong>Updated By:</strong> {selectedRow.auditInfo.updatedBy}</p>
                                    <p><strong>Updated Time:</strong> {new Date(selectedRow.auditInfo.updatedTime).toLocaleString()}</p>
                                </div> */}

                                {/* Close and Edit Buttons */}
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => openModal(selectedRow, true)}>Edit</button>
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        ) : (
                            // Edit mode
                            <div>
                                {/* Edit Journey Form */}
                                <div className="mb-4">
                                    <label><strong>Journey Name:</strong></label>
                                    <input
                                        type="text"
                                        value={newJourney.journeyName}
                                        onChange={(e) => handleInputChange("journeyName", e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                </div>

                                {/* Edit Journey Steps */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Journey Steps</h3>
                                    {newJourney.journeySteps.map((step, index) => (
                                        <div key={index} className="mb-2">
                                            <label><strong>Seq ID:</strong></label>
                                            <input
                                                type="number"
                                                value={step.seqId}
                                                onChange={(e) => handleStepInputChange(index, 'seqId', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                            <label><strong>Event Name:</strong></label>
                                            <input
                                                type="text"
                                                value={step.eventName}
                                                onChange={(e) => handleStepInputChange(index, 'eventName', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                            <label><strong>Step Condition:</strong></label>
                                            <input
                                                type="text"
                                                value={step.stepCondition}
                                                onChange={(e) => handleStepInputChange(index, 'stepCondition', e.target.value)}
                                                className="w-full border rounded p-2"
                                            />
                                            {/* Message Configs */}
                                            <label><strong>Message Configs:</strong></label>
                                            <input
                                                type="text"
                                                value={step.messageConfigs["1"] || ""}
                                                onChange={(e) => handleStepInputChange(index, 'messageConfigs', { "1": e.target.value })}
                                                className="w-full border rounded p-2"
                                                placeholder="Message Config 1"
                                            />
                                            <input
                                                type="text"
                                                value={step.messageConfigs["2"] || ""}
                                                onChange={(e) => handleStepInputChange(index, 'messageConfigs', { "2": e.target.value })}
                                                className="w-full border rounded p-2"
                                                placeholder="Message Config 2"
                                            />
                                        </div>
                                    ))}
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={addJourneyStep}>Add Step</button>
                                </div>

                                {/* Save and Cancel Buttons */}
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveEdit}>Save</button>
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JourneyTable;