import { message, Modal, Spin } from 'antd';
import { useEffect, useState, useCallback, Fragment, useRef } from 'react';
import { InputType } from 'constants/application';
import ButtonField from 'modules/user/components/buttonField/button_field';
import useIconToggle from 'shared/hooks/useIconToggle';
import {
    PasswordIconAiFillEye,
    PasswordIconAiFillEyeInvisible,
} from 'shared/utils/password_icon_utils';
import { userDAO } from 'core/user/userDAO';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate } from 'react-router-dom';
import UTSRoutes, { isAccess } from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import UTSLogoSVG from 'assets/svg/UTSLogo.svg'
import { useCookies } from 'react-cookie'
import loginStyle from './n_login.module.css'

const NewLoginScreen = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['uplers_user']);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [userData, setUserData] = useState({ username: '', password: '', showPassword: false });
    const [isLoading, setLoading] = useState(false);


    const loginHandler = async (d) => {
        if(!userData?.username || !userData?.password){
            message.error('Please enter username and password');
            return
        }
        setLoading(true);
        const result = await userDAO.loginDAO({
            username: userData?.username,
            password: userData?.password,
        });
        setLoading(false);
        if (result.statusCode === HTTPStatusCode.OK) {

            navigate(isAccess(result.responseBody.LoggedInUserTypeID) ? result.responseBody.LoggedInUserTypeID === 6 || result.responseBody.LoggedInUserTypeID === 3 ? UTSRoutes.AMDASHBOARD : UTSRoutes.ALLHIRINGREQUESTROUTE : UTSRoutes.DASHBOARD);
            // set cookie uplers_user for 1 year
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            setCookie('uplers_user', result.responseBody.EmployeeID, {
                expires: oneYearFromNow,
                path: '/',
            })

        } else {
            message.error(result?.responseBody || 'Something went wrong.');

            // navigate(UTSRoutes.LOGINROUTE);
        }
    }

    return (
        <div className={`${loginStyle["login-container"]}`}>
            {/* <!-- Background Patterns --> */}
            <div className={`${loginStyle["login-background-pattern"]} ${loginStyle['login-pattern-top-left']}`}>
                <svg width="1318" height="407" viewBox="0 0 1318 407" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.66" clipPath="url(#clip0_3601_5779)">
                        <rect x="1317.81" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1317.81 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1064.84" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1064.84 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="811.875" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 811.875 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="558.906" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 558.906 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="305.938" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 305.938 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="52.9688" y="572.353" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 52.9688 572.353)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1317.81" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1317.81 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1064.84" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1064.84 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="811.875" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 811.875 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="558.906" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 558.906 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="305.938" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 305.938 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="52.9688" y="319.377" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 52.9688 319.377)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1317.81" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1317.81 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1064.84" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 1064.84 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="811.875" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 811.875 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="558.906" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 558.906 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="305.938" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 305.938 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="52.9688" y="66.4106" width="252.969" height="252.969" rx="27.9138" transform="rotate(180 52.9688 66.4106)" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <path d="M305.937 551.414V347.294C305.937 331.878 293.44 319.38 278.024 319.38H80.8825C65.4662 319.38 52.9687 306.883 52.9687 291.466V94.3252C52.9687 78.9089 40.4713 66.4114 25.0549 66.4114H-172.086C-187.503 66.4114 -200 53.914 -200 38.4977V-158.644C-200 -174.06 -212.497 -186.557 -227.914 -186.557H-425.055C-440.471 -186.557 -452.969 -199.055 -452.969 -214.471V-411.612C-452.969 -427.029 -465.466 -439.526 -480.883 -439.526H-685.002M558.906 551.414V347.294C558.906 331.878 546.409 319.38 530.992 319.38H333.851C318.435 319.38 305.937 306.883 305.937 291.466V94.3252C305.937 78.9089 293.44 66.4114 278.024 66.4114H80.8825C65.4662 66.4114 52.9687 53.914 52.9687 38.4977V-158.644C52.9687 -174.06 65.4662 -186.557 80.8825 -186.557H278.024C293.44 -186.557 305.937 -174.06 305.937 -158.644V41.9869L306.182 43.6356C308.055 56.2787 318.787 65.7191 331.565 65.9649L354.787 66.4114H530.992C546.409 66.4114 558.906 53.914 558.906 38.4977V-158.644C558.906 -174.06 546.409 -186.557 530.992 -186.557H332.107L325.48 -186.999C314.483 -187.732 305.937 -196.866 305.937 -207.888V-229.3M305.937 -207.493V-411.612C305.937 -427.029 293.44 -439.526 278.024 -439.526H80.8825C65.4662 -439.526 52.9687 -452.023 52.9687 -467.44V-664.581C52.9687 -679.997 40.4713 -692.495 25.0549 -692.495H-172.086C-187.503 -692.495 -200 -704.992 -200 -720.409V-917.55C-200 -932.966 -212.497 -945.464 -227.914 -945.464H-425.055C-440.471 -945.464 -452.969 -957.961 -452.969 -973.377V-1170.52C-452.969 -1185.93 -465.466 -1198.43 -480.883 -1198.43H-685.002" stroke="url(#paint0_linear_3601_5779)" strokeWidth="2.61692" />
                        <rect x="1317.81" y="-1011.97" width="1418.37" height="758.906" transform="rotate(90 1317.81 -1011.97)" fill="url(#paint1_linear_3601_5779)" />
                        <ellipse cx="326.872" cy="577.379" rx="943.835" ry="804.266" transform="rotate(180 326.872 577.379)" fill="url(#paint2_radial_3601_5779)" />
                    </g>
                    <defs>
                        <linearGradient id="paint0_linear_3601_5779" x1="558.906" y1="551.414" x2="-657.088" y2="-953.314" gradientUnits="userSpaceOnUse">
                            <stop offset="0.0819437" stopColor="#FFF9E1" />
                            <stop offset="0.208333" stopColor="#FFDE2D" />
                            <stop offset="0.526042" stopColor="#FFDE2D" />
                            <stop offset="0.9375" stopColor="#FFDE2D" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_3601_5779" x1="2027" y1="-1011.97" x2="2027" y2="-253.065" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F9F6ED" />
                            <stop offset="1" stopColor="#F9F6ED" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="paint2_radial_3601_5779" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(326.872 577.379) rotate(90) scale(804.266 943.835)">
                            <stop stopColor="#F9F6ED" />
                            <stop offset="1" stopColor="#F9F6ED" stopOpacity="0" />
                        </radialGradient>
                        <clipPath id="clip0_3601_5779">
                            <rect width="1517.81" height="971.4" fill="white" transform="matrix(-1 0 0 -1 1317.81 406.4)" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div className={`${loginStyle["login-background-pattern"]} ${loginStyle['login-pattern-bottom-right']}`}>
                <svg width="1315" height="503" viewBox="0 0 1315 503" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.66" clipPath="url(#clip0_3601_5725)">
                        <rect y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="252.969" y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="505.938" y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="758.906" y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1011.88" y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1264.84" y="-165.953" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="252.969" y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="505.938" y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="758.906" y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1011.88" y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1264.84" y="87.0234" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="252.969" y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="505.938" y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="758.906" y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1011.88" y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <rect x="1264.84" y="339.989" width="252.969" height="252.969" rx="27.9138" stroke="#F9F6ED" strokeWidth="2.61692" />
                        <path d="M1011.88 -145.014V59.1061C1011.88 74.5224 1024.37 87.0198 1039.79 87.0198H1236.93C1252.35 87.0198 1264.84 99.5173 1264.84 114.934V312.075C1264.84 327.491 1277.34 339.989 1292.76 339.989H1489.9C1505.32 339.989 1517.81 352.486 1517.81 367.902V565.044C1517.81 580.46 1530.31 592.957 1545.73 592.957H1742.87C1758.28 592.957 1770.78 605.455 1770.78 620.871V818.012C1770.78 833.429 1783.28 845.926 1798.7 845.926H2002.81M758.906 -145.014V59.1061C758.906 74.5224 771.404 87.0198 786.82 87.0198H983.961C999.378 87.0198 1011.88 99.5173 1011.88 114.934V312.075C1011.88 327.491 1024.37 339.989 1039.79 339.989H1236.93C1252.35 339.989 1264.84 352.486 1264.84 367.902V565.044C1264.84 580.46 1252.35 592.957 1236.93 592.957H1039.79C1024.37 592.957 1011.88 580.46 1011.88 565.044V364.413L1011.63 362.764C1009.76 350.121 999.026 340.681 986.247 340.435L963.026 339.989H786.82C771.404 339.989 758.906 352.486 758.906 367.902V565.044C758.906 580.46 771.404 592.957 786.82 592.957H985.706L992.332 593.399C1003.33 594.132 1011.88 603.266 1011.88 614.288V635.7M1011.88 613.893V818.012C1011.88 833.429 1024.37 845.926 1039.79 845.926H1236.93C1252.35 845.926 1264.84 858.423 1264.84 873.84V1070.98C1264.84 1086.4 1277.34 1098.89 1292.76 1098.89H1489.9C1505.32 1098.89 1517.81 1111.39 1517.81 1126.81V1323.95C1517.81 1339.37 1530.31 1351.86 1545.73 1351.86H1742.87C1758.28 1351.86 1770.78 1364.36 1770.78 1379.78V1576.92C1770.78 1592.33 1783.28 1604.83 1798.7 1604.83H2002.81" stroke="url(#paint0_linear_3601_5725)" strokeWidth="2.61692" />
                        <rect y="1418.37" width="1418.37" height="758.906" transform="rotate(-90 0 1418.37)" fill="url(#paint1_linear_3601_5725)" />
                        <ellipse cx="990.94" cy="-170.979" rx="943.835" ry="804.266" fill="url(#paint2_radial_3601_5725)" />
                    </g>
                    <defs>
                        <linearGradient id="paint0_linear_3601_5725" x1="758.906" y1="-145.014" x2="1974.9" y2="1359.71" gradientUnits="userSpaceOnUse">
                            <stop offset="0.0819437" stopColor="#FFF9E1" />
                            <stop offset="0.208333" stopColor="#FFDE2D" />
                            <stop offset="0.526042" stopColor="#FFDE2D" />
                            <stop offset="0.9375" stopColor="#FFDE2D" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_3601_5725" x1="709.185" y1="1418.37" x2="709.185" y2="2177.28" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F9F6ED" />
                            <stop offset="1" stopColor="#F9F6ED" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id="paint2_radial_3601_5725" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(990.94 -170.979) rotate(90) scale(804.266 943.835)">
                            <stop stopColor="#F9F6ED" />
                            <stop offset="1" stopColor="#F9F6ED" stopOpacity="0" />
                        </radialGradient>
                        <clipPath id="clip0_3601_5725">
                            <rect width="1517.81" height="971.4" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            {/* <!-- Login Content --> */}
            <div className={`${loginStyle["login-content"]}`}>
                {/* <!-- Logo --> */}
                <div className={`${loginStyle["login-logo"]}`}>
                    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 190 82" className={`${loginStyle["brandLogo"]} ${loginStyle["brandLogo--lockup--animated"]}`}>
                        <g className={`${loginStyle["brandLogo__freddie"]}`}><path d="M66.96,23.53L66.96,23.53c-2.72-2.72-6.68-3.76-10.39-2.74c0,0-13.59,3.58-13.59,3.59c-7.36,1.95-25.97,5.63-22.57,13.95 c3.57,8.71,15,18.44,23.58,21.82c12.75,5.02,19.54-3.89,22.37-13.13c0.06-0.19,0.13-0.39,0.18-0.59l0.02-0.09l0.04-0.14 c0.18-0.64,0.34-1.27,0.48-1.9l2.63-10.41C70.72,30.2,69.68,26.25,66.96,23.53z M61.31,31.64l-3.36,13.19 c-0.24,0.88-1.05,1.54-1.98,1.51c-0.93-0.03-1.71-0.73-1.87-1.64l-1.11-5.56c-0.07-0.37-0.25-0.72-0.54-1.01 c-0.29-0.29-0.64-0.47-1.01-0.54l-5.56-1.11c-0.41-0.08-0.77-0.27-1.04-0.55c-0.34-0.34-0.58-0.81-0.6-1.32 c-0.03-0.93,0.61-1.75,1.5-1.98l13.16-3.39c0.68-0.17,1.4,0.02,1.89,0.52c0.38,0.38,0.58,0.88,0.58,1.4 C61.37,31.32,61.35,31.48,61.31,31.64z"></path></g>
                        <g className={`${loginStyle["brandLogo__wordMark"]}`}><path d="M90.09,33.51v8.17c0,2.35-1.91,4.26-4.26,4.26c-2.35,0-4.26-1.91-4.26-4.26v-8.17h-4.85v8.17c0,5.03,4.09,9.12,9.12,9.12 c5.03,0,9.12-4.09,9.12-9.12v-8.17H90.09z M112.13,35.68L112.13,35.68c-1.65-1.68-3.68-2.53-6.04-2.53c-1.49,0-2.85,0.38-4.04,1.14 v-0.78h-4.74V57.8h4.74v-8.67c1.27,0.81,2.67,1.22,4.17,1.22c2.31,0,4.31-0.86,5.94-2.55c1.62-1.68,2.44-3.72,2.44-6.07 C114.6,39.39,113.77,37.35,112.13,35.68z M105.68,45.84c-2.25,0-4.08-1.83-4.08-4.08s1.83-4.08,4.08-4.08s4.08,1.83,4.08,4.08 S107.93,45.84,105.68,45.84z M155.59,33.94c-1.02-0.6-2.1-0.88-3.39-0.88c-1.12,0-1.92,0.19-2.69,0.64 c-0.31,0.18-0.65,0.43-0.98,0.71v-0.9h-4.95v16.88h4.95v-8.1c0-1.1,0-2.6,0.98-3.65c0.63-0.66,1.32-0.8,2.16-0.8 c0.26,0,0.95,0,1.8,0.54l0.46,0.29l2.03-4.52L155.59,33.94z M169.48,42.96c-0.32-0.57-0.76-1.07-1.33-1.48 c-0.49-0.37-1.12-0.68-1.85-0.93c-0.55-0.19-1.24-0.39-2.08-0.59l-0.01,0c-1.37-0.3-2.32-0.55-2.82-0.73 c-0.56-0.21-0.56-0.45-0.56-0.54c0-0.21,0.07-0.48,0.6-0.72c0.5-0.23,1.09-0.35,1.75-0.35c0.78,0,1.49,0.13,2.09,0.39 c0.6,0.26,1.16,0.56,1.66,0.91l0.39,0.27l2.53-3.73l-0.37-0.27c-0.63-0.46-1.48-0.91-2.52-1.35c-1.07-0.45-2.35-0.68-3.82-0.68 c-1.14,0-2.15,0.15-3.02,0.43c-0.86,0.29-1.62,0.7-2.26,1.23c-0.64,0.53-1.12,1.14-1.43,1.8c-0.34,0.7-0.5,1.42-0.5,2.13 c0,0.81,0.19,1.53,0.58,2.15c0.35,0.57,0.84,1.08,1.48,1.52c0.56,0.39,1.23,0.73,1.98,1.02c0.65,0.25,1.4,0.46,2.22,0.64 c0.26,0.07,0.68,0.16,1.24,0.28c0.38,0.08,0.69,0.17,0.95,0.27c0.22,0.08,0.38,0.18,0.48,0.29l0.01,0.01 c0.09,0.09,0.13,0.19,0.13,0.32c0,0.25-0.07,0.54-0.57,0.75c-0.53,0.22-1.12,0.34-1.75,0.34c-0.54,0-1.06-0.07-1.54-0.21 c-0.46-0.13-0.89-0.3-1.26-0.51c-0.4-0.23-0.76-0.46-1.05-0.69c-0.27-0.22-0.56-0.47-0.86-0.75l-0.38-0.35l-2.81,3.63l0.26,0.29 c0.33,0.36,0.76,0.74,1.3,1.13c0.51,0.37,1.09,0.69,1.73,0.97c0.69,0.29,1.38,0.52,2.06,0.68c0.79,0.18,1.63,0.27,2.48,0.27 c0.96,0,1.88-0.12,2.75-0.36c0.9-0.25,1.68-0.6,2.34-1.05c0.7-0.49,1.26-1.09,1.66-1.79c0.42-0.73,0.64-1.57,0.64-2.48 C170,44.3,169.83,43.57,169.48,42.96z M140.54,38.35c-0.46-1.09-1.07-2.02-1.82-2.77c-0.74-0.74-1.65-1.34-2.7-1.79 c-1-0.43-2.11-0.64-3.28-0.64c-1.22,0-2.36,0.23-3.39,0.7c-1.06,0.47-1.96,1.1-2.68,1.88c-0.73,0.79-1.33,1.72-1.76,2.78 c-0.43,1.03-0.64,2.18-0.64,3.41c0,1.25,0.23,2.42,0.69,3.49c0.47,1.09,1.12,2.04,1.92,2.84c0.82,0.8,1.79,1.44,2.87,1.88 c1.08,0.45,2.28,0.67,3.56,0.67c1.47,0,2.8-0.26,3.94-0.78c1.1-0.49,2.02-1.03,2.73-1.61l0.33-0.27l-2.55-3.83l-0.4,0.37 c-0.59,0.54-1.24,0.93-1.94,1.15c-0.71,0.23-1.4,0.34-2.04,0.34c-0.61,0-1.14-0.09-1.59-0.26c-0.45-0.17-0.86-0.4-1.24-0.69 c-0.32-0.25-0.6-0.56-0.82-0.91c-0.09-0.15-0.17-0.29-0.23-0.43h11.66l0.02-0.44c0.02-0.43,0.03-0.72,0.03-0.91v-0.62 C141.21,40.62,140.99,39.42,140.54,38.35z M129.88,40.03c0.04-0.15,0.1-0.3,0.17-0.47c0.15-0.34,0.36-0.65,0.63-0.91 c0.31-0.29,0.66-0.52,1.04-0.68c0.42-0.17,0.93-0.26,1.51-0.26c0.6,0,1.13,0.09,1.56,0.26c0.43,0.17,0.79,0.41,1.07,0.69 c0.28,0.29,0.5,0.6,0.64,0.92c0.06,0.16,0.12,0.3,0.16,0.45H129.88z M116.96,24.2v26.19h4.95V24.2H116.96z"></path></g>
                    </svg>
                </div>

                {/* <!-- Welcome Message --> */}
                <div className={`${loginStyle["login-welcome"]}`}>
                    <h1 className={`${loginStyle["login-title"]}`}>Welcome to <br />Uplers Workspace</h1>
                    <p className={`${loginStyle["login-tagline"]}`}>Hire Top Talents Quickly <br />with AI & Human Intelligence</p>
                </div>

                {/* <!-- Login Form --> */}
                <form className={`${loginStyle["login-form"]}`} >
                    <div className={`${loginStyle["form-group"]} ${userData?.username?.trim() !== '' ? loginStyle['has-value'] : ''}`}>
                        <label for="username" className={`${loginStyle["floating-label"]}`}>Username</label>
                        <input ref={usernameRef} type="text" id="username" name="username" className={`${loginStyle["form-input"]}`} placeholder="Username" autoComplete="username"
                            value={userData?.username} onChange={(e) => { setUserData(prev => ({ ...prev, username: e.target.value })) }} />
                    </div>

                    <div className={`${loginStyle["form-group"]}`}>
                        <div className={`${loginStyle["password-input-wrapper"]} ${userData?.password?.trim() !== '' ? loginStyle['has-value'] : ''}`}>
                            <label for="password" className={`${loginStyle["floating-label"]}`}>Password</label>
                            <input ref={passwordRef} type={userData?.showPassword ? 'text' : "password"} id="password" name="password" className={`${loginStyle["form-input"]}`} placeholder="Password" autoComplete="current-password"
                                value={userData?.password} onChange={(e) => { setUserData(prev => ({ ...prev, password: e.target.value })) }} />
                            <button type="button" className={`${loginStyle["password-toggle"]}`} id="passwordToggle" aria-label="Toggle password visibility"
                                onClick={() => { setUserData(prev => ({ ...prev, showPassword: !prev.showPassword })) }}>
                                {userData?.showPassword ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.60603 6.08085C2.11366 5.8633 2.70154 6.09845 2.9191 6.60608L1.99995 7C2.9191 6.60608 2.91924 6.6064 2.9191 6.60608L2.91858 6.60488C2.9183 6.60423 2.91851 6.6047 2.91858 6.60488L2.9225 6.61374C2.92651 6.62276 2.93339 6.63807 2.94319 6.65928C2.96278 6.7017 2.99397 6.76758 3.03696 6.85356C3.12302 7.02569 3.25594 7.27745 3.43737 7.58226C3.80137 8.19378 4.35439 9.00824 5.10775 9.81955C5.28532 10.0108 5.47324 10.2011 5.67173 10.388C5.68003 10.3956 5.68823 10.4033 5.69633 10.4112C7.18102 11.8014 9.25227 13 12 13C13.2089 13 14.2783 12.7692 15.2209 12.3982C16.4469 11.9156 17.4745 11.1891 18.3156 10.3997C19.2652 9.50838 19.9627 8.55004 20.4232 7.81099C20.6526 7.44291 20.8207 7.13317 20.9299 6.91908C20.9844 6.81215 21.0241 6.72942 21.0491 6.6756C21.0617 6.64871 21.0706 6.62906 21.0758 6.61727L21.0808 6.60608C21.2985 6.09872 21.8864 5.86335 22.3939 6.08085C22.9015 6.29841 23.1367 6.88629 22.9191 7.39392L22 7C22.9191 7.39392 22.9192 7.39369 22.9191 7.39392L22.9169 7.39894L22.9134 7.40716L22.9019 7.433C22.8924 7.45433 22.879 7.48377 22.8618 7.52071C22.8274 7.59457 22.7774 7.69854 22.7115 7.82773C22.5799 8.08589 22.384 8.44607 22.1206 8.86867C21.718 9.51483 21.152 10.3162 20.4096 11.1243L21.2071 11.9217C21.5976 12.3123 21.5976 12.9454 21.2071 13.3359C20.8165 13.7265 20.1834 13.7265 19.7928 13.3359L18.9527 12.4958C18.3884 12.9515 17.757 13.3814 17.0558 13.7522L17.8381 14.9546C18.1393 15.4175 18.0083 16.037 17.5453 16.3382C17.0824 16.6394 16.463 16.5083 16.1618 16.0454L15.1763 14.5309C14.4973 14.739 13.772 14.8865 13 14.9557V16.5C13 17.0523 12.5522 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5V14.9558C10.2253 14.8866 9.50014 14.7388 8.82334 14.5313L7.83814 16.0454C7.53693 16.5083 6.91748 16.6394 6.45457 16.3382C5.99165 16.037 5.86056 15.4175 6.16177 14.9546L6.94417 13.7522C6.24405 13.3816 5.61245 12.9518 5.04746 12.4955L4.20706 13.3359C3.81654 13.7265 3.18337 13.7265 2.79285 13.3359C2.40232 12.9454 2.40232 12.3123 2.79285 11.9217L3.59029 11.1243C2.74529 10.2045 2.12772 9.29223 1.71879 8.60523C1.5096 8.25379 1.35345 7.95868 1.2481 7.74799C1.19539 7.64257 1.15529 7.55806 1.12752 7.49794C1.11363 7.46788 1.10282 7.44389 1.09505 7.42641L1.08566 7.40513L1.08267 7.39824L1.0816 7.39576L1.08117 7.39476C1.08098 7.39432 1.08081 7.39392 1.99995 7L1.08117 7.39476C0.863613 6.88713 1.0984 6.29841 1.60603 6.08085Z" fill="#595959" />
                                </svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#595959" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12ZM12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25Z" fill="#595959" />
                                </svg>
                                }
                            </button>
                        </div>
                    </div>

                    {isLoading ? <Spin /> : <button type="submit" className={`${loginStyle["btn-login"]}`} id="loginButton"
                    //  disabled={userData?.username !== '' && userData?.password !== '' ? false : true}
                        onClick={(e) => {
                            e.preventDefault()
                            loginHandler()
                        }} >Log in</button>}


                </form>
            </div>


        </div>

    )

}

export default NewLoginScreen;