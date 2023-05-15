import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { useEffect } from 'react';

import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import ViewHRDetailsStyle from "../screens/viewHRDetails.module.css"
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useState } from "react"

const ViewHRDetails = () => {
    const [hiringDetails, setHiringDetails] = useState("")
    const id = useParams()
    console.log(hiringDetails, "hiringDetails")
    const getViewHrDetails = async () => {
        const response = await hiringRequestDAO.viewHRDetailsRequestDAO(id.id);
        setHiringDetails(response)
    }
    useEffect(() => {
        getViewHrDetails();
    }, [])

    return (
        <>
            <div className={ViewHRDetailsStyle.viewHRDetailsWrap}>
                <div className={ViewHRDetailsStyle.goBack}>
                    <Link to={`/allhiringrequest/${id.id}`}>
                        <ArrowLeftSVG />
                        Go Back
                    </Link>
                </div>

                <div className={ViewHRDetailsStyle.viewHRDetailsHead}>
                    <h1>
                        HR ID - {hiringDetails?.responseBody?.details?.hrNumber}
                    </h1>
                    <button>
                        Edit HR
                    </button>
                </div>

                <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
                    <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
                        <h2>Hiring Request Details</h2>
                        <p>The Talents would be able to see<br /> fields highlighted in blue bullets.</p>
                    </div>
                    <div className={ViewHRDetailsStyle.viewHRRightDetails}>
                        <div className={ViewHRDetailsStyle.viewHRDetailsBoxWrap}>
                            <div className={ViewHRDetailsStyle.row}>
                                <div className={ViewHRDetailsStyle.colLg6}>
                                    <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                                        <ul>
                                            <li><span>Client Email/Name:</span> {hiringDetails?.responseBody?.details?.clientName ?? "NA"}</li>
                                            <li><span>Hiring Request Role:</span> {hiringDetails?.responseBody?.details?.hiringRequestRole ?? "NA"}</li>
                                            <li><span>Job Description:</span> {hiringDetails?.responseBody?.details?.jobDescription ? <a href={hiringDetails?.responseBody?.details?.jobDescription} target="_blank">Click Here</a> : "NA"}</li>
                                            <li><span>Contract Type:</span> Direct Placement</li>
                                            <li><span>NR:</span> {hiringDetails?.responseBody?.details?.nrPercetange ?? "NA"} %</li>
                                            <li><span>Contract Duration:</span> {hiringDetails?.responseBody?.details?.contractDuration ?? "NA"} Months<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>How Many Talent Request:</span> 1</li>
                                            <li><span>Region:</span> {hiringDetails?.responseBody?.details?.region ?? "NA"}<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>How Soon:</span> {hiringDetails?.responseBody?.details?.howSoon ?? "NA"}</li>
                                            {/* <li><span>NP:</span> 30 NP<i className={ViewHRDetailsStyle.blueDot} /></li> */}
                                            <li><span>BQ Form Link:</span> {hiringDetails?.responseBody?.details?.bqLink ? <a href={hiringDetails?.responseBody?.details?.bqLink} target="_blank">Click Here</a> : "NA"} </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={ViewHRDetailsStyle.colLg6}>
                                    <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                                        <ul>
                                            <li><span>Company Name:</span> {hiringDetails?.responseBody?.details?.company ?? "NA"}<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>Hiring Request Title:</span> {hiringDetails?.responseBody?.details?.hiringRequestTitle ?? "NA"}<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>JD URL:</span> {hiringDetails?.responseBody?.details?.jdurl === null ? "NA" : hiringDetails?.responseBody?.details?.jdurl}</li>
                                            <li><span>Estimated Budget:</span> {hiringDetails?.responseBody?.details?.hiringCost ?? "NA"}<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>Sales Person:</span> {hiringDetails?.responseBody?.details?.salesPerson ?? "NA"}</li>
                                            <li><span>Required Experience:</span> {hiringDetails?.responseBody?.details?.requiredExperienceYear ?? "NA"} Years<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>Availibilty:</span> {hiringDetails?.responseBody?.details?.availability ?? "NA"}</li>
                                            <li><span>Time Zone:</span> {hiringDetails?.responseBody?.details?.timeZone ?? "NA"}<i className={ViewHRDetailsStyle.blueDot} /></li>
                                            <li><span>Deal ID:</span> {hiringDetails?.responseBody?.details?.dealID ?? "NA"}</li>

                                            <li><span>Discovery Form Link:</span> {hiringDetails?.responseBody?.details?.discoveryCall ? <a href={hiringDetails?.responseBody?.details?.discoveryCall} target="_blank">Click Here</a> : "NA"} </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
                    <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
                        <h2>Interviewer Details</h2>
                    </div>
                    <div className={ViewHRDetailsStyle.viewHRRightDetails}>
                        <div className={ViewHRDetailsStyle.row}>

                            {hiringDetails?.responseBody?.details?.interviewerlList?.map((item) => {
                                return (
                                    <div className={ViewHRDetailsStyle.colLg6}>
                                        <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                                            <h3>Interviewer 1</h3>
                                            <ul>
                                                <>
                                                    <li><span>Interviewer Name:</span> {item?.interviewerFullName ?? "NA"}</li>
                                                    <li><span>Interviewer Linkedin:</span> {item?.interviewerLinkedin === null ? "NA" : <a href={item?.interviewerLinkedin} target="_blank">Click Here</a>}</li>
                                                    <li><span>Interviewer Email:</span> {item?.interviewerEmail ?? "NA"}</li>
                                                    <li><span>Interviewer Designation:</span> {item.interviewerDesignation ?? "NA"}</li>
                                                </>
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })}
                            {/* <div className={ViewHRDetailsStyle.colLg6}>
                                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                                    <h3>Interviewer 1</h3>
                                    <ul>
                                        <li><span>Interviewer Name:</span> Jhanvi Kapoor</li>
                                        <li><span>Interviewer Linkedin:</span> <a href="#" target="_blank">Click Here</a></li>
                                        <li><span>Interviewer Email:</span> jhanvikapoor@gmail.com</li>
                                        <li><span>Interviewer Designation:</span> CEO</li>
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
                    <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
                        <h3>Job Description</h3>
                        <p>The Talents would be able to see<br /> fields highlighted in blue bullets.</p>
                    </div>
                    <div className={ViewHRDetailsStyle.viewHRRightDetails}>
                        <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                            <h3>Requirements<i className={ViewHRDetailsStyle.blueDot} /></h3>
                            <p>{hiringDetails?.responseBody?.details?.requirments ?? "NA"}</p>
                        </div>

                        <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                            <h3>Roles & Responsibilities<i className={ViewHRDetailsStyle.blueDot} /></h3>
                            {hiringDetails?.responseBody?.details?.rolesResponsibilites ?? "NA"}
                            {/* <p>Build web applications with web development best practices</p>
                            <p>Transform app designs into front-end code with HTML, CSS, and JavaScript</p>
                            <p>Work with back-end developers to integrate UI components with APIs and databases</p>
                            <p>Gather and re ne speci cations and requirements based on technical requirements or UX design</p>
                            <p>Debug errors, troubleshoot issues, and perform routine performance optimizations</p>
                            <p>On-site search engine optimization (SEO)</p>
                            <p>Write high-quality, scalable, and reusable code</p>
                            <p>Stay plugged into emerging technologies and industry trends</p>
                            <p>Job Quali cations and Skill Sets</p> */}
                        </div>

                        <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                            <h3>Skills<i className={ViewHRDetailsStyle.blueDot} /></h3>
                            <div className={ViewHRDetailsStyle.skillsList}>
                                {hiringDetails?.responseBody?.details
                                    .requiredSkillList?.map((item) => {
                                        return (
                                            <span>{item?.text}</span>
                                        )
                                    })}
                                {/* <span>Sr. Web Developer</span>
                                <span>DevOps Jira</span>
                                <span>Wordpress Developer</span>
                                <span>Back End Python Developer</span>
                                <span>Salesforce Developer</span>
                                <span>Back End Python Developer</span>
                                <span>Sr. Web Developer</span>
                                <span>DevOps Jira</span>
                                <span>Back End Python Developer</span>
                                <span>Salesforce Developer</span>
                                <span>Back End Python Developer</span> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

export default ViewHRDetails