import { Space, Table, Tag } from 'antd';
import allHRStyles from "../../../hiring request/screens/allHiringRequest/all_hiring_request.module.css";
import dealDetailsStyles from "./dealDetailsStyle.module.css";
import arrow from "../../../../assets/svg/trending.svg";

const columns = [
    {
        title: '',
        dataIndex: '',
        key: '',
        render: () => <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M8.5 0.560127L10.9028 5.37762C10.9394 5.45097 11.0096 5.50173 11.0907 5.51346L16.4589 6.29L12.5765 10.0324C12.5168 10.09 12.4895 10.1734 12.5037 10.2551L13.4204 15.5451L8.61542 13.0443C8.54308 13.0066 8.45692 13.0066 8.38458 13.0443L3.57956 15.5451L4.49633 10.2551C4.51049 10.1734 4.48321 10.09 4.4235 10.0324L0.541081 6.29L5.90929 5.51346C5.99042 5.50173 6.06063 5.45097 6.09722 5.37762L8.5 0.560127Z" stroke="#232323" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    },
    {
        title: 'O/P',
        dataIndex: 'op',
        key: 'op',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'HR ID',
        dataIndex: 'hr_id',
        key: 'hr_id',
        render: text => <a href="#" style={{ color: "black", textDecoration: "underline" }}>{text}</a>
    },
    {
        title: 'TR',
        dataIndex: 'tr',
        key: 'tr',
    },
    {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
    },
    {
        title: 'Budget/Mo',
        dataIndex: 'budgetmo',
        key: 'budgetmo',
    },
    {
        title: 'Notice',
        dataIndex: 'notice',
        key: 'notice',
    },
    {
        title: 'FTE/PTE',
        dataIndex: 'fte_pte',
        key: 'fte_pte',
    },
    {
        title: 'HR Status',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
];
const data = [
    {
        op: "O + P",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "UX/UI Designer",
        budgetmo: "1500 USD",
        notice: "30 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["Profile Shared"],
    },
    {
        op: "Pool",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "Quality Analyst",
        budgetmo: "1200 USD",
        notice: "60 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["Info Pending"],
    },
    {
        op: "O + P",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "Search Engine Optimisation",
        budgetmo: "900 USD",
        notice: "40 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["HR Accepted"],
    },
    {
        op: "Pool",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "Search Engine Optimisation",
        budgetmo: "1200 USD",
        notice: "90 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["Started Searching"],
    },
    {
        op: "ODR",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "Front End Developer",
        budgetmo: "1200 USD",
        notice: "30 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["In Process "],
    },
    {
        op: "O + P",
        date: "04/03/22",
        hr_id: "HR123456789012",
        tr: "07",
        position: "UX/UI Designer",
        budgetmo: "900 USD",
        notice: "40 Days",
        fte_pte: "FTE",
        hr_status: "Profile Shared",
        tags: ["Hired"],
    }
];

const DealDetails = () => {
    return (<>
        <div className={dealDetailsStyles.dealDetailsWrap}>
            <div className={dealDetailsStyles.dealDetailsBack}>
                <a href='#'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "16px" }}><path d="M15.5 19L8.5 12L15.5 5" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Go Back
                </a>
            </div>
            <div className={dealDetailsStyles.dealDetailsTitle}>
                <h1><img src="https://www.w3schools.com/howto/img_avatar.png" alt="food network" />Save Eat Foods Pvt Ltd - New Deal</h1>
                <button type="button">View BQ Form</button>
            </div>

            <div className={dealDetailsStyles.dealDetailsTopCard}>
                <ul>
                    <li>
                        <div className={dealDetailsStyles.topCardItem}>
                            <span>Stage</span> SAL Achieved
                        </div>
                    </li>
                    <li>
                        <div className={dealDetailsStyles.topCardItem}>
                            <span>Deal Owner</span> Prachi Porwal
                        </div>
                    </li>
                    <li>
                        <div className={dealDetailsStyles.topCardItem}>
                            <span>Deal Type</span> New Business
                        </div>
                    </li>
                    <li>
                        <div className={dealDetailsStyles.topCardItem}>
                            <span>POC</span> Silvia Gomez
                        </div>
                    </li>
                </ul>
            </div>

            <div className={dealDetailsStyles.dealDetailsCard}>
                <div className={dealDetailsStyles.dealLeftCard}>
                    <div className={dealDetailsStyles.dealLeftItem}>
                        <h2>Company Details</h2>
                        <ul>
                            <li><span>URL:</span> saveeat.au</li>
                            <li><span>Location:</span> Australia</li>
                            <li><span>Size:</span> 500</li>
                            <li><span>Location:</span> Australia</li>
                            <li><span>Address:</span> Queens, Brisbane, Australia</li>
                            <li><span>Linkedin:</span> saveeatfood<a href='#' target="_blank" className={dealDetailsStyles.dealItemLink}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.8165 0H1.18016C0.529039 0 0 0.516431 0 1.15372V14.8455C0 15.4826 0.529039 16 1.18016 16H14.8165C15.4688 16 16 15.4826 16 14.8455V1.15372C16 0.516431 15.4688 0 14.8165 0Z" fill="#007BB6"></path>
                                <path d="M3.55837 2.20312C4.31761 2.20312 4.93387 2.81968 4.93387 3.5792C4.93387 4.33903 4.31761 4.95558 3.55837 4.95558C2.79622 4.95558 2.18164 4.33903 2.18164 3.5792C2.18164 2.81968 2.79622 2.20312 3.55837 2.20312ZM2.37007 5.99873H4.7456V13.6342H2.37007V5.99873Z" fill="white"></path>
                                <path d="M6.23438 5.99809H8.50916V7.04186H8.54172C8.85822 6.44158 9.63251 5.80859 10.787 5.80859C13.1899 5.80859 13.6339 7.38952 13.6339 9.44588V13.6335H11.2611V9.92039C11.2611 9.03495 11.2457 7.89582 10.0279 7.89582C8.79311 7.89582 8.60468 8.86096 8.60468 9.85697V13.6335H6.23438V5.99809Z" fill="white"></path>
                            </svg></a></li>
                            <li><span>Phone:</span> +61 4336 25656</li>
                            <li><span>Lead Source:</span> Outbound</li>
                        </ul>
                    </div>
                    <div className={dealDetailsStyles.dealLeftItem}>
                        <h2>Lead Details</h2>
                        <ul>
                            <li><span>Deal ID:</span> 349854379</li>
                            <li><span>Lead Source:</span> Outbound</li>
                            <li><span>Pipeline:</span> Conversion</li>
                            <li><span>BDR:</span> Madhava Achaval</li>
                            <li><span>Sales Consultant:</span> Sid Hans</li>
                        </ul>
                    </div>
                    <div className={dealDetailsStyles.dealLeftItem}>
                        <h2>Primary Client</h2>
                        <ul>
                            <li><span>Name:</span> Rachel Green</li>
                            <li><span>Email:</span> rachel@gmail.com</li>
                            <li><span>Phone:</span> +61 6583 849643</li>
                            <li><span>Linkedin:</span> Rachel Green</li>
                        </ul>
                    </div>
                    <div className={dealDetailsStyles.dealLeftItem}>
                        <h2>Secondary Client</h2>
                        <ul>
                            <li><span>Name:</span> Rachel Green</li>
                            <li><span>Email:</span> rachel@gmail.com</li>
                            <li><span>Phone:</span> +61 6583 849643</li>
                            <li><span>Linkedin:</span> Rachel Green</li>
                        </ul>
                    </div>
                </div>
                <div className={dealDetailsStyles.dealRightCard}>
                    <div className={dealDetailsStyles.dealActivity}>
                        <h2>Deal Activity</h2>
                        <ul>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>Today</span><br />
                                    <span>12:29 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Note from</span> <a href="#">Prerna Dham</a></p>
                                    <p>“Call done in the month of Oct 2022, sent a couple of emails and the client mentioned he is busy and will get back to us. We will approach again in the month of Jan 2023.”</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>Today</span><br />
                                    <span>12:29 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Prospect to Future Prospect.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>24/06/2022</span><br />
                                    <span>01:56 AM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Prospect to Future Prospect.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>22/06/2022</span><br />
                                    <span>04:56 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Discovery call Scheduled to Discover call Rescheduled.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>22/06/2022</span><br />
                                    <span>04:56 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal to Discovery call Scheduled.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Ankit Pandya</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>Today</span><br />
                                    <span>12:29 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Note from</span> <a href="#">Prerna Dham</a></p>
                                    <p>“Call done in the month of Oct 2022, sent a couple of emails and the client mentioned he is busy and will get back to us. We will approach again in the month of Jan 2023.”</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>Today</span><br />
                                    <span>12:29 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Prospect to Future Prospect.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>24/06/2022</span><br />
                                    <span>01:56 AM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Prospect to Future Prospect.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>22/06/2022</span><br />
                                    <span>04:56 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal from Discovery call Scheduled to Discover call Rescheduled.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Saptarshi Banerjee</p>
                                </div>
                            </li>
                            <li>
                                <div className={dealDetailsStyles.dealActivityTime}>
                                    <span>22/06/2022</span><br />
                                    <span>04:56 PM</span>
                                </div>
                                <div className={dealDetailsStyles.dealActivityInfo}>
                                    <p><span>Moved deal to Discovery call Scheduled.</span></p>
                                    <p className={dealDetailsStyles.dealActivityAction}><img src={arrow} alt="arrow" />Action by: Ankit Pandya</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={dealDetailsStyles.dealDetailsTable}>
                <Table columns={columns} dataSource={data} pagination={false} />
            </div>
        </div>


    </>);
};

export default DealDetails;
