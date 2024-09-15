// import "@glideapps/glide-data-grid/dist/index.css";
// import React, { useState, useCallback } from "react";
// import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
// import Card from 'components/card';

// type MessageData = {
//     name: string;
//     company: string;
//     email: string;
//     phone: string;
// };

// function MessageTable() {
//     const [data, setData] = useState<MessageData[]>([
//         {
//             "name": "Hines Fowler",
//             "company": "BUZZNESS",
//             "email": "hinesfowler@buzzness.com",
//             "phone": "+1 (869) 405-3127"
//         },
//         {
//             "name": "Hines Fowler",
//             "company": "BUZZNESS",
//             "email": "hinesfowler@buzzness.com",
//             "phone": "+1 (869) 405-3127"
//         },
//         {
//             "name": "Hines Fowler",
//             "company": "BUZZNESS",
//             "email": "hinesfowler@buzzness.com",
//             "phone": "+1 (869) 405-3127"
//         },
//         {
//             "name": "Hines Fowler",
//             "company": "BUZZNESS",
//             "email": "hinesfowler@buzzness.com",
//             "phone": "+1 (869) 405-3127"
//         },
//     ]);

//     const [selectedRow, setSelectedRow] = useState<MessageData | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedData, setEditedData] = useState<MessageData | null>(null);

//     const openModal = (row: MessageData) => {
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

//     const handleInputChange = (field: keyof MessageData, value: string) => {
//         if (editedData) {
//             setEditedData(prevData => ({
//                 ...prevData!,
//                 [field]: value
//             }));
//         }
//     };

//     const columns: GridColumn[] = [
//         { title: "Name", id: "name" },
//         { title: "Company", id: "company" },
//         { title: "Email", id: "email" },
//         { title: "Phone", id: "phone" },
//         { title: "View", id: "view" }
//     ];

//     const getCellContent = useCallback((cell: [number, number]): GridCell => {
//         const [col, row] = cell;
//         const dataRow = data[row];

//         if (columns[col].id === "view") {
//             return {
//                 kind: GridCellKind.Custom,
//                 allowOverlay: true,
//                 copyData: "View",
//                 data: <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>, // Render a button in the View column
//             };
//         }

//         const indexes: (keyof MessageData)[] = ["name", "company", "email", "phone"];
//         const d = dataRow[indexes[col]];
//         return {
//             kind: GridCellKind.Text,
//             allowOverlay: false,
//             displayData: d,
//             data: d,
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
//                     <div className="text-xl font-bold text-navy-700 dark:text-white">
//                         Messages Data Grid
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

//             {/* Modal for viewing and editing */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-6 w-full h-full">
//                         <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Details" : "View Details"}</h2>
//                         {selectedRow && (
//                             <div>
//                                 {isEditing ? (
//                                     <div>
//                                         <div>
//                                             <label><strong>Name:</strong></label>
//                                             <input
//                                                 type="text"
//                                                 value={editedData?.name}
//                                                 onChange={(e) => handleInputChange('name', e.target.value)}
//                                                 className="w-full border rounded p-2"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label><strong>Company:</strong></label>
//                                             <input
//                                                 type="text"
//                                                 value={editedData?.company}
//                                                 onChange={(e) => handleInputChange('company', e.target.value)}
//                                                 className="w-full border rounded p-2"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label><strong>Email:</strong></label>
//                                             <input
//                                                 type="email"
//                                                 value={editedData?.email}
//                                                 onChange={(e) => handleInputChange('email', e.target.value)}
//                                                 className="w-full border rounded p-2"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label><strong>Phone:</strong></label>
//                                             <input
//                                                 type="tel"
//                                                 value={editedData?.phone}
//                                                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                                                 className="w-full border rounded p-2"
//                                             />
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div>
//                                         <p><strong>Name:</strong> {selectedRow.name}</p>
//                                         <p><strong>Company:</strong> {selectedRow.company}</p>
//                                         <p><strong>Email:</strong> {selectedRow.email}</p>
//                                         <p><strong>Phone:</strong> {selectedRow.phone}</p>
//                                     </div>
//                                 )}
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

// export default MessageTable;

import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';

type ToRecipient = {
    firstName: string;
    lastName: string;
    emailAddress: string;
};

type TemplateConfig = {
    template_1: string;
    template_2: string;
};

type EmailConfig = {
    targetSystem: string;
    emailHeaders: string | null;
    senderAddress: string;
    subject: string;
    toRecipients: ToRecipient[];
    ccRecipients: string | null;
    bccRecipients: string | null;
    replyTo: string | null;
    attachments: string | null;
    personalizationData: string | null;
    templateConfig: TemplateConfig;
};

type AuditInfo = {
    createdBy: string;
    createdTime: string;
    updatedBy: string;
    updatedTime: string;
};

type MessageData = {
    messageId: string;
    messageName: string;
    messageVersion: number;
    messageCondition: string;
    messageStatus: string;
    emailConfig: EmailConfig[];
    journeyId: string;
    auditInfo: AuditInfo;
};

function MessageTable() {
    const [data, setData] = useState<MessageData[]>([]);
    const [selectedRow, setSelectedRow] = useState<MessageData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // View Message modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add Message modal
    const [newMessage, setNewMessage] = useState({ messageName: "", messageVersion: 1, messageCondition: "", messageStatus: "DEV", emailConfig: [] as EmailConfig[] }); // New Message State

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/message', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                        'X-Transaction-Id': uuidv4()
                    }
                });
                const result: MessageData[] = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error("Error fetching message data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle opening the modal to view details
    const openModal = (row: MessageData) => {
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
        setNewMessage({ messageName: "", messageVersion: 1, messageCondition: "", messageStatus: "DEV", emailConfig: [] });
    };

    // Add Email Config to the new message
    const addEmailConfig = () => {
        setNewMessage({
            ...newMessage,
            emailConfig: [...newMessage.emailConfig, {
                targetSystem: "AZURE_COMMUNICATION_SERVICE",
                emailHeaders: null,
                senderAddress: "",
                subject: "",
                toRecipients: [{ firstName: "", lastName: "", emailAddress: "" }],
                ccRecipients: null,
                bccRecipients: null,
                replyTo: null,
                attachments: null,
                personalizationData: null,
                templateConfig: { template_1: "", template_2: "" }
            }]
        });
    };

    // Handle input change in the form
    const handleInputChange = (field: keyof typeof newMessage, value: any) => {
        setNewMessage((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleEmailConfigInputChange = (index: number, field: keyof EmailConfig, value: any) => {
        const updatedEmailConfigs = [...newMessage.emailConfig];
        updatedEmailConfigs[index] = { ...updatedEmailConfigs[index], [field]: value };
        setNewMessage((prevData) => ({
            ...prevData,
            emailConfig: updatedEmailConfigs,
        }));
    };

    // Handle form submission to POST data
    const handleSubmit = async () => {
        const currentDate = new Date().toISOString();
        const newMessageData: MessageData = {
            messageId: uuidv4(),
            messageName: newMessage.messageName,
            messageVersion: newMessage.messageVersion,
            messageCondition: newMessage.messageCondition,
            messageStatus: newMessage.messageStatus,
            emailConfig: newMessage.emailConfig,
            journeyId: "journey_1", // Assuming a fixed journeyId for now, can be adjusted
            auditInfo: {
                createdBy: "Current User", // Replace with actual user if available
                createdTime: currentDate,
                updatedBy: "Current User",
                updatedTime: currentDate,
            },
        };

        try {
            const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
                    'X-Transaction-Id': uuidv4()
                },
                body: JSON.stringify(newMessageData),
            });

            if (response.ok) {
                const result = await response.json();
                setData([...data, result]); // Add the new message to the data table
                closeAddModal();
            } else {
                console.error('Failed to add new message');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns: GridColumn[] = [
        { title: "Message Name", id: "messageName" },
        { title: "Version", id: "messageVersion" },
        { title: "Condition", id: "messageCondition" },
        { title: "Status", id: "messageStatus" },
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

    return (
        <div>
            <Card extra={'w-full h-full sm:overflow-auto px-6'} className="w-full">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Messages Data Grid</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={openAddModal}>Add Message</button>
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

            {/* Add Message Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">Add New Message</h2>

                        {/* Message Name */}
                        <div className="mb-4">
                            <label><strong>Message Name:</strong></label>
                            <input
                                type="text"
                                value={newMessage.messageName}
                                onChange={(e) => handleInputChange("messageName", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Message Version */}
                        <div className="mb-4">
                            <label><strong>Message Version:</strong></label>
                            <input
                                type="number"
                                value={newMessage.messageVersion}
                                onChange={(e) => handleInputChange("messageVersion", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Message Condition */}
                        <div className="mb-4">
                            <label><strong>Message Condition:</strong></label>
                            <input
                                type="text"
                                value={newMessage.messageCondition}
                                onChange={(e) => handleInputChange("messageCondition", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Message Status */}
                        <div className="mb-4">
                            <label><strong>Message Status:</strong></label>
                            <input
                                type="text"
                                value={newMessage.messageStatus}
                                onChange={(e) => handleInputChange("messageStatus", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Email Config */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Email Config</h3>
                            {newMessage.emailConfig.map((config, index) => (
                                <div key={index} className="mb-2">
                                    <label><strong>Sender Address:</strong></label>
                                    <input
                                        type="text"
                                        value={config.senderAddress}
                                        onChange={(e) => handleEmailConfigInputChange(index, 'senderAddress', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    <label><strong>Subject:</strong></label>
                                    <input
                                        type="text"
                                        value={config.subject}
                                        onChange={(e) => handleEmailConfigInputChange(index, 'subject', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {/* Template Config */}
                                    <label><strong>Template Config 1:</strong></label>
                                    <input
                                        type="text"
                                        value={config.templateConfig.template_1}
                                        onChange={(e) => handleEmailConfigInputChange(index, 'templateConfig', { ...config.templateConfig, template_1: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                    <label><strong>Template Config 2:</strong></label>
                                    <input
                                        type="text"
                                        value={config.templateConfig.template_2}
                                        onChange={(e) => handleEmailConfigInputChange(index, 'templateConfig', { ...config.templateConfig, template_2: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            ))}
                            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={addEmailConfig}>Add Email Config</button>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex justify-end space-x-2">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeAddModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Message Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full h-full">
                        <h2 className="text-xl font-bold mb-4">View Message Details</h2>
                        <div>
                            <p><strong>Message Name:</strong> {selectedRow.messageName}</p>
                            <p><strong>Version:</strong> {selectedRow.messageVersion}</p>
                            <p><strong>Condition:</strong> {selectedRow.messageCondition}</p>
                            <p><strong>Status:</strong> {selectedRow.messageStatus}</p>

                            <h3 className="text-lg font-semibold mt-4">Email Config</h3>
                            {selectedRow.emailConfig.map((config, index) => (
                                <div key={index} className="mb-2">
                                    <p><strong>Sender Address:</strong> {config.senderAddress}</p>
                                    <p><strong>Subject:</strong> {config.subject}</p>
                                    <p><strong>Template Config 1:</strong> {config.templateConfig.template_1}</p>
                                    <p><strong>Template Config 2:</strong> {config.templateConfig.template_2}</p>
                                </div>
                            )) || <p>No Email Config Available</p>}

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

export default MessageTable;