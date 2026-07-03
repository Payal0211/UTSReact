import moment from 'moment';
import CompanyCell from './CompanyCell';
import { HrIdCell, HrTitleCell } from './HrCells';
import TaskStatusCell from './TaskStatusCell';
import { ProfileSharedTargetCell, ActiveProfileCountCell } from './ProfileCells';
import { HrStatusCell, LatestNotesCell } from './MiscCells';
import YesNoCell from './YesNoCell';

/**
 * Column definitions for the Scrum Intelligence / TA table, ag-Grid edition.
 * Anything that used a custom `render` in the old AntD columns now uses `cellRenderer`.
 * All app state/callbacks the renderers need come from the grid's `context` prop, not from
 * closures baked into this function — so this file can be a plain, static export.
 */
export const getScrumGridColumns = () => [
    {
        headerName: 'TA',
        field: 'taName',
        width: 150,
        pinned: 'left',
        sortable: false, 
    rowSpan: (params) => params.data?.rowSpan || 1, //[cite: 1]
    valueFormatter: (params) => params.data?.rowSpan > 0 ? params.value : '',
    // 👇 UPDATE THIS CELLSTYLE OBJECT
    cellStyle: { 
      alignItems: 'flex-start', 
      paddingTop: 10, 
      background: 'var(--ag-background-color, #fff)', //[cite: 1]
      
      // Adds a thick, clean border at the bottom of each TA group block
      borderBottom: '2px solid #e2e8f0', 
      // Ensures the vertical line on the right remains clear
      borderRight: '1px solid #e2e8f0'
    },
    },
    {
        headerName: 'Company',
        field: 'companyName',
        width: 220,
        pinned: 'left',
        cellRenderer: CompanyCell,
        sortable: false,
    },
    {
        headerName: 'HR ID',
        field: 'hrNumber',
        width: 170,
        pinned: 'left',
        cellRenderer: HrIdCell,
    },
    {
        headerName: 'HR Title',
        field: 'hrTitle',
        width: 200,
         pinned: 'left',
        cellRenderer: HrTitleCell,
        tooltipField: 'hrTitle',
    },
   
    {
        headerName: 'Status',
        field: 'taskStatus',
        width: 150,
             pinned: 'left',
        cellRenderer: TaskStatusCell,
    },
    {
        headerName: 'Submission Target On Given Date',
        field: 'profile_Shared_Target',
        width: 150,
        cellRenderer: ProfileSharedTargetCell,
    },
     {
        headerName: 'Submission Target Achieved',
        field: 'interview_Scheduled_Target',
        width: 150,
        // cellRenderer: ProfileSharedTargetCell,
    },
    {
        headerName: 'Active TRs',
        field: 'activeTR',
        width: 100,
    },
     {
        headerName: '# Interview Rounds',
        field: 'no_of_InterviewRounds',
        width: 120,
    },
    {
        headerName: 'Inbound / Outbound',
        field: 'role_Type',
        width: 140,
    },
    {
        headerName: 'No of Active Profile Till Date',
        field: 'noOfProfile_TalentsTillDate',
        width: 150,
        cellRenderer: ActiveProfileCountCell,
    },
    {
        headerName: 'Talent Annual CTC Budget (INR)',
        field: 'talent_AnnualCTC_Budget_INRValueStr',
        width: 170,
    },
    {
        headerName: 'Revenue %',
        field: 'uplersFeesPer',
        width: 150,
    },
    {
        headerName: 'Total Revenue Opportunity',
        field: 'totalRevenue_NoofTalentStr',
        width: 170,
    },
        {
        headerName: 'Latest Updates',
        field: 'latestNotes',
        width: 250,
        sortable: false,
        cellRenderer: LatestNotesCell,
    },
    {
        headerName: 'HR Status',
        field: 'tA_HR_Status',
        width: 130,
        cellRenderer: HrStatusCell,
    },
    {
        headerName: 'HR Created Date',
        field: 'hrCreatedDate',
        width: 150,
        valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YYYY') : ''),
    },
    {
        headerName: 'No Of Days HR Is Open',
        field: 'days',
        width: 170,
    },

    // {
    //     headerName: 'No Of Calls On Given Day',
    //     field: 'noOfCallsGivenDay',
    //     width: 170,
    // },
    // {
    //     headerName: 'Submission Target On Given Date',
    //     field: 'submissionTargetOnGivenDate',
    //     width: 220,
    // },
    // {
    //     headerName: 'Submission Target Achieved',
    //     field: 'interview_Scheduled_Target',
    //     width: 170,
    // },
    {
        headerName: 'Total No Of Submissions',
        field: 'totalNoOfSubmission',
        width: 170,
    },
    {
        headerName: 'Screen Reject',
        field: 'screenReject',
        width: 90,
    },
    { headerName: 'R1', field: 'r1', width: 80 },
    { headerName: 'R2', field: 'r2', width: 80 },
    { headerName: 'R3', field: 'r3', width: 80 },
    {
        headerName: 'Total No Of Interview Rejects',
        field: 'totalNoOfInterviewReject',
        width: 170,
    },
    {
        headerName: 'Weekly Selection Planned',
        field: 'weeklySelectionPlan',
        width: 170,
    },
    {
        headerName: 'Joining Date',
        field: 'joiningDate',
        width: 150,
    },
    {
        headerName: 'Hiring Manager AS POC (Y/N)',
        field: 'hmAsPOC',
        width: 100,
        sortable: false,
        cellRenderer: YesNoCell,
        cellRendererParams: { objKey: 'hmAsPOC' },
    },
];

/**
 * Sensible Excel-like defaults applied to every column unless overridden above.
 */
export const scrumDefaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressMovable: false, // lets users drag-reorder columns, like Excel column drag
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'ag-cell-excel-border',
};
