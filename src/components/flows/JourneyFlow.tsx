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

    // Create journey name node
    newNodes.push({
      id: 'journey-name',
      data: { label: journeyData.journeyName },
      position: { x: 250, y: 0 },
      type: 'input',
      draggable: true,
    });

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
        position: { x: 250, y: (index + 1) * 150 },
        draggable: true,
      };
      newNodes.push(stepNode);

      // Connect to previous node
      if (index === 0) {
        newEdges.push({
          id: `e-journey-${stepNodeId}`,
          source: 'journey-name',
          target: stepNodeId,
          animated: true,
        });
      } else {
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
          position: { x: 400 + configIndex * 200, y: (index + 1) * 150 },
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
    <div style={{ height: '100vh', width: '100%' }}>
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
  );
};

export default ({ journeyId }: JourneyFlowProps) => (
  <ReactFlowProvider>
    <JourneyFlow journeyId={journeyId} />
  </ReactFlowProvider>
);