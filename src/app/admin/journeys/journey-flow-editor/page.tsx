'use client';
import JourneyFlowEditor from '../../../../components/flows/JourneyFlowEditor';

const JourneyFlowEditorPage = () => {
    return (
        <div className="h-screen w-full">
            <h1 className="text-2xl font-bold mb-4">Create New Journey</h1>
            <JourneyFlowEditor />
        </div>
    );
};

export default JourneyFlowEditorPage;