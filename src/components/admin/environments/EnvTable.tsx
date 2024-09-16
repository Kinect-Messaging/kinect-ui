// import "@glideapps/glide-data-grid/dist/index.css";
// import React, { useState, useEffect, useCallback } from "react";
// import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
// import Card from 'components/card';
// import { v4 as uuidv4 } from 'uuid';

// type ChangeLog = {
//     user: string;
//     time: string;
//     comment: string;
// };

// type EnvData = {
//     envId: string;
//     envName: string;
//     journeyId: string;
//     messageId: string;
//     eventName: string;
//     changeLog: ChangeLog[];
// };

// function EnvTable() {
//     const [data, setData] = useState<EnvData[]>([]);
//     const [selectedRow, setSelectedRow] = useState<EnvData | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState<EnvData | null>(null);

//     // Fetch data from the API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/env', {
//                     headers: {
//                         'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
//                         'X-Transaction-Id': uuidv4()
//                     }
//                 });
//                 const result: EnvData[] = await response.json();
//                 setData(result);
//                 console.log(result);
//             } catch (error) {
//                 console.error("Error fetching environment data:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     const openModal = (row: EnvData) => {
//         setSelectedRow(row);
//         setEditedData(row);
//         setIsModalOpen(true);
//         setIsEditing(false);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedRow(null);
//     };

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleSaveClick = () => {
//         if (editedData) {
//             setData(prevData =>
//                 prevData.map(item => item === selectedRow ? editedData : item)
//             );
//         }
//         setIsEditing(false);
//         closeModal();
//     };

//     const handleInputChange = (field: keyof EnvData, value: string) => {
//         if (editedData) {
//             setEditedData(prevData => ({
//                 ...prevData!,
//                 [field]: value
//             }));
//         }
//     };

//     const columns: GridColumn[] = [
//         { title: "Environment Name", id: "envName" },
//         { title: "Journey ID", id: "journeyId" },
//         { title: "Message ID", id: "messageId" },
//         { title: "Event Name", id: "eventName" },
//         { title: "View", id: "view" }
//     ];

//     const getCellContent = useCallback((cell: [number, number]): GridCell => {
//         const [col, row] = cell;
//         const dataRow = data[row];

//         if (!dataRow) {
//             return {
//                 kind: GridCellKind.Text,
//                 allowOverlay: false,
//                 displayData: "",
//                 data: "",
//             };
//         }

//         const columnId = columns[col].id;

//         // Handle the "View" column separately with a button
//         if (columnId === "view") {
//             return {
//                 kind: GridCellKind.Custom,
//                 allowOverlay: true,
//                 copyData: "View",
//                 data: <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>,
//             };
//         }

//         // Safely access the data for other columns
//         const cellData = (dataRow as any)[columnId];

//         if (typeof cellData === "string") {
//             return {
//                 kind: GridCellKind.Text,
//                 allowOverlay: false,
//                 displayData: cellData,
//                 data: cellData,
//             };
//         }

//         return {
//             kind: GridCellKind.Text,
//             allowOverlay: false,
//             displayData: "",
//             data: "",
//         };
//     }, [data, columns]);

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
//                     <div className="text-xl font-bold text-navy-700 dark:text-white">
//                         Environments Data Grid
//                     </div>
//                 </header>

//                 <div className="mt-8 h-full w-full">
//                     <DataEditor
//                         getCellContent={getCellContent}
//                         columns={columns}
//                         rows={data.length}
//                         className="custom-data-editor h-full w-full"
//                         headerHeight={40}
//                         rowHeight={40}
//                         onCellClicked={handleCellClick}  // Handle cell clicks for opening the modal
//                     />
//                 </div>
//             </Card>

//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-6 w-full h-full">
//                         <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Environment Details" : "View Environment Details"}</h2>
//                         {selectedRow && (
//                             <div>
//                                 <div>
//                                     <label><strong>Environment Name:</strong></label>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             value={editedData?.envName}
//                                             onChange={(e) => handleInputChange('envName', e.target.value)}
//                                             className="w-full border rounded p-2"
//                                         />
//                                     ) : (
//                                         <p>{selectedRow.envName}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label><strong>Journey ID:</strong></label>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             value={editedData?.journeyId}
//                                             onChange={(e) => handleInputChange('journeyId', e.target.value)}
//                                             className="w-full border rounded p-2"
//                                         />
//                                     ) : (
//                                         <p>{selectedRow.journeyId}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label><strong>Message ID:</strong></label>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             value={editedData?.messageId}
//                                             onChange={(e) => handleInputChange('messageId', e.target.value)}
//                                             className="w-full border rounded p-2"
//                                         />
//                                     ) : (
//                                         <p>{selectedRow.messageId}</p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label><strong>Event Name:</strong></label>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             value={editedData?.eventName}
//                                             onChange={(e) => handleInputChange('eventName', e.target.value)}
//                                             className="w-full border rounded p-2"
//                                         />
//                                     ) : (
//                                         <p>{selectedRow.eventName}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                         <div className="mt-4 flex justify-end space-x-2">
//                             {isEditing ? (
//                                 <button
//                                     className="bg-green-500 text-white px-4 py-2 rounded"
//                                     onClick={handleSaveClick}
//                                 >
//                                     Save
//                                 </button>
//                             ) : (
//                                 <button
//                                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                                     onClick={handleEditClick}
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                             <button
//                                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                                 onClick={closeModal}
//                             >
//                                 {isEditing ? "Cancel" : "Close"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default EnvTable;

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
    const [isModalOpen, setIsModalOpen] = useState(false); // View Environment modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Environment modal
    const [newEnv, setNewEnv] = useState({ envName: "", journeyId: "", messageId: "", eventName: "", changeLog: [] as ChangeLog[] }); // New Environment State

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

    // Handle opening the modal to view details
    const openModal = (row: EnvData) => {
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
        setNewEnv({ envName: "", journeyId: "", messageId: "", eventName: "", changeLog: [] });
    };

    // Add Change Log Entry to the new environment
    const addChangeLog = () => {
        setNewEnv({
            ...newEnv,
            changeLog: [...newEnv.changeLog, { user: "", time: new Date().toISOString(), comment: "" }]
        });
    };

    // Handle input change in the form
    const handleInputChange = (field: keyof typeof newEnv, value: any) => {
        setNewEnv((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleChangeLogInputChange = (index: number, field: keyof ChangeLog, value: string) => {
        const updatedChangeLogs = [...newEnv.changeLog];
        updatedChangeLogs[index] = { ...updatedChangeLogs[index], [field]: value };
        setNewEnv((prevData) => ({
            ...prevData,
            changeLog: updatedChangeLogs,
        }));
    };

    // Handle form submission to POST data
    const handleSubmit = async () => {
        const newEnvData: EnvData = {
            envId: uuidv4(),
            envName: newEnv.envName,
            journeyId: newEnv.journeyId,
            messageId: newEnv.messageId,
            eventName: newEnv.eventName,
            changeLog: newEnv.changeLog.length > 0 ? newEnv.changeLog : []
        };

        try {
            const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/env', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                    'X-Transaction-Id': uuidv4()
                },
                body: JSON.stringify(newEnvData),
            });

            if (response.ok) {
                const result = await response.json();
                setData([...data, result]); // Add the new environment to the data table
                closeAddModal();
            } else {
                console.error('Failed to add new environment');
            }
        } catch (error) {
            console.error('Error:', error);
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

        // Fallback for other fields, ensure the accessed field is a string
        const cellData = (dataRow as any)[columnId];

        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            displayData: typeof cellData === "string" ? cellData : "",
            data: typeof cellData === "string" ? cellData : "",
        };
    }, [data]);

    // Add the onCellClicked function here to make sure modals open correctly
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
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Environments Data Grid</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={openAddModal}>Add Environment</button>
                </header>

                <div className="mt-8 h-full w-full">
                    <DataEditor
                        getCellContent={getCellContent}
                        columns={columns}
                        rows={data.length}
                        className="custom-data-editor h-full w-full"
                        headerHeight={40}
                        rowHeight={40}
                        onCellClicked={handleCellClick} // Add this here
                    />
                </div>
            </Card>

            {/* Add Environment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">Add New Environment</h2>

                        {/* Environment Name */}
                        <div className="mb-4">
                            <label><strong>Environment Name:</strong></label>
                            <input
                                type="text"
                                value={newEnv.envName}
                                onChange={(e) => handleInputChange("envName", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Journey ID */}
                        <div className="mb-4">
                            <label><strong>Journey ID:</strong></label>
                            <input
                                type="text"
                                value={newEnv.journeyId}
                                onChange={(e) => handleInputChange("journeyId", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Message ID */}
                        <div className="mb-4">
                            <label><strong>Message ID:</strong></label>
                            <input
                                type="text"
                                value={newEnv.messageId}
                                onChange={(e) => handleInputChange("messageId", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Event Name */}
                        <div className="mb-4">
                            <label><strong>Event Name:</strong></label>
                            <input
                                type="text"
                                value={newEnv.eventName}
                                onChange={(e) => handleInputChange("eventName", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Change Log */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Change Log</h3>
                            {newEnv.changeLog.map((log, index) => (
                                <div key={index} className="mb-2">
                                    <label><strong>User:</strong></label>
                                    <input
                                        type="text"
                                        value={log.user}
                                        onChange={(e) => handleChangeLogInputChange(index, 'user', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    <label><strong>Comment:</strong></label>
                                    <input
                                        type="text"
                                        value={log.comment}
                                        onChange={(e) => handleChangeLogInputChange(index, 'comment', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            ))}
                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={addChangeLog}>Add Change Log</button>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex justify-end space-x-2">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeAddModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Environment Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">View Environment Details</h2>
                        <div>
                            <p><strong>Environment Name:</strong> {selectedRow.envName}</p>
                            <p><strong>Journey ID:</strong> {selectedRow.journeyId}</p>
                            <p><strong>Message ID:</strong> {selectedRow.messageId}</p>
                            <p><strong>Event Name:</strong> {selectedRow.eventName}</p>

                            <h3 className="text-lg font-semibold mt-4">Change Log</h3>
                            {selectedRow.changeLog.map((log, index) => (
                                <div key={index} className="mb-2">
                                    <p><strong>User:</strong> {log.user}</p>
                                    <p><strong>Time:</strong> {log.time}</p>
                                    <p><strong>Comment:</strong> {log.comment}</p>
                                </div>
                            )) || <p>No Change Log Available</p>}
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

export default EnvTable;