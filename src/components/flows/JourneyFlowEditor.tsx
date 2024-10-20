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

type Message = {
    id: string;
    content: string;
};

type JourneyStep = {
    id: string;
    eventName: string;
    stepCondition: string;
    messages: Message[];
    childSteps: string[]; // Array of child step IDs
};

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
                <label className="block text-sm font-medium">Messages:</label>
                {data.messages.map((message: Message, index: number) => (
                    <input
                        key={message.id}
                        type="text"
                        value={message.content}
                        onChange={(e) => data.onMessageChange(data.id, message.id, e.target.value)}
                        className="w-full p-1 text-sm border rounded mt-1"
                        placeholder={`Enter message ${index + 1}`}
                    />
                ))}
                <button 
                    onClick={() => data.addMessage(data.id)} 
                    className="mt-1 bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                    Add Message
                </button>
            </div>
        </div>
        <div className="mt-2">
            <button 
                onClick={() => data.addChildStep(data.id)} 
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
                Add Child Step
            </button>
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
                            addMessage,
                            onMessageChange,
                            addChildStep,
                        },
                    };
                }
                return node;
            })
        );
    }

    function addMessage(nodeId: string) {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    const newMessage: Message = { id: uuidv4(), content: '' };
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            messages: [...(node.data.messages || []), newMessage],
                        },
                    };
                }
                return node;
            })
        );
    }

    function onMessageChange(nodeId: string, messageId: string, content: string) {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            messages: node.data.messages.map((msg: Message) =>
                                msg.id === messageId ? { ...msg, content } : msg
                            ),
                        },
                    };
                }
                return node;
            })
        );
    }

    function addChildStep(parentId: string) {
        const newNode: Node = {
            id: uuidv4(),
            type: 'journeyStep',
            position: { x: 0, y: 0 }, // You'll need to calculate appropriate positions
            data: {
                eventName: '',
                stepCondition: '',
                messages: [],
                onChange: updateNodeData,
                addMessage,
                onMessageChange,
                addChildStep,
            },
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
            ...eds,
            {
                id: `e-${parentId}-${newNode.id}`,
                source: parentId,
                target: newNode.id,
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            },
        ]);
    }

    const saveJourney = async () => {
        const journeyNameNode = nodes.find((node) => node.type === 'journeyName');
        const journeyStepNodes = nodes.filter((node) => node.type === 'journeyStep');

        const buildJourneyStep = (node: Node): JourneyStep => {
            const childSteps = edges
                .filter(edge => edge.source === node.id)
                .map(edge => edge.target);

            return {
                id: node.id,
                eventName: node.data.eventName,
                stepCondition: node.data.stepCondition,
                messages: node.data.messages || [],
                childSteps,
            };
        };

        const journeySteps = journeyStepNodes.map(buildJourneyStep);

        const journeyData = {
            journeyId: uuidv4(),
            journeyName: journeyNameNode?.data.label || 'Unnamed Journey',
            rootStep: journeySteps[0], // Assuming the first step is the root
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
                <button onClick={() => addChildStep('journeyName')} className="bg-blue-500 text-white px-4 py-2 rounded">Add Root Step</button>
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