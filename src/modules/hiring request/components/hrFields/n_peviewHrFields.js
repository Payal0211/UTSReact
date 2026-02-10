import React, { useEffect ,useState, useCallback} from 'react'
import styles from './n_preview.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { MasterDAO } from "core/master/masterDAO";
import UTSRoutes from 'constants/routes';
import LogoLoader from 'shared/components/loader/logoLoader';

function NewPreviewHrFields() {
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    const {hrid} = useParams()
    const [getHRdetails, setHRdetails] = useState({});
    const [timeZoneList, setTimezoneList] = useState([]);

      const getHRdetailsHandler = async (hrId) => {
        setIsLoading(true)
        const response = await hiringRequestDAO.viewHRDetailsRequestDAO(hrId);
        setIsLoading(false)
        if (response.statusCode === HTTPStatusCode.OK) {
          setHRdetails(response?.responseBody?.details);
         
        }
      };

      
          const getTimeZoneList = useCallback(async () => {
              let response = await MasterDAO.getTimeZoneRequestDAO();
              setTimezoneList(response && response?.responseBody);
          }, [setTimezoneList]);

useEffect(()=>{
getTimeZoneList()
},[])
    
console.log(getHRdetails)
   useEffect(() => {
    if (hrid) {
      getHRdetailsHandler(hrid);
    }
  }, []);


  return (
     <main className={`${styles["main-content"]}`}>

            {/* <!-- Content Section --> */}
            <div className={`${styles["content-wrapper"]}`}>
                {/* <!-- HR Form Preview --> */}
                <LogoLoader visible={isLoading} />
                <div className={`${styles["preview-wrapper"]}`}>
                    <h1 className={`${styles["page-title"]}`}>Preview</h1>
                    
                    <div className={`${styles["preview-card"]}`}>
                        <h2 className={`${styles["preview-job-title"]}`}>{getHRdetails?.hiringRequestTitle}</h2>
                        
                        {/* <!-- Key Details Table - Dynamic columns based on data -->
                        <!-- First row automatically adjusts: 2 columns if no frequency/location, 3 columns if frequency/location exists --> */}
                        <div className={`${styles["preview-table-wrapper"]}`}>
                            <div className={`${styles["preview-details-table"]}`}>
                                <div className={`${styles["preview-table-row"]} ${styles["preview-table-row-first"]}`}>
                                    {/* <!-- Mode/Location cell - can combine mode and location like "Hybrid - Bangalore" or just "Remote" --> */}
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.directHRModeOfWork}</div>
                                    {/* <!-- Frequency cell - uncomment to show 3-column layout (e.g., "Hybrid - Bangalore", "2 days a week", "3-7 years") --> */}
                                    {/* <!-- <div className={`${styles["preview-table-cell"]}`}>2 days a week</div> --> */}
                                    {/* <!-- Experience cell --> */}
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.requiredExperienceYear}-{getHRdetails?.maxExperienceYears} years</div>
                                </div>
                                <div className={`${styles["preview-table-row"]}`}>
                                    {/* <div className={`${styles["preview-table-cell"]}`}>{timeZoneList?.find(v=> v.id === getHRdetails?.salesHiringRequest_Details?.timezoneId)?.value }</div> */}
                                     <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.timeZone}</div>
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.timeZoneFromTime} to {getHRdetails?.timeZoneEndTime}</div>
                                </div>
                                <div className={`${styles["preview-table-row"]}`}>
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.howSoon} notice period</div>
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.interviewRounds} interview rounds</div>
                                    <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.noOfTalents} talents</div>
                                </div>
                            </div>
                        </div>
        
                        {/* <!-- Must have skills --> */}
                        <div className={`${styles["preview-section"]}`}>
                            <h3 className={`${styles["preview-section-title"]}`}>Must have skills</h3>
                            <div className={`${styles["preview-pills"]}`}>
                                {getHRdetails?.requiredSkillList?.map(v=>(<span className={`${styles["preview-pill"]}`}>{v.text}</span>))}
                                
                                {/* <span className={`${styles["preview-pill"]}`}>Kubernetes</span>
                                <span className={`${styles["preview-pill"]}`}>AWS</span>
                                <span className={`${styles["preview-pill"]}`}>Selenium</span>
                                <span className={`${styles["preview-pill"]}`}>Cypress</span>
                                <span className={`${styles["preview-pill"]}`}>Jenkins</span> */}
                            </div>
                        </div>

                           {/* <!-- Good to have skills --> */}
                        <div className={`${styles["preview-section"]}`}>
                            <h3 className={`${styles["preview-section-title"]}`}>Good to have skills</h3>
                            <div className={`${styles["preview-pills"]}`}>
                                {getHRdetails?.goodToHaveSkillList?.map(v=>(<span className={`${styles["preview-pill"]}`}>{v.text}</span>))}
                                
                            </div>
                        </div>
        
                        {/* <!-- Job Description --> */}
                        <div className={`${styles["preview-section"]}`}>
                            <h3 className={`${styles["preview-section-title"]}`}>Job description</h3>
                            <div className={`${styles["preview-rich-text"]}`} dangerouslySetInnerHTML={{__html:getHRdetails?.job_Description}}>
                                {/* <h4>What you'll do</h4>
                                <ul>
                                    <li>Own quality from day one. Create detailed, thorough test plans and cases that cover happy paths, edge cases and failure modes.</li>
                                    <li>Automate the boring stuff. Design, build and maintain test-automation pipelines with open-source frameworks and scripting languages you love.</li>
                                    <li>Hunt bugs before users do. Reproduce, document and track defects, then verify fixes with solid regression suites.</li>
                                    <li>Collaborate cross-functionally. Partner with engineers, product managers and designers to define requirements and bake quality into every feature.</li>
                                    <li>Measure and improve. Establish QA metrics — defect density, time-to-resolution, test-coverage trends — and drive continuous improvement.</li>
                                    <li>Stay current. Evaluate new tools, frameworks and strategies so our test stack evolves along with the product.</li>
                                </ul>
                                <h4>What we're looking for</h4>
                                <ul>
                                    <li>6+ years in automation testing (preferably at a high-growth or a tier-1 company in B2B)</li>
                                    <li>Excellent written and spoken English</li>
                                    <li>Strong knowledge of Selenium, Playwright, Cypress, Appium, or similar tools</li>
                                    <li>Good understanding of REST APIs, SQL, and performance testing basics</li>
                                    <li>Strong analytical and problem-solving skills; ability to think critically and debug complex issues</li>
                                    <li>Exposure to CI/CD pipelines and version control tools like Git</li>
                                    <li>Experience with both white-box and black-box testing and a knack for writing crystal-clear test plans</li>
                                    <li>Hands-on skill with automation tooling — and solid Python or shell-scripting chops</li>
                                    <li>Performance, security or API testing experience is a bonus.</li>
                                </ul> */}
                            </div>
                        </div>
                    </div>

                    <div className={`${styles["preview-card"]}`}>
                        {/* <!-- Budget --> */}
                        <div className={`${styles["preview-section"]}`}>
                            <h3 className={`${styles["preview-section-title"]}`}>Budget</h3>
                            <div className={`${styles["preview-table-wrapper"]}`}>
                                <div className={`${styles["preview-details-table"]}`}>
                                    <div className={`${styles["preview-table-row"]} ${styles["preview-table-row-first"]}`}>
                                        {/* <div className={`${styles["preview-table-cell"]}`}>{getHRdetails?.currency}</div> */}
                                        <div className={`${styles["preview-table-cell"]}`}>
                                            {/* {getHRdetails?.budgetFrom} {getHRdetails?.budgetTo > 0 && `to ${getHRdetails?.budgetTo}`} */}
                                            {getHRdetails?.hiringCost}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        {/* <!-- Variable & equity --> */}
                        <div className={`${styles["preview-section"]}`}>
                            <h3 className={`${styles["preview-section-title"]}`}>Variable & equity</h3>
                            <div className={`${styles["preview-pills"]}`}>
                                {getHRdetails?.compensationOption?.split(getHRdetails?.stringSeparator)?.map(v=>(<span className={`${styles["preview-pill"]}`}>{v}</span>))}
                                {/* <span className={`${styles["preview-pill"]}`}>Performance bonus</span>
                                <span className={`${styles["preview-pill"]}`}>Stock options (ESOPS/ESPPs)</span>
                                <span className={`${styles["preview-pill"]}`}>Signing bonus</span> */}
                            </div>
                        </div>
                    </div>
        
                    {/* <!-- Preview Actions --> */}
                    <div className={`${styles["preview-actions"]}`} style={{marginBottom:'80px'}}>
                        {/* <button type="button" className={`${styles["btn-save"]}`}>SAVE</button> */}
                        <button type="button" className={`${styles["btn-next"]}`} onClick={()=>navigate(UTSRoutes.ALLHIRINGREQUESTROUTE)}>Done</button>
                    </div>
                </div>
            </div>
        </main>
  )
}

export default NewPreviewHrFields