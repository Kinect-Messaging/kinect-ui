'use client'
import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind } from "@glideapps/glide-data-grid";
import Card from 'components/card';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

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
    const router = useRouter();

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY || '',
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

    const navigateToJourneyFlow = useCallback((journeyId: string) => {
        router.push(`/admin/journeys/journey-flow?id=${journeyId}`);
    }, [router]);

    const navigateToJourneyFlowEditor = useCallback((journeyId: string) => {
        router.push(`/admin/journeys/journey-flow-editor?id=${journeyId}`);
    }, [router]);

    const columns: GridColumn[] = [
        { title: "Journey ID", id: "journeyId" },
        { title: "Journey Name", id: "journeyName" },
        { title: "Created By", id: "createdBy" },
        { title: "Created Time", id: "createdTime" },
        { title: "Updated By", id: "updatedBy" },
        { title: "Last Updated Time", id: "updatedTime" },
        { title: "View", id: "view" },
        { title: "Edit", id: "edit" }
    ];

    const getCellContent = useCallback((cell: [number, number]): GridCell => {
        const [col, row] = cell;
        const dataRow = data[row];
        const columnId = columns[col].id;

        let cellData: string;
        switch (columnId) {
            case "journeyId":
                cellData = dataRow.journeyId;
                break;
            case "journeyName":
                cellData = dataRow.journeyName;
                break;
            case "createdBy":
                cellData = dataRow.auditInfo.createdBy;
                break;
            case "createdTime":
                cellData = new Date(dataRow.auditInfo.createdTime).toLocaleString();
                break;
            case "updatedBy":
                cellData = dataRow.auditInfo.updatedBy;
                break;
            case "updatedTime":
                cellData = new Date(dataRow.auditInfo.updatedTime).toLocaleString();
                break;
            case "view":
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: true,
                    copyData: "View",
                    data: { kind: "button-cell", label: "View", onClick: () => navigateToJourneyFlow(dataRow.journeyId) },
                };
            case "edit":
                return {
                    kind: GridCellKind.Custom,
                    allowOverlay: true,
                    copyData: "Edit",
                    data: { kind: "button-cell", label: "Edit", onClick: () => navigateToJourneyFlowEditor(dataRow.journeyId) },
                };
            default:
                cellData = "";
        }

        return {
            kind: GridCellKind.Text,
            allowOverlay: false,
            readonly: true,
            displayData: cellData,
            data: cellData
        };
    }, [data, columns, navigateToJourneyFlow, navigateToJourneyFlowEditor]);

    const onCellClicked = useCallback((cell: [number, number], event: any) => {
        const [col, row] = cell;
        const columnId = columns[col].id;
        const dataRow = data[row];

        if (columnId === "view") {
            navigateToJourneyFlow(dataRow.journeyId);
        } else if (columnId === "edit") {
            navigateToJourneyFlowEditor(dataRow.journeyId);
        }
    }, [columns, data, navigateToJourneyFlow, navigateToJourneyFlowEditor]);

    return (
        <div>
            <Card extra={'w-full h-full sm:overflow-auto px-6'} className="w-full">
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Journeys Data Grid</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigateToJourneyFlowEditor('')}>Add Journey</button>
                </header>

                <div className="mt-8 h-full w-full">
                    <DataEditor
                        getCellContent={getCellContent}
                        columns={columns}
                        rows={data.length}
                        className="custom-data-editor h-full w-full"
                        headerHeight={40}
                        rowHeight={40}
                        onCellClicked={onCellClicked}
                    />
                </div>
            </Card>
        </div>
    );
}

export default JourneyTable;