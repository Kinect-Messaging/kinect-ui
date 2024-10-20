import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  Controls,
  Background,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
  NodeChange,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

interface JourneyFlowProps {
  journeyId: string | null;
}

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

const StepNode = ({ data }: { data: any }) => (
  <div className="border rounded p-2 bg-white">
    <Handle type="target" position={Position.Top} />
    <div className="font-bold">{data.label}</div>
    <div className="text-sm">Condition: {data.condition}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const ConfigNode = ({ data }: { data: any }) => (
  <div className="border rounded p-2 bg-gray-100">
    <Handle type="target" position={Position.Left} />
    <div className="font-bold">{data.label}</div>
    <div className="text-sm">{data.value}</div>
  </div>
);

const nodeTypes = {
  step: StepNode,
  config: ConfigNode,
};

const JourneyFlow: React.FC<JourneyFlowProps> = ({ journeyId }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [journeyName, setJourneyName] = useState<string>('');

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (journeyId) {
        try {
          const response = await fetch(`https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey/${journeyId}`, {
            headers: {
              'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY || '',
              'X-Transaction-Id': uuidv4()
            }
          });
          const journeyData: JourneyData = await response.json();
          setJourneyName(journeyData.journeyName);
          createNodesAndEdges(journeyData);
        } catch (error) {
          console.error("Error fetching journey data:", error);
        }
      }
    };

    fetchJourneyData();
  }, [journeyId]);

  const createNodesAndEdges = (journeyData: JourneyData) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Create nodes and edges for each journey step
    journeyData.journeySteps?.forEach((step, index) => {
      const stepNodeId = `step-${step.seqId}`;
      const stepNode: Node = {
        id: stepNodeId,
        type: 'step',
        data: {
          label: `Step ${step.seqId}: ${step.eventName}`,
          condition: step.stepCondition,
        },
        position: { x: 250, y: index * 150 },
        draggable: true,
      };
      newNodes.push(stepNode);

      // Connect to previous node
      if (index > 0) {
        const prevNodeId = `step-${journeyData.journeySteps[index - 1].seqId}`;
        newEdges.push({
          id: `e-${prevNodeId}-${stepNodeId}`,
          source: prevNodeId,
          target: stepNodeId,
          animated: true,
        });
      }

      // Create nodes for message configs
      Object.entries(step.messageConfigs).forEach(([configKey, configValue], configIndex) => {
        const configNodeId = `config-${step.seqId}-${configKey}`;
        const configNode: Node = {
          id: configNodeId,
          type: 'config',
          data: {
            label: `Config ${configKey}`,
            value: configValue,
          },
          position: { x: 400 + configIndex * 200, y: index * 150 },
          draggable: true,
        };
        newNodes.push(configNode);

        // Connect step node to config node
        newEdges.push({
          id: `e-${stepNodeId}-${configNodeId}`,
          source: stepNodeId,
          target: configNodeId,
          animated: false,
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Journey Flow</h1>
        <h2 className="text-xl">{journeyName}</h2>
      </div>
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ({ journeyId }: JourneyFlowProps) => (
  <ReactFlowProvider>
    <JourneyFlow journeyId={journeyId} />
  </ReactFlowProvider>
);