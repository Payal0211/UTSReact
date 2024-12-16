import React from 'react'
import ticketStyle from './ticket-module.css'

import TicketImg from "../../../assets/tickiteheader.png";
import TicketBag from "../../../assets/ticketbag.svg";
import NotificationEdit from "../../../assets/pencil-square-document-edit.svg";

export default function TicketModal() {
  return (
    <div className={ticketStyle.modalContainer}>
      <div className='modalHeader'>
        <div className='ticketHeaderImg'>
          <img src={TicketImg} alt="Ticket Image" width="38" height="38" />
        </div>
        <div className='ticketTileWrapper'>
          <div className='ticketTitle'>
            <h2>Re: Unable to Access Dashboard Features</h2>
            <div className='ticketStatus green'>
              <span className='upperBorder'><span className='innerBorder'></span></span>
              <div className='ticketStatusText'>Status: <span> Closed</span></div>
            </div>
          </div>
          <div className='subTitleWrapper'>
            <div className='ticketID'>#8945724</div>
            <div className='createdDate'>
              <div className='createDetail'>
                <span className='gray-circle'></span>
                <div className='createDetailText'>Create on: <span>09th Mar, 2024 | 12:44 PM</span></div>
              </div>
              <div className='createDetail'>
                <span className='gray-circle'></span>
                <div className='createDetailText'>Created by: <span>Kanishka Seth</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-content ticketModalBody'>
        <div className='TicketModalBodyInner'>
          <div className='ticketTrackbox'>
            <div className='ticketNotidicationBox'>
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
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
