import { Link } from "react-router-dom";
import clienthappinessSurveyStyles from '../../../survey/client_happiness_survey.module.css';
export const clientHappinessSurveyConfig = {
	clientSurveyFilterTypeConfig: (filterList) => {
		return [
			{
				label: 'Feedback Status',
				name: 'feedbackStatus',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Pending',
						value: 'Feedback Pending',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Completed',
						value: 'Completed',
					},
				],
				isSearch: false,
			},
			{
				label: 'Options',
				name: 'options',
				child: filterList,
				isSearch: false,
			},
            {
				label: 'Question',
				name: 'question',
				isSearch: false,
				isText: true
			},			
		];
	},
	ratingOptions:() => {
		return [
			{
				value: 0,
				label: '00',
			},
			{
				value: 1,
				label: '01',
			},
			{
				value: 2,
				label: '02',
			},
			{
				value: 3,
				label: '03',
			},
			{
				value: 4,
				label: '04',
			},
			{
				value: 5,
				label: '05',
			},
			{
				value: 6,
				label: '06',
			},
			{
				value: 7,
				label: '07',
			},
			{
				value: 8,
				label: '08',
			},
			{
				value: 9,
				label: '09',
			},
			{
				value: 10,
				label: '10',
			},
			]
	},
	tableConfig:(onEmailSend) => {
		return  [
			{
				title: 'Date',
				dataIndex: 'addedDate',
				key: 'addedDate',
				width: '130px',
			},
			{
				title: 'Feedback Date',
				dataIndex: 'feedbackDate',
				key: 'feedbackDate',
				width: '160px',
			},
			{
				title: 'Category',
				dataIndex: 'category',
				key: 'category',
				width: '100px',
			},
			{
				title: 'Company',
				dataIndex: 'company',
				key: 'company',
				width: '240px',
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				width: '200px',
			},
			{
				title: 'Rating',
				dataIndex: 'rating',
				key: 'rating',
				width: '100px',
			},
			{
				title: 'Feedback Status',
				dataIndex: 'feedbackStatus',
				key: 'feedbackStatus',
				width: '160px',
				render: (text,result) => {
					return (
						<span className={result.feedbackStatus === 'Completed' ? clienthappinessSurveyStyles.StatusCompleted : clienthappinessSurveyStyles.StatusPending}>{text}</span>
					);
				},
			},
			{
				title: 'Sales Rep',
				dataIndex: 'sales',
				key: 'sales',
				width: '100px',
				render: (text, result) => {
					return (
						<Link
							to={`/user/${result?.id}`}
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
				title: 'Question',
				dataIndex: 'question',
				key: 'question',
				width: '250px',
			},
			{
				title: 'Options',
				dataIndex: 'options',
				key: 'options',
				width: '250px',
			},
			{
				title: 'Comments',
				dataIndex: 'comments',
				key: 'comments',
				width: '250px',
			},
			{
				title: 'Link',
				dataIndex: 'link',
				key: 'link',
				width: '400px',
				render:(text,val) => {
					return(
						<p>{val.feedbackDate ? text : ""}</p>
						// <Link
						// 	to={text}
						// 	style={{
						// 		color: `var(--uplers-black)`,
						// 		textDecoration: 'underline',
						// 	}}>
						// 	{text}
						// </Link>
					)
				}
			},
			{
				title: 'Action',
				dataIndex: 'is_EmailSend',
				key: 'is_EmailSend',
				width: '150px',
				render: (text,result) => {
					return (
						text ? <span>Already Sent</span> : <button className={`${clienthappinessSurveyStyles.btnPrimary} ${clienthappinessSurveyStyles.emailSendBtn}`} onClick={() => onEmailSend(result.id)}>Send Email</button>						
					);
				},
			},
		];
	}
	
};
