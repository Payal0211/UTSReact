import { themeQuartz } from 'ag-grid-community';

/**
 * Excel-like theme: visible gridlines on every cell, compact rows, a solid header,
 * and alternating row shading similar to a spreadsheet.
 * Tweak the params below to match UTSReact's design tokens instead of retheming via CSS.
 */
export const scrumGridTheme = themeQuartz.withParams({
    spacing: 6,
    headerHeight: 44,
    rowHeight: 44,
    headerBackgroundColor: '#F4F6F8',
    headerTextColor: '#1F2937',
    headerFontWeight: 600,
    oddRowBackgroundColor: '#FAFBFC',
    rowHoverColor: '#EEF3FF',
    borderColor: '#D9DEE3',
    wrapperBorder: true,
    rowBorder: true,
    columnBorder: true, // vertical gridlines, the thing that makes it read as "Excel"
    fontSize: 13,
    accentColor: '#2F5DFF',
});
