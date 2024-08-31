'use client';
import JourneyTable from 'components/admin/journeys/JourneyTable';

const Tables = () => {
    return (
        <div>
            <div className="mt-5 grid h-full grid-cols-1 gap-5">
                <div className="col-span-1 w-full">
                    <JourneyTable />
                </div>
            </div>
        </div>
    );
};

export default Tables;
