// import "@glideapps/glide-data-grid/dist/index.css";
// import React, { useState, useEffect, useCallback } from "react";
// import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
// import Card from 'components/card';
// import { v4 as uuidv4 } from 'uuid';

// type JourneyData = {
//     journeyId: string;
//     journeyName: string;
//     journeySteps: {
//         seqId: number;
//         eventName: string;
//         stepCondition: string;
//         messageConfigs: { [key: string]: string };
//     }[] | null;
//     auditInfo: {
//         createdBy: string;
//         createdTime: string;
//         updatedBy: string;
//         updatedTime: string;
//     };
// };

// function JourneyTable() {
//     const [data, setData] = useState<JourneyData[]>([]);
//     const [selectedRow, setSelectedRow] = useState<JourneyData | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Fetch data from the API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
//                     headers: {
//                         'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
//                         'X-Transaction-Id': uuidv4()
//                     }
//                 });
//                 const result: JourneyData[] = await response.json();
//                 setData(result);
//             } catch (error) {
//                 console.error("Error fetching journey data:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     const openModal = (row: JourneyData) => {
//         setSelectedRow(row);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedRow(null);
//     };

//     const columns: GridColumn[] = [
//         { title: "Journey Name", id: "journeyName" },
//         { title: "Journey Step Length", id: "journeyStepLength" },
//         { title: "Created Time", id: "createdTime" },
//         { title: "View", id: "view" }
//     ];

//     const getCellContent = useCallback((cell: [number, number]): GridCell => {
//         const [col, row] = cell;
//         const dataRow = data[row];

//         if (!dataRow) {
//             return { kind: GridCellKind.Text, allowOverlay: false, displayData: "", data: "" };
//         }

//         const columnId = columns[col].id;

//         if (columnId === "view") {
//             return {
//                 kind: GridCellKind.Custom,
//                 allowOverlay: true,
//                 copyData: "View",
//                 data: <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>,
//             };
//         }

//         if (columnId === "journeyStepLength") {
//             const length = dataRow.journeySteps ? dataRow.journeySteps.length.toString() : "0";
//             return { kind: GridCellKind.Text, allowOverlay: false, displayData: length, data: length };
//         }

//         if (columnId === "createdTime") {
//             const createdTime = new Date(dataRow.auditInfo.createdTime).toLocaleString();
//             return { kind: GridCellKind.Text, allowOverlay: false, displayData: createdTime, data: createdTime };
//         }

//         const cellData = (dataRow as any)[columnId];

//         return {
//             kind: GridCellKind.Text,
//             allowOverlay: false,
//             displayData: typeof cellData === "string" ? cellData : "",
//             data: typeof cellData === "string" ? cellData : "",
//         };
//     }, [data]);

//     const handleCellClick = (cell: [number, number]) => {
//         const [col, row] = cell;
//         if (columns[col].id === "view") {
//             openModal(data[row]);
//         }
//     };

//     return (
//         <div>
//             <Card extra={'w-full h-full sm:overflow-auto px-6'} className="w-full">
//                 <header className="relative flex items-center justify-between pt-4">
//                     <div className="text-xl font-bold text-navy-700 dark:text-white">Journeys Data Grid</div>
//                 </header>

//                 <div className="mt-8 h-full w-full">
//                     <DataEditor
//                         getCellContent={getCellContent}
//                         columns={columns}
//                         rows={data.length}
//                         className="custom-data-editor h-full w-full"
//                         headerHeight={40}
//                         rowHeight={40}
//                         onCellClicked={handleCellClick}
//                     />
//                 </div>
//             </Card>

//             {isModalOpen && selectedRow && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-6 w-full h-full">
//                         <h2 className="text-xl font-bold mb-4">View Journey Details</h2>

//                         {/* Section for Basic Info */}
//                         <div className="mb-4">
//                             <h3 className="text-lg font-semibold">Basic Info</h3>
//                             <p><strong>Journey Name:</strong> {selectedRow.journeyName}</p>
//                         </div>

//                         {/* Section for Journey Steps */}
//                         <div className="mb-4">
//                             <h3 className="text-lg font-semibold">Journey Steps</h3>
//                             {selectedRow.journeySteps?.length > 0 ? (
//                                 selectedRow.journeySteps.map((step, index) => (
//                                     <div key={index} className="mb-2">
//                                         <p><strong>Seq ID:</strong> {step.seqId}</p>
//                                         <p><strong>Event Name:</strong> {step.eventName}</p>
//                                         <p><strong>Step Condition:</strong> {step.stepCondition}</p>
//                                         <p><strong>Message Configs:</strong></p>
//                                         {Object.keys(step.messageConfigs).map(key => (
//                                             <p key={key}><strong>{key}:</strong> {step.messageConfigs[key]}</p>
//                                         ))}
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No Journey Steps available</p>
//                             )}
//                         </div>

//                         {/* Section for Audit Info */}
//                         <div>
//                             <h3 className="text-lg font-semibold">Audit Info</h3>
//                             <p><strong>Created By:</strong> {selectedRow.auditInfo.createdBy}</p>
//                             <p><strong>Created Time:</strong> {new Date(selectedRow.auditInfo.createdTime).toLocaleString()}</p>
//                             <p><strong>Updated By:</strong> {selectedRow.auditInfo.updatedBy}</p>
//                             <p><strong>Updated Time:</strong> {new Date(selectedRow.auditInfo.updatedTime).toLocaleString()}</p>
//                         </div>

//                         {/* Close Button */}
//                         <div className="mt-4 flex justify-end">
//                             <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default JourneyTable;

// Attempt 13

import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';

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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Journey modal
    const [newJourney, setNewJourney] = useState({ journeyName: "", journeySteps: [] as JourneyStep[] }); // New Journey State

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
            } catch (error) {
                console.error("Error fetching journey data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle opening the modal to view details
    const openModal = (row: JourneyData) => {
        setSelectedRow(row);
        setIsModalOpen(true); // Show view modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    // Handle opening the modal to add new data
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewJourney({ journeyName: "", journeySteps: [] });
    };

    // Add Journey Step to the new journey
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
            // Handle messageConfigs specifically as an object
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

    // Handle form submission to POST data
    const handleSubmit = async () => {
        const currentDate = new Date().toISOString();
        const newJourneyData: JourneyData = {
            journeyId: uuidv4(),
            journeyName: newJourney.journeyName,
            journeySteps: newJourney.journeySteps.length > 0 ? newJourney.journeySteps : null,
            auditInfo: {
                createdBy: "Current User", // Replace with actual user if available
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

    const columns: GridColumn[] = [
        { title: "Journey Name", id: "journeyName" },
        { title: "Journey Step Length", id: "journeyStepLength" },
        { title: "Created Time", id: "createdTime" },
        { title: "View", id: "view" }
    ];

    const getCellContent = useCallback((cell: [number, number]): GridCell => {
        const [col, row] = cell;
        const dataRow = data[row];

        // Make sure dataRow exists
        if (!dataRow) {
            return { kind: GridCellKind.Text, allowOverlay: false, displayData: "", data: "" };
        }

        const columnId = columns[col].id;

        // Handle the "view" column with an anchor link
        if (columnId === "view") {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "View",
                data: <a className="text-blue-500 cursor-pointer underline" onClick={() => openModal(dataRow)}>View</a>,
            };
        }

        // Safely handle undefined journeySteps
        if (columnId === "journeyStepLength") {
            const length = dataRow.journeySteps ? dataRow.journeySteps.length.toString() : "0";
            return { kind: GridCellKind.Text, allowOverlay: false, displayData: length, data: length };
        }

        // Safely handle undefined auditInfo fields
        if (columnId === "createdTime") {
            const createdTime = dataRow.auditInfo?.createdTime ? new Date(dataRow.auditInfo.createdTime).toLocaleString() : "";
            return { kind: GridCellKind.Text, allowOverlay: false, displayData: createdTime, data: createdTime };
        }

        // Fallback for other fields, ensure the accessed field is a string
        const cellData = (dataRow as any)[columnId];

        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            displayData: typeof cellData === "string" ? cellData : "",
            data: typeof cellData === "string" ? cellData : "",
        };
    }, [data]);

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

            {/* View Journey Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">View Journey Details</h2>
                        <div>
                            <p><strong>Journey Name:</strong> {selectedRow.journeyName}</p>
                            <h3 className="text-lg font-semibold mt-4">Journey Steps</h3>
                            {selectedRow.journeySteps?.map((step, index) => (
                                <div key={index} className="mb-2">
                                    <p><strong>Seq ID:</strong> {step.seqId}</p>
                                    <p><strong>Event Name:</strong> {step.eventName}</p>
                                    <p><strong>Step Condition:</strong> {step.stepCondition}</p>
                                    <p><strong>Message Config 1:</strong> {step.messageConfigs["1"]}</p>
                                    <p><strong>Message Config 2:</strong> {step.messageConfigs["2"]}</p>
                                </div>
                            )) || <p>No Steps Available</p>}

                            <h3 className="text-lg font-semibold mt-4">Audit Info</h3>
                            <p><strong>Created By:</strong> {selectedRow.auditInfo.createdBy}</p>
                            <p><strong>Created Time:</strong> {new Date(selectedRow.auditInfo.createdTime).toLocaleString()}</p>
                            <p><strong>Updated By:</strong> {selectedRow.auditInfo.updatedBy}</p>
                            <p><strong>Updated Time:</strong> {new Date(selectedRow.auditInfo.updatedTime).toLocaleString()}</p>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JourneyTable;