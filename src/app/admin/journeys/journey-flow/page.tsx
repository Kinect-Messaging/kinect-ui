'use client';
import { useSearchParams } from 'next/navigation';
import JourneyFlow from '../../../../components/flows/JourneyFlow';

const JourneyFlowPage = () => {
  const searchParams = useSearchParams();
  const journeyId = searchParams.get('id');

  return (
    <div className="h-screen w-full">
      {/* <h1 className="text-2xl font-bold mb-4">Journey Flow for ID: {journeyId}</h1> */}
      <div className="h-[calc(100vh-60px)]">
        <JourneyFlow journeyId={journeyId} />
      </div>
    </div>
  );
};

export default JourneyFlowPage;