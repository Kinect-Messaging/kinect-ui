// import React, { useState, useCallback } from 'react';
// import ReactFlow, {
//     addEdge,
//     Background,
//     Controls,
//     Connection,
//     Edge,
//     Node,
//     NodeChange,
//     EdgeChange,
//     applyNodeChanges,
//     applyEdgeChanges,
//     Handle,
//     Position,
//     MarkerType,
//     NodeProps,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from 'next/navigation';

// // Custom Node Components
// const EventNode = ({ data, id }: NodeProps) => (
//     <div className="border-2 border-blue-500 rounded p-2 bg-blue-100">
//         <Handle type="target" position={Position.Top} />
//         <div className="font-bold">Event</div>
//         <input
//             type="text"
//             value={data.label}
//             onChange={(e) => data.onChange(id, e.target.value)}
//             className="w-full p-1 text-sm"
//             placeholder="Enter event name"
//         />
//         <Handle type="source" position={Position.Bottom} />
//     </div>
// );

// const ConditionNode = ({ data, id }: NodeProps) => (
//     <div className="border-2 border-yellow-500 rounded p-2 bg-yellow-100">
//         <Handle type="target" position={Position.Top} />
//         <div className="font-bold">Condition</div>
//         <input
//             type="text"
//             value={data.label}
//             onChange={(e) => data.onChange(id, e.target.value)}
//             className="w-full p-1 text-sm"
//             placeholder="Enter condition"
//         />
//         <Handle type="source" position={Position.Bottom} id="true" />
//         <Handle type="source" position={Position.Right} id="false" />
//     </div>
// );

// const MessageNode = ({ data, id }: NodeProps) => (
//     <div className="border-2 border-green-500 rounded p-2 bg-green-100">
//         <Handle type="target" position={Position.Top} />
//         <div className="font-bold">Message</div>
//         <input
//             type="text"
//             value={data.label}
//             onChange={(e) => data.onChange(id, e.target.value)}
//             className="w-full p-1 text-sm"
//             placeholder="Enter message"
//         />
//         <Handle type="source" position={Position.Bottom} />
//     </div>
// );

// const nodeTypes = {
//     event: EventNode,
//     condition: ConditionNode,
//     message: MessageNode,
// };

// const JourneyFlowEditor = () => {
//     const [nodes, setNodes] = useState<Node[]>([]);
//     const [edges, setEdges] = useState<Edge[]>([]);
//     const [journeyName, setJourneyName] = useState('');
//     const router = useRouter();

//     const onNodesChange = useCallback(
//         (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//         []
//     );

//     const onEdgesChange = useCallback(
//         (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//         []
//     );

//     const onConnect = useCallback(
//         (params: Connection) => setEdges((eds) => addEdge({
//             ...params,
//             type: 'smoothstep',
//             animated: true,
//             markerEnd: {
//                 type: MarkerType.ArrowClosed,
//             },
//         }, eds)),
//         []
//     );

//     const addNode = (type: 'event' | 'condition' | 'message') => {
//         const newNode: Node = {
//             id: `${type}-${nodes.length + 1}`,
//             type,
//             position: { x: 250, y: 100 * (nodes.length + 1) },
//             data: {
//                 label: `New ${type}`,
//                 onChange: (id: string, newValue: string) => {
//                     setNodes((nds) =>
//                         nds.map((node) => {
//                             if (node.id === id) {
//                                 return { ...node, data: { ...node.data, label: newValue } };
//                             }
//                             return node;
//                         })
//                     );
//                 },
//             },
//         };
//         setNodes((nds) => [...nds, newNode]);
//     };

//     const saveJourney = async () => {
//         const journeyData = {
//             journeyId: uuidv4(),
//             journeyName,
//             journeySteps: nodes.map((node, index) => ({
//                 seqId: index + 1,
//                 eventName: node.type === 'event' ? node.data.label : '',
//                 stepCondition: node.type === 'condition' ? node.data.label : '',
//                 messageConfigs: node.type === 'message' ? { "1": node.data.label } : {},
//             })),
//             auditInfo: {
//                 createdBy: "Current User",
//                 createdTime: new Date().toISOString(),
//                 updatedBy: "Current User",
//                 updatedTime: new Date().toISOString(),
//             },
//         };

//         try {
//             const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY,
//                     'X-Transaction-Id': uuidv4()
//                 },
//                 body: JSON.stringify(journeyData),
//             });

//             if (response.ok) {
//                 router.push('/admin/journeys');
//             } else {
//                 console.error('Failed to add new journey');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div className="h-screen w-full flex flex-col p-4">
//             <div className="mb-4 flex items-center space-x-4">
//                 <input
//                     type="text"
//                     value={journeyName}
//                     onChange={(e) => setJourneyName(e.target.value)}
//                     placeholder="Enter Journey Name"
//                     className="p-2 border rounded flex-grow"
//                 />
//                 <button onClick={() => addNode('event')} className="bg-blue-500 text-white px-4 py-2 rounded">Add Event</button>
//                 <button onClick={() => addNode('condition')} className="bg-yellow-500 text-white px-4 py-2 rounded">Add Condition</button>
//                 <button onClick={() => addNode('message')} className="bg-green-500 text-white px-4 py-2 rounded">Add Message</button>
//                 <button onClick={saveJourney} className="bg-purple-500 text-white px-4 py-2 rounded">Save Journey</button>
//             </div>
//             <div className="flex-grow" style={{ height: 'calc(100vh - 100px)' }}>
//                 <ReactFlow
//                     nodes={nodes}
//                     edges={edges}
//                     onNodesChange={onNodesChange}
//                     onEdgesChange={onEdgesChange}
//                     onConnect={onConnect}
//                     nodeTypes={nodeTypes}
//                     fitView
//                 >
//                     <Background />
//                     <Controls />
//                 </ReactFlow>
//             </div>
//         </div>
//     );
// };

// export default JourneyFlowEditor;

import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    Connection,
    Edge,
    Node,
    NodeChange,
    EdgeChange,
    applyNodeChanges,
    applyEdgeChanges,
    Handle,
    Position,
    MarkerType,
    NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const JourneyNameNode = ({ data }: NodeProps) => (
    <div className="border-2 border-purple-500 rounded p-2 bg-purple-100">
        <div className="font-bold">Journey Name</div>
        <input
            type="text"
            value={data.label}
            onChange={(e) => data.onChange(data.id, 'label', e.target.value)}
            className="w-full p-1 text-sm"
            placeholder="Enter journey name"
        />
        <Handle type="source" position={Position.Bottom} />
    </div>
);

const JourneyStepNode = ({ data }: NodeProps) => (
    <div className="border-2 border-gray-500 rounded p-4 bg-gray-100">
        <div className="font-bold mb-2">Journey Step</div>
        <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium">Event Name:</label>
                <input
                    type="text"
                    value={data.eventName}
                    onChange={(e) => data.onChange(data.id, 'eventName', e.target.value)}
                    className="w-full p-1 text-sm border rounded"
                    placeholder="Enter event name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Step Condition:</label>
                <input
                    type="text"
                    value={data.stepCondition}
                    onChange={(e) => data.onChange(data.id, 'stepCondition', e.target.value)}
                    className="w-full p-1 text-sm border rounded"
                    placeholder="Enter step condition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Message Config 1:</label>
                <input
                    type="text"
                    value={data.messageConfigs['1']}
                    onChange={(e) => data.onChange(data.id, 'messageConfigs', { ...data.messageConfigs, '1': e.target.value })}
                    className="w-full p-1 text-sm border rounded"
                    placeholder="Enter message config 1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Message Config 2:</label>
                <input
                    type="text"
                    value={data.messageConfigs['2']}
                    onChange={(e) => data.onChange(data.id, 'messageConfigs', { ...data.messageConfigs, '2': e.target.value })}
                    className="w-full p-1 text-sm border rounded"
                    placeholder="Enter message config 2"
                />
            </div>
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
    </div>
);

const nodeTypes = {
    journeyName: JourneyNameNode,
    journeyStep: JourneyStepNode,
};

const JourneyFlowEditor = () => {
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: 'journeyName',
            type: 'journeyName',
            position: { x: 0, y: 0 },
            data: { label: 'New Journey', onChange: updateNodeData },
        },
    ]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const router = useRouter();

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
        }, eds)),
        []
    );

    function updateNodeData(nodeId: string, field: string, value: any) {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [field]: value,
                            onChange: updateNodeData,
                        },
                    };
                }
                return node;
            })
        );
    }

    const addJourneyStep = () => {
        const newNode: Node = {
            id: `journeyStep-${nodes.length}`,
            type: 'journeyStep',
            position: { x: 0, y: (nodes.length) * 200 },
            data: {
                eventName: '',
                stepCondition: '',
                messageConfigs: { '1': '', '2': '' },
                onChange: updateNodeData,
            },
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
            ...eds,
            {
                id: `e-${nodes.length - 1}-${nodes.length}`,
                source: nodes.length === 1 ? 'journeyName' : `journeyStep-${nodes.length - 2}`,
                target: `journeyStep-${nodes.length - 1}`,
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            },
        ]);
    };

    const saveJourney = async () => {
        const journeyNameNode = nodes.find((node) => node.type === 'journeyName');
        const journeyStepNodes = nodes.filter((node) => node.type === 'journeyStep');

        const journeyData = {
            journeyId: uuidv4(),
            journeyName: journeyNameNode?.data.label || 'Unnamed Journey',
            journeySteps: journeyStepNodes.map((node, index) => ({
                seqId: index + 1,
                eventName: node.data.eventName,
                stepCondition: node.data.stepCondition,
                messageConfigs: node.data.messageConfigs,
            })),
            auditInfo: {
                createdBy: "Current User",
                createdTime: new Date().toISOString(),
                updatedBy: "Current User",
                updatedTime: new Date().toISOString(),
            },
        };

        try {
            const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY || '',
                    'X-Transaction-Id': uuidv4()
                },
                body: JSON.stringify(journeyData),
            });

            if (response.ok) {
                router.push('/admin/journeys');
            } else {
                console.error('Failed to add new journey');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col p-4">
            <div className="mb-4 flex items-center space-x-4">
                <button onClick={addJourneyStep} className="bg-blue-500 text-white px-4 py-2 rounded">Add Journey Step</button>
                <button onClick={saveJourney} className="bg-green-500 text-white px-4 py-2 rounded">Save Journey</button>
            </div>
            <div className="flex-grow" style={{ height: 'calc(100vh - 100px)' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

export default JourneyFlowEditor;