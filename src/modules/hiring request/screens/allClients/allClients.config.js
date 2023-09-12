import { Link } from "react-router-dom";
import clienthappinessSurveyStyles from "../../../survey/client_happiness_survey.module.css";
import { ReactComponent as PencilSVG } from 'assets/svg/pencil.svg';
export const allClientsConfig = {
    allClientsTypeConfig : (filterList) => {
        return [
			{
				label: 'Status',
				name: 'companyStatus',
				child: filterList?.ContactStatus,
				isSearch: false,
			},
			{
				label: 'GEO',
				name: 'geo',
				child: filterList?.Geo,
				isSearch: true,
			},
            {
                label: 'Adding Source',
				name: 'addingSource',
				child: filterList?.AddingSource,
				isSearch: false,
            },
            {
                label: 'Category',
				name: 'category',
				child: filterList?.CompanyCategory,
				isSearch: false,
            },
            {
                label: 'POC',
				name: 'poc',
				child: filterList?.POCList,
				isSearch: true,
            }            		
		];
    },
    tableConfig : () => {
        return [
            {
                title: '',
                dataIndex: 'Edit',
                key: 'edit',
                align: 'left',
				width: '55px',
                render:() => {
                    return (
                        <Link
                        to={`/allhiringrequest/addnewclient`}
                        style={{ color: 'black', textDecoration: 'underline' }}>
                        <PencilSVG />
                    </Link>
                    )
                }
            },
            
            {
                title: 'Added Date',
                dataIndex: 'addedDate',
                key: 'addedDate',
            },
            {
                title: 'Company',
                dataIndex: 'companyName',
                key: 'companyName',
                render: (text, result) => {
					return (
						<Link
							to={`/viewClient/${result.companyID}~${result.clientID}`}
							style={{
								color: `var(--uplers-black)`,
								textDecoration: 'underline',
							}}>
							{text}
						</Link>
					);
				},
            },
            {
                title: 'Client Name',
                dataIndex: 'clientName',
                key: 'clientName',
            },
            {
                title: 'Client Email',
                dataIndex: 'clientEmail',
                key: 'clientEmail',
            },
            {
                title: 'POC',
                dataIndex: 'poc',
                key: 'poc',
                // render: (text, result) => {
				// 	return (
				// 		<Link
				// 			to={`/allclients`}
				// 			style={{
				// 				color: `var(--uplers-black)`,
				// 				textDecoration: 'underline',
				// 			}}>
				// 			{text}
				// 		</Link>
				// 	);
				// },
            },
            {
                title: 'Geo',
                dataIndex: 'geo',
                key: 'geo',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (text,result) => {
					return (
						text && <span 
                         className={clienthappinessSurveyStyles.StatusOpportunity} 
                         style={{backgroundColor:`${result.statusColor}`}} >{text}</span>			
					);
				},
            }
          ]; 
    },
    ViewClienttableConfig : () => {
        return [
            // {
            //     title: '',
            //     dataIndex: '',
            //     key: '',
            // },
            {
                title: 'Created Date',
                dataIndex: 'createdDateTime',
                key: 'createdDateTime',
                render: (text, result) =>{                     
                    return (text.split('T')[0])
                },
            },
            {
                title: 'HR ID',
                dataIndex: 'hR_ID',
                key: 'hR_ID',
            },
            {
                title: 'TR',
                dataIndex: 'totalTR',
                key: 'totalTR',
            },
            {
                title: 'Position',
                dataIndex: 'position',
                key: 'position',
            },
            {
                title: 'Budget/Mo',
                dataIndex: 'cost',
                key: 'cost',
            },
            {
                title: 'Notice',
                dataIndex: 'notice',
                key: 'notice',
            },
            {
                title: 'FTE/PTE',
                dataIndex: 'ftE_PTE',
                key: 'ftE_PTE',
            },
            ]
    }
}