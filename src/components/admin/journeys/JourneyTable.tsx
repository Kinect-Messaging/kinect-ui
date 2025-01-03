'use client'
import "@glideapps/glide-data-grid/dist/index.css";
import React, { useState, useEffect, useCallback } from "react";
import { DataEditor, GridColumn, GridCell, GridCellKind} from "@glideapps/glide-data-grid";
import Card from 'components/card';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { utils, read, writeFileXLSX, WorkBook } from 'xlsx'
import { background } from "@chakra-ui/system";

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
    const [csvData, setCsvData] = useState<JourneyData[]>([])
    const router = useRouter();

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try { 
                // const response = await axios.get('https://dev.kinectmessaging.com/config/v1/kinect/messaging/config/journey', {
                const response = await axios.get('http://127.0.0.1:3658/m1/751759-728861-fff5b274/{1}', {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_SUBSCRIPTION_KEY || '',
                        'X-Transaction-Id': uuidv4()
                    }
                });
                const result: JourneyData[] = response.data;
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
        { title: "Last Updated Time", id: "updatedTime" }
        // { title: "View", id: "view" },
        // { title: "Edit", id: "edit" }
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
            // case "view":
            //     return {
            //         kind: GridCellKind.Custom,
            //         allowOverlay: true,
            //         copyData: "View",
            //         data: { kind: "button-cell", label: "View", onClick: () => navigateToJourneyFlow(dataRow.journeyId) },
            //     };
            // case "edit":
            //     return {
            //         kind: GridCellKind.Custom,
            //         allowOverlay: true,
            //         copyData: "Edit",
            //         data: { kind: "button-cell", label: "Edit", onClick: () => navigateToJourneyFlowEditor(dataRow.journeyId) },
            //     };
            default:
                // cellData = "";
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
        // const columnId = columns[col].id;
        const dataRow = data[row];

        // if (columnId === "view") {
        if(col === -1){
            //rows selection for export
            setCsvData((prevData) => {
                // Check if an item with the same id already exists
                const exists = prevData.some((item) => item.journeyId === dataRow.journeyId);
                if (exists) {
                    return prevData; // Return the existing array if id is the same
                }
                return [...prevData, dataRow]; // Add new item if id is unique
            });
            
            console.log(csvData)
        }else{
            navigateToJourneyFlow(dataRow.journeyId);
        }
            
        // } else if (columnId === "edit") {
            // navigateToJourneyFlowEditor(dataRow.journeyId);
        // }
    }, [columns, data, navigateToJourneyFlow, navigateToJourneyFlowEditor]);

    const flatten = (obj, path = '') => {        
        if (!(obj instanceof Object)) return {[path.replace(/\.$/g, '')]:obj};
    
        return Object.keys(obj).reduce((output, key) => {
            return obj instanceof Array ? 
                 {...output, ...flatten(obj[key], path +  '[' + key + '].')}:
                 {...output, ...flatten(obj[key], path + key + '.')};
        }, {});
    }

    // export data
    const exportXLSX = () => {
        let dataToExport = flatten(csvData)
        console.log('csvdata ',JSON.stringify(csvData))
        console.log('datatoexport ',JSON.stringify(dataToExport))
        // generate worksheet using data with the order specified in the columns array
        const ws = utils.json_to_sheet(dataToExport, {header: columns.map(c => c.id ?? c.title)});
        // rewrite header row with titles
        utils.sheet_add_aoa(ws, [columns.map(c => c.title ?? c.id)], {origin: "A1"});
        // create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Export"); // replace with sheet name
        // download file
        writeFileXLSX(wb, "Journey-Data.xlsx");
    };

    return (
        <div>
            <Card extra={'w-full h-full sm:overflow-auto px-2'} className="w-full" style={{padding:'10px', backgroundColor:'#fff', borderRadius: '2%'}}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Journeys Data Grid</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigateToJourneyFlowEditor('')}>Add Journey</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => exportXLSX()}>Export to CSV</button>
                </header>

                <div className="mt-8 h-full w-full">
                    <DataEditor
                        getCellContent={getCellContent}
                        columns={columns}
                        rows={data.length}
                        className="custom-data-editor h-full w-full"
                        headerHeight={40}
                        rowHeight={40}
                        rowMarkers="checkbox-visible"
                        onCellClicked={onCellClicked}
                        theme={{
                            accentColor :"#ffffff",
                            bgCell: "#ffffff",            // Background color for cells
                            bgHeader: "#cccccc",
                            borderColor: "transparent",
                            textHeader: "#000",
                            textHeaderSelected: "#000"
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}

export default JourneyTable;