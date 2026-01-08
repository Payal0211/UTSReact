import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';


import UTSFeedback from 'modules/utsFeedback/utsFeedback';
import NSidebar from 'shared/components/n_sidebar';


const NewLayout = () => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

    return (
        <div>
            {/* <Navbar fullName={userData?.FullName} /> */}
            <NSidebar />
              <header className="top-header">
                <div className="header-user">
                    <span className="user-name">{userData?.FullName}</span>
                    <div className="user-avatar">
                        <img src="images/default-user-ic.png" alt="Manisha Virani" />
                    </div> 
                </div>
            </header>
                <Outlet />
                    {/* <!-- Top Header --> */}
          
            {/* <main
                // style={{
                // 	paddingTop: '80px',
                // 	paddingLeft: '60px',
                // 	width: '100%',
                // }}
                className='mainWrapper'
                >
            
                <UTSFeedback />
            </main> */}
            {/* {(userData?.LoggedInUserTypeID === 2 || userData?.EmployeeID === "UP1302AM") && <ChatListing />} */}
        </div>
    );
};

export default NewLayout;
