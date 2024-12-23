import React,{useState} from 'react'
import ticketStyle from './ticket-module.css'

import SpinLoader from 'shared/components/spinLoader/spinLoader';
import TicketImg from "../../../assets/tickiteheader.png";
import TicketBag from "../../../assets/ticketbag.svg";
import NotificationEdit from "../../../assets/pencil-square-document-edit.svg";
import moment from 'moment';
import { Tabs } from 'antd';

export default function TicketModal({historyLoading,historyData,setShowTimeLine, HistoryInfo,conversationInfo}) {
  const [title, setTitle] = useState("Conversation");

  const HistoryCom = ()=>{

    return  <div className='TicketModalBodyInner'>
    <div className='ticketTrackbox'>

      { historyLoading ? <SpinLoader /> :
       HistoryInfo?.length === 0 ? 
       <div className='ticketNotidicationBox'>
       <div className='ticketTrackDate'>No Ticket Found</div>
      
     
    </div>
      
      : HistoryInfo?.map((data, mainInd)=>{
        return <div className='ticketNotidicationBox' >
            <div className='ticketTrackDate'>{moment(data.eventDate).format('DD MMM, YYYY')}</div>
            {data.ticketHistory.map((ticket,ind)=>{
              return  <div className={`ticketTrackPath ${ind +1 === data.ticketHistory.length && mainInd + 1 === HistoryInfo.length ? 'remPath' : ''}`}>
          <div className='notificationImg'>
            <img src={TicketBag} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>{ticket?.webLabel} <span>{moment(ticket?.eventTime).format('hh:mm A')}</span></div>
            <div className='notificationDetail'>
             {ticket?.notificationType && <div className='notificationDetailtext'>Notification type: <span>{ticket?.notificationType}</span></div>} 
             {ticket?.ruleName && <div className='notificationDetailtext'>Name: <span>{ticket?.ruleName}</span></div>} 
             {ticket?.recipients && <div className='notificationDetailtext'>Recipient: <span>{ticket?.recipients}</span></div>} 
             {ticket?.name === 'Ticket_Created_Mail' && <>
             {ticket?.changes.map(change =>{
              if(change.field === "Department"){
                return  <div className='notificationDetailtext'>Department: <span>Talent Support</span></div>
              }
              if(change.field === "Layout"){
                return <div className='notificationDetailtext'>Layout:  <span>Talent Support</span></div>
              }
              if(change.field === "Status"){
               return <div className='notificationDetailtext'>Status:  <span>{change.newValue}</span></div>
              }
              if(change.field === "Language"){
               return <div className='notificationDetailtext'>Language:  <span>{change.newValue}</span></div>
              }
              if(change.field === "Email"){
                return <div className='notificationDetailtext'>Email:  <span>{change.newValue}</span></div>
               }
               if(change.field === "Subject"){
                return <div className='notificationDetailtext'>Subject:  <span>{change.newValue}</span></div>
               }
               if(change.field === "Status"){
                return <div className='notificationDetailtext'>Status:  <span>{change.newValue}</span></div>
               }
               if(change.field === "To Address"){
                return <div className='notificationDetailtext'>To Address:  <span>{change.newValue}</span></div>
               }
               if(change.field === "Relationship Type"){
                return <div className='notificationDetailtext'>Relationship Type:  <span>{change.newValue}</span></div>
               }

             })}
             
             
             </>}
            </div>
          </div>
        </div>
            })}
          
         </div>
      })}
      {/* <div className='ticketNotidicationBox'>
        <div className='ticketTrackDate'>Today (10 Dec)</div>
        <div className='ticketTrackPath'>
          <div className='notificationImg'>
            <img src={TicketBag} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Notification rule applied <span>2 hours ago</span></div>
            <div className='notificationDetail'>
              <div className='notificationDetailtext'>Notification type: <span>Email</span></div>
              <div className='notificationDetailtext'>Notification name: <span>Acknowledgement when the ticket is closed</span></div>
              <div className='notificationDetailtext'>Recipient: <span>kanishkha@gmail.com</span></div>
            </div>
          </div>
        </div>
        <div className='ticketTrackPath'>
          <div className='notificationImg'>
            <img src={NotificationEdit} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Talent support saved a reply draft in the ticket <span>5 hours ago</span></div>
          </div>
        </div>
      </div>
      <div className='ticketNotidicationBox'>
        <div className='ticketTrackDate'>19 Nov, 2024</div>
        <div className='ticketTrackPath'>
          <div className='notificationImg'>
            <img src={TicketBag} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Notification rule applied <span>10 days ago</span></div>
            <div className='notificationDetail'>
              <div className='notificationDetailtext'>Notification type: <span>Email</span></div>
              <div className='notificationDetailtext'>Notification name: <span>Acknowledgement when the ticket is closed</span></div>
              <div className='notificationDetailtext'>Recipient: <span>kanishkha@gmail.com</span></div>
            </div>
          </div>
        </div>
        <div className='ticketTrackPath ticketTrackPathupdate'>
          <div className='notificationImg'>
            <img src={NotificationEdit} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Updated ticket<span>10 days ago</span></div>
            <div className='notificationDetail notificationDetailStatus'>
              <div className='notificationDetailtext'>Status changed:</div>
              <div className='notificationTicketStatus'>
                <div className='ticketStatus gold'>
                  <span className='upperBorder'><span className='innerBorder'></span></span>
                  <div className='ticketStatusText'>Status: <span> Closed</span></div>
                </div>
                to
                <div className='ticketStatus blue'>
                  <span className='upperBorder'><span className='innerBorder'></span></span>
                  <div className='ticketStatusText'>Status: <span> Closed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='ticketNotidicationBox'>
        <div className='ticketTrackDate'>01 Nov, 2024</div>
        <div className='ticketTrackPath'>
          <div className='notificationImg'>
            <img src={TicketBag} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Notification rule applied <span>1 month ago</span></div>
            <div className='notificationDetail'>
              <div className='notificationDetailtext'>Notification type: <span>Email</span></div>
              <div className='notificationDetailtext'>Notification name: <span>Acknowledgement when the ticket is closed</span></div>
              <div className='notificationDetailtext'>Recipient: <span>kanishkha@gmail.com</span></div>
            </div>
          </div>
        </div>
        <div className='ticketTrackPath'>
          <div className='notificationImg'>
            <img src={NotificationEdit} width='20' height='20' alt="TicketBag" />
          </div>
          <div className='notificationTextBox'>
            <div className='notificationTitle'>Talent support saved a reply draft in the ticket <span>1 month ago</span></div>
          </div>
        </div>
      </div> */}
    </div>        
  </div>
  }

  const ConversationCom = () => {
    return <div className='TicketModalBodyInner'>
    <div className='ticketTrackbox'>
       { historyLoading ? <SpinLoader /> :  conversationInfo?.length === 0 ? 
       <div className='ticketNotidicationBox'>
       <div className='ticketTrackDate'>No Conversation Found</div>
      
     
    </div> : conversationInfo.map(con =>{
         return <div className={'conversationContainer'}>
          <h4>{con.authorName} <span>{moment(con.createdDateTime).format('DD MMM hh:tt a')} ( {moment(con.createdDateTime).fromNow()} )</span> <div /></h4>  
          <h5>to : {con.to}</h5>
          <h5>from : {con.from}</h5>
          <p>{con.summary} <a href={con.url} target='_blank' rel="noreferrer">View Details</a></p>
          </div>
       })}
    </div>
    </div>
  }
 
  return (
    <div className={ticketStyle.modalContainer}>
      <div className='modalHeader'>
        <div className='ticketHeaderImg'>
          <img src={TicketImg} alt="Ticket Image" width="38" height="38" />
        </div>
        <div className='ticketTileWrapper'>
          <div className='ticketTitle'>
            <h2>{historyData?.subject}</h2>
            <div className={`ticketStatus ${historyData?.status === 'Open' ? 'blue' : historyData?.status === 'Closed'?  'green' : 'red'}`}>
              <span className='upperBorder'><span className='innerBorder'></span></span>
              <div className='ticketStatusText'> <span> {historyData?.status}</span></div>
            </div>
          </div>
          <div className='subTitleWrapper'>
            <div className='ticketID'>#{historyData?.ticketNumber}</div>
            <div className='createdDate'>
              <div className='createDetail'>
                <span className='gray-circle'></span>
                <div className='createDetailText'>Created on: <span>{moment(historyData?.createdTime).format('Do MMM, YYYY | hh:mm A')}</span></div>
              </div>
              <div className='createDetail'>
                <span className='gray-circle'></span>
                <div className='createDetailText'>Contact: <span>{historyData?.contactName}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-content ticketModalBody'>
      <Tabs
        onChange={(e) => setTitle(e)}
        defaultActiveKey="1"
        activeKey={title}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
        items={[
          {
            label: "Conversation",
            key: "Conversation",
            children: <ConversationCom />,
          },
          {
            label: "History",
            key: "History",
            children: <HistoryCom />,
          }
         
        ]}

      />



        {/* <div className={"formPanelAction"}>
						
							<button
								className={"btn"}
								onClick={()=>{setShowTimeLine(false)}}>
								Cancel
							</button>

              <button
								type="submit"
								onClick={()=>{}}
								className={"btnPrimary"}
								
								>
								RE-OPEN TICKET
							</button>
						</div> */}
      </div>
    </div>

  )
}
