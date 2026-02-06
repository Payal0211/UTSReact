import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import stylesOBj from 'modules/hiring request/screens/allHiringRequest/n_all_hiring_request.module.css';

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
              {/* <!-- Top Header --> */}
              <header className={stylesOBj["top-header"]}>
                <div  className={stylesOBj["header-user"]}>
                    <span  className={stylesOBj["user-name"]}>{userData?.FullName}</span>
                    <div  className={stylesOBj["nav-label user-avatar"]}>
                        <img src="images/default-user-ic.png" alt={userData?.FullName} />
                    </div> 
                </div>
            </header>
                <Outlet />
                  
          
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
