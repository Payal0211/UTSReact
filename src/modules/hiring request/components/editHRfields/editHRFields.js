import { Button, Checkbox, Divider, Space, message, AutoComplete } from 'antd';
import {
    ClientHRURL,
    GoogleDriveCredentials,
    InputType,
    SubmitType,
    URLRegEx,
    WorkingMode,
} from 'constants/application';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HRInputField from '../hrInputFields/hrInputFields';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import HRFieldStyle from './editHRFields.module.css';
import { PlusOutlined } from '@ant-design/icons';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import HRSelectField from '../hrSelectField/hrSelectField';
import { useForm, Controller } from 'react-hook-form';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation } from 'react-router-dom';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { MasterDAO } from 'core/master/masterDAO';
import useDrivePicker from 'react-google-drive-picker/dist';
export const secondaryInterviewer = {
    fullName: '',
    emailID: '',
    linkedin: '',
    designation: '',
};

const EditHRFields = ({
    setTitle,
    clientDetail,
    setEnID,
    tabFieldDisabled,
    setTabFieldDisabled,
    setJDParsedSkills,
    getHRdetails,
    setHRdetails,
    setFromEditDeBriefing,
    fromEditDeBriefing,
}) => {
    const inputRef = useRef(null);
    const [getUploadFileData, setUploadFileData] = useState('');
    const [availability, setAvailability] = useState([]);
    const [timeZonePref, setTimeZonePref] = useState([]);
    const [workingMode, setWorkingMode] = useState([]);
    const [talentRole, setTalentRole] = useState([]);
    const [country, setCountry] = useState([]);
    const [salesPerson, setSalesPerson] = useState([]);
    const [howSoon, setHowSoon] = useState([]);
    const [region, setRegion] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState(['3 months', '6 months', '12 months']);
    const [name, setName] = useState('');
    const [pathName, setPathName] = useState('');
    const [showUploadModal, setUploadModal] = useState(false);
    const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(false);
    const [addHRResponse, setAddHRResponse] = useState("");
    const [type, setType] = useState('');
    const [isHRDirectPlacement, setHRDirectPlacement] = useState(false);
    const [getClientNameMessage, setClientNameMessage] = useState('');
    const [disableButton, setDisableButton] = useState(true)

    const [getValidation, setValidation] = useState({
        systemFileUpload: '',
        googleDriveFileUpload: '',
        linkValidation: '',
    });
    const [getGoogleDriveLink, setGoogleDriveLink] = useState('');
    const [getClientNameSuggestion, setClientNameSuggestion] = useState([]);
    const [currencyResult, setCurrencyResult] = useState([
        {
            value: 'USD',
            id: 'USD',
        },
        {
            value: 'INR',
            id: 'INR',
        },
    ])
    const [controlledRoleValue, setControlledRoleValue] = useState("Select Role")
    const [controlledBudgetValue, setControlledBudgetValue] = useState("Select Budget")
    const [controlledSalesValue, setControlledSalesValue] = useState("Select sales Person")
    const [controlledAvailabilityValue, setControlledAvailabilityValue] = useState("Select availability")
    const [controlledWorkingValue, setControlledWorkingValue] = useState("Select working mode")
    const [controlledRegionValue, setControlledRegionValue] = useState("Select Region")
    const [controlledTimeZoneValue, setControlledTimeZoneValue] = useState("Select time zone")
    const [controlledSoonValue, setControlledTimeSoonValue] = useState("Select how soon?")
    const [controlledCountryValue, setControlledCountryValue] = useState("Select country")
    const [contractDurationValue, setContractDuration] = useState("")
    const [clientNameValue, setClientName] = useState("")
    const [controlledDurationTypeValue, setControlledDurationTypeValue] = useState("Select Term")
    const [getDurationType, setDurationType] = useState([]);


    let controllerRef = useRef(null);
    const {
        watch,
        register,
        handleSubmit,
        setValue,
        setError,
        unregister,
        control,
        // defaultValue,
        formState: { errors, defaultValue },
    } = useForm({
        defaultValues: {
            secondaryInterviewer: [],
            autocompleteField: "abc",
        },
    });

    const watchSalesPerson = watch('salesPerson');
    const watchChildCompany = watch('childCompany');

    //CLONE HR functionality
    const getHRdetailsHandler = async (hrId) => {
        const response = await hiringRequestDAO.getHRDetailsRequestDAO(hrId)
        if (response.statusCode === HTTPStatusCode.OK) {
            setHRdetails(response?.responseBody?.details)

        }
    }


    /* ------------------ Upload JD Starts Here ---------------------- */
    const [openPicker, authResponse] = useDrivePicker();
    const uploadFile = useRef(null);
    const uploadFileFromGoogleDriveValidator = useCallback(
        async (fileData) => {
            setValidation({
                ...getValidation,
                googleDriveFileUpload: '',
            });
            if (
                fileData[0]?.mimeType !== 'application/vnd.google-apps.document' &&
                fileData[0]?.mimeType !== 'application/pdf' &&
                fileData[0]?.mimeType !== 'text/plain' &&
                fileData[0]?.mimeType !== 'application/docs' &&
                fileData[0]?.mimeType !== 'application/msword' &&
                fileData[0]?.mimeType !== 'image/png' &&
                fileData[0]?.mimeType !== 'image/jpeg' &&
                fileData[0]?.mimeType !==
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                setValidation({
                    ...getValidation,
                    googleDriveFileUpload:
                        'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
                });
            } else if (fileData[0]?.sizeBytes >= 500000) {
                setValidation({
                    ...getValidation,
                    googleDriveFileUpload:
                        'Upload file size more than 500kb, Please Upload file upto 500kb',
                });
            } else {
                let fileType;
                let fileName;
                if (fileData[0]?.mimeType === 'application/vnd.google-apps.document') {
                    fileType = 'docs';
                    fileName = `${fileData[0]?.name}.${fileType}`;
                } else {
                    fileName = `${fileData[0]?.name}`;
                }
                const formData = {
                    fileID: fileData[0]?.id,
                    FileName: fileName,
                };
                let uploadFileResponse =
                    await hiringRequestDAO.uploadGoogleDriveFileDAO(formData);

                if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
                    setUploadModal(false);
                    setUploadFileData(fileName);
                    message.success('File uploaded successfully');
                }
            }
        },
        [getValidation],
    );
    const uploadFileHandler = useCallback(
        async (fileData) => {
            setIsLoading(true);
            if (
                fileData?.type !== 'application/pdf' &&
                fileData?.type !== 'application/docs' &&
                fileData?.type !== 'application/msword' &&
                fileData?.type !== 'text/plain' &&
                fileData?.type !==
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                fileData?.type !== 'image/png' &&
                fileData?.type !== 'image/jpeg'
            ) {
                setValidation({
                    ...getValidation,
                    systemFileUpload:
                        'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
                });
                setIsLoading(false);
            } else if (fileData?.size >= 500000) {
                setValidation({
                    ...getValidation,
                    systemFileUpload:
                        'Upload file size more than 500kb, Please Upload file upto 500kb',
                });
                setIsLoading(false);
            } else {
                let formData = new FormData();
                formData.append('File', fileData);
                let uploadFileResponse = await hiringRequestDAO.uploadFileDAO(formData);
                if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
                    if (
                        fileData?.type === 'image/png' ||
                        fileData?.type === 'image/jpeg'
                    ) {
                        setUploadFileData(fileData?.name);
                        setUploadModal(false);
                        setValidation({
                            ...getValidation,
                            systemFileUpload: '',
                        });
                        message.success('File uploaded successfully');
                    } else if (
                        fileData?.type === 'application/pdf' ||
                        fileData?.type === 'application/docs' ||
                        fileData?.type === 'application/msword' ||
                        fileData?.type === 'text/plain' ||
                        fileData?.type ===
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ) {
                        setUploadFileData(fileData?.name);
                        setJDParsedSkills(
                            uploadFileResponse && uploadFileResponse?.responseBody?.details,
                        );
                        setUploadModal(false);
                        setValidation({
                            ...getValidation,
                            systemFileUpload: '',
                        });
                        message.success('File uploaded successfully');
                    }
                }
                setIsLoading(false);
            }
            uploadFile.current.value = '';
        },
        [getValidation, setJDParsedSkills],
    );

    const googleDriveFileUploader = useCallback(() => {
        openPicker({
            clientId: GoogleDriveCredentials.clientID,
            developerKey: GoogleDriveCredentials.developerKey,
            viewId: 'DOCS',
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data?.action === 'cancel') {
                } else {
                    if (data?.docs) {
                        let uploadFileResponse = uploadFileFromGoogleDriveValidator(
                            data?.docs,
                        );
                        setUploadFileData(uploadFileResponse?.responseBody?.FileName);
                        setJDParsedSkills(
                            uploadFileResponse && uploadFileResponse?.responseBody?.details,
                        );
                        setUploadModal(false);
                    }
                }
            },
        });
    }, [openPicker, setJDParsedSkills, uploadFileFromGoogleDriveValidator]);

    const uploadFileFromGoogleDriveLink = useCallback(async () => {
        setValidation({
            ...getValidation,
            linkValidation: '',
        });
        if (!getGoogleDriveLink) {
            setValidation({
                ...getValidation,
                linkValidation: 'Please Enter Google Docs/Drive URL',
            });
        } else if (
            !/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
                getGoogleDriveLink,
            ) &&
            !/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?/g.test(
                getGoogleDriveLink,
            )
        ) {
            setValidation({
                ...getValidation,
                linkValidation: 'Please Enter Google Docs/Drive URL',
            });
        } /* else if (
			!/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?/g.test(
				getGoogleDriveLink,
			)
		) {
			setValidation({
				...getValidation,
				linkValidation: 'Please Enter Google Docs/Drive URL',
			});
		}  */ else {
            let uploadFileResponse =
                await hiringRequestDAO.uploadFileFromGoogleDriveLinkDAO(
                    getGoogleDriveLink,
                );
            if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
                setUploadModal(false);
                setGoogleDriveLink('');
                message.success('File uploaded successfully');
            }
        }
    }, [
        getGoogleDriveLink,
        getValidation,
        setGoogleDriveLink,
        setUploadModal,
        setValidation,
    ]);

    /* ------------------ Upload JD Ends Here -------------------- */
    let prefRegion = watch('region');
    let modeOfWork = watch('workingMode');
    let hrRole = watch('role');
    let watchOtherRole = watch('otherRole');

    const getNRMarginHandler = useCallback(async () => {
        const response = await MasterDAO.getNRMarginRequestDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
            setValue('NRMargin', response && response?.responseBody?.details?.value);
        }
    }, [setValue]);

    const getTimeZonePreference = useCallback(async () => {
        const timeZone = await MasterDAO.getTimeZonePreferenceRequestDAO(
            prefRegion && prefRegion?.id,
        );
        setTimeZonePref(timeZone && timeZone.responseBody);
    }, [prefRegion]);
    const getAvailability = useCallback(async () => {
        const availabilityResponse = await MasterDAO.getFixedValueRequestDAO();
        setAvailability(
            availabilityResponse &&
            availabilityResponse.responseBody?.BindHiringAvailability,
        );
    }, []);
    const getHowSoon = useCallback(async () => {
        const howSoonResponse = await MasterDAO.getHowSoonRequestDAO();
        setHowSoon(howSoonResponse && howSoonResponse.responseBody);
    }, []);

    const getWorkingMode = useCallback(async () => {
        const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
        setWorkingMode(
            workingModeResponse && workingModeResponse?.responseBody?.details,
        );
    }, []);
    const getCountry = useCallback(async () => {
        const countryResponse = await MasterDAO.getCountryDAO();
        setCountry(countryResponse && countryResponse?.responseBody?.details);
    }, []);
    const getTalentRole = useCallback(async () => {
        const talentRole = await MasterDAO.getTalentsRoleRequestDAO();

        setTalentRole(talentRole && talentRole.responseBody);
        setTalentRole((preValue) => [
            ...preValue,
            {
                id: -1,
                value: 'Others',
            },
        ]);
    }, []);

    const getSalesPerson = useCallback(async () => {
        const salesPersonResponse = await MasterDAO.getSalesManRequestDAO();
        setSalesPerson(
            salesPersonResponse && salesPersonResponse?.responseBody?.details,
        );
    }, []);

    const getRegion = useCallback(async () => {
        let response = await MasterDAO.getTalentTimeZoneRequestDAO();
        setRegion(response && response?.responseBody);
    }, []);

    const getDurationTypes = useCallback(async () => {
        const durationTypes = await MasterDAO.getDurationTypeDAO();
        setDurationType(durationTypes && durationTypes?.responseBody?.details);
    }, []);

    const getLocation = useLocation();

    const onNameChange = (event) => {
        setName(event.target.value);
        if (event.target.value) {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }

    };
    const addItem = useCallback(
        (e) => {
            e.preventDefault();
            setItems([...items, name + ' months' || name]);
            setName('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
            setDisableButton(true)
        },
        [items, name],
    );

    const watchClientName = watch('clientName');

    const toggleHRDirectPlacement = useCallback((e) => {
        // e.preventDefault();
        setHRDirectPlacement(e.target.checked);
    }, []);

    const getClientNameValue = (clientName) => {

        setValue('clientName', clientName);
        setError('clientName', {
            type: 'validate',
            message: '',
        });
    };

    // useEffect(() => {
    //     if(getHRdetails?.fullClientName){
    //         getListData(getHRdetails?.fullClientName);

    //     }
    // }, [getHRdetails])


    const getListData = async (clientName, shortclientName) => {
        let response = await MasterDAO.getEmailSuggestionDAO(shortclientName);
        if (response?.statusCode === HTTPStatusCode.OK) {
            setClientNameSuggestion(response?.responseBody?.details);
            setValue("clientName", clientName)
            setClientNameMessage('');
        } else if (
            response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
            response?.statusCode === HTTPStatusCode.NOT_FOUND
        ) {
            setError('clientName', {
                type: 'validate',
                message: response?.responseBody,
            });
            setClientNameMessage(response?.responseBody);
        }
    }
    const getClientNameSuggestionHandler = useCallback(
        async (clientName) => {
            let response = await MasterDAO.getEmailSuggestionDAO(clientName);
            if (response?.statusCode === HTTPStatusCode.OK) {
                setClientNameSuggestion(response?.responseBody?.details);
                setClientNameMessage('');
            } else if (
                response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
                response?.statusCode === HTTPStatusCode.NOT_FOUND
            ) {
                setError('clientName', {
                    type: 'validate',
                    message: response?.responseBody,
                });
                // setClientNameSuggestion([]);
                setClientNameMessage(response?.responseBody);
            }
        },
        [setError],
    );

    const validate = (clientName) => {
        if (!clientName) {
            return 'please enter the client email/name.';
        } else if (getClientNameMessage !== '' && clientName) {
            return getClientNameMessage;
        }
        return true;
    };
    let filteredMemo = useMemo(() => {
        let filteredData = getClientNameSuggestion?.filter(
            (item) => item?.value === watchClientName,
        );
        return filteredData;
    }, [getClientNameSuggestion, watchClientName]);

    const getHRClientName = useCallback(async () => {
        let existingClientDetails =
            await hiringRequestDAO.getClientDetailRequestDAO(
                filteredMemo[0]?.emailId ?? getHRdetails?.contact,
            );
        setError('clientName', {
            type: 'duplicateCompanyName',
            message:
                existingClientDetails?.statusCode === HTTPStatusCode.NOT_FOUND &&
                'Client email does not exist.',
        });
        // existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
        //     setValue('clientName', '');
        existingClientDetails.statusCode === HTTPStatusCode.NOT_FOUND &&
            setValue('companyName', '');
        existingClientDetails.statusCode === HTTPStatusCode.OK &&
            setValue('companyName', existingClientDetails?.responseBody?.name);
        existingClientDetails.statusCode === HTTPStatusCode.OK &&
            setIsCompanyNameAvailable(true);
        setIsLoading(false);
    }, [filteredMemo, setError, setValue]);

    const getOtherRoleHandler = useCallback(
        async (data) => {
            let response = await MasterDAO.getOtherRoleRequestDAO({
                roleName: data,
                roleID: 0,
            });
            if (response?.statusCode === HTTPStatusCode?.BAD_REQUEST) {
                return setError('otherRole', {
                    type: 'otherRole',
                    message: response?.responseBody,
                });
            }
        },
        [setError],
    );
    useEffect(() => {
        let timer;
        if (!_isNull(watchOtherRole)) {
            timer = setTimeout(() => {
                setIsLoading(true);
                getOtherRoleHandler(watchOtherRole);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [getOtherRoleHandler, watchOtherRole]);

    useEffect(() => {
        let timer;
        if (!_isNull(watchClientName)) {
            timer =
                pathName === ClientHRURL.ADD_NEW_HR &&
                setTimeout(() => {
                    setIsLoading(true);
                    getHRClientName();
                }, 2000);
        }
        return () => clearTimeout(timer);
    }, [getHRClientName, watchClientName, pathName]);

    useEffect(() => {
        let urlSplitter = `${getLocation.pathname.split('/')[2]}`;
        setPathName(urlSplitter);
        // pathName === ClientHRURL.ADD_NEW_CLIENT &&
        //     setValue('clientName', clientDetail?.clientemail);
        pathName === ClientHRURL.ADD_NEW_CLIENT &&
            setValue('companyName', clientDetail?.companyname);
    }, [
        getLocation.pathname,
        clientDetail?.clientemail,
        clientDetail?.companyname,
        pathName,
        setValue,
    ]);

    useEffect(() => {

        getAvailability();
        getTalentRole();
        getSalesPerson();
        getRegion();
        getWorkingMode();
        getCountry();
        getHowSoon();
        getNRMarginHandler();
        getDurationTypes();
    }, [
        // getAvailability,
        // getSalesPerson,
        // getTalentRole,
        // getTimeZonePreference,
        // getRegion,
        // prefRegion,
        // getHowSoon,
        // getWorkingMode,
        // getCountry,
        // getNRMarginHandler,
    ]);


    useEffect(() => {
        !_isNull(prefRegion) && getTimeZonePreference();
    }, [prefRegion])


    useEffect(() => {
        setValidation({
            systemFileUpload: '',
            googleDriveFileUpload: '',
            linkValidation: '',
        });
        setGoogleDriveLink('');
    }, [showUploadModal]);

    useEffect(() => {
        isHRDirectPlacement === false && unregister('dpPercentage');
    }, [isHRDirectPlacement, unregister]);

    useEffect(() => {
        if (modeOfWork?.value === 'Remote') {
            unregister(['address', 'city', 'state', 'country', 'postalCode']);
        }
    }, [modeOfWork, unregister]);

    useEffect(() => {
        hrRole !== 'others' && unregister('otherRole');
    }, [hrRole, unregister]);
    /** To check Duplicate email exists End */

    const [messageAPI, contextHolder] = message.useMessage();
    var watchJDUrl = watch("jdURL")
    setEnID(getHRdetails?.en_Id && getHRdetails?.en_Id);
    const hrSubmitHandler = useCallback(
        async (d, type = SubmitType.SAVE_AS_DRAFT) => {
            let hrFormDetails = hrUtils.hrFormDataFormatter(
                d,
                type,
                watch,
                getHRdetails?.addHiringRequest?.contactId,
                isHRDirectPlacement,
                addHRResponse,
                getUploadFileData && getUploadFileData,
                watchJDUrl
            );
            if (type === SubmitType.SAVE_AS_DRAFT) {
                if (_isNull(watch('clientName'))) {
                    return setError('clientName', {
                        type: 'emptyClientName',
                        message: 'Please enter the client name.',
                    });
                }
            } else if (type !== SubmitType.SAVE_AS_DRAFT) {
                setType(SubmitType.SUBMIT);
            }
            const addHRRequest = await hiringRequestDAO.createHRDAO(hrFormDetails);

            if (addHRRequest.statusCode === HTTPStatusCode.OK) {
                setAddHRResponse(getHRdetails?.en_Id);
                type !== SubmitType.SAVE_AS_DRAFT && setTitle('Edit Debriefing HR');
                type !== SubmitType.SAVE_AS_DRAFT &&
                    setTabFieldDisabled({ ...tabFieldDisabled, debriefingHR: false });
                // setFromEditDeBriefing({ ...fromEditDeBriefing, addNewHiringRequest: true });

                type === SubmitType.SAVE_AS_DRAFT &&
                    messageAPI.open({
                        type: 'success',
                        content: 'HR details has been saved to draft.',
                    });
            }
        },
        [
            addHRResponse,
            filteredMemo,
            isHRDirectPlacement,
            messageAPI,
            setEnID,
            setError,
            setTabFieldDisabled,
            setTitle,
            tabFieldDisabled,
            watch,
            getHRdetails, getUploadFileData
        ],
    );
    useEffect(() => {
        setValue('hrTitle', hrRole?.value);
    }, [hrRole?.value, setValue]);

    useEffect(() => {
        if (errors?.clientName?.message) {
            controllerRef.current.focus();
        }
    }, [errors?.clientName]);

    // const durationTypenfo = []

    // const durationData = getDurationType.map((item) => {
    //     return (
    //         durationTypenfo.push({
    //             id: item.value,
    //             value: item.text
    //         })
    //     )
    // })

    const durationDataMemo = useMemo(() => {
        let formattedDuration = [];
        getDurationType?.filter(
            (item) =>
                item?.value !== '0' &&
                formattedDuration.push({
                    id: item?.value,
                    value: item?.text,
                }),
        );
        return formattedDuration;
    }, [getDurationType]);



    useEffect(() => {
        setValue("clientName", getHRdetails?.fullClientName)
        setValue("companyName", getHRdetails?.company)
        setValue("hrTitle", getHRdetails?.addHiringRequest?.requestForTalent)
        setValue("jdURL", getHRdetails?.directPlacement?.jdURL)
        setValue("minimumBudget", getHRdetails?.salesHiringRequest_Details?.budgetFrom)
        setValue("maximumBudget", getHRdetails?.salesHiringRequest_Details?.budgetTo)
        setValue("NRMargin", getHRdetails?.addHiringRequest?.talentCostCalcPercentage)
        setValue("months", getHRdetails?.salesHiringRequest_Details?.specificMonth)
        setValue("years", getHRdetails?.salesHiringRequest_Details?.yearOfExp)
        setValue("talentsNumber", getHRdetails?.addHiringRequest?.noofTalents)
        setValue("dealID", getHRdetails?.addHiringRequest?.dealId)
        setValue("bqFormLink", getHRdetails?.addHiringRequest?.bqlink)
        setValue("discoveryCallLink", getHRdetails?.addHiringRequest?.discoveryCall)
        setValue("dpPercentage", getHRdetails?.addHiringRequest?.dppercentage)
        setValue("postalCode", getHRdetails?.directPlacement?.postalCode)
        setValue("city", getHRdetails?.directPlacement?.city)
        setValue("state", getHRdetails?.directPlacement?.state)
        setValue("country", getHRdetails?.directPlacement?.country)
        setValue("address", getHRdetails?.directPlacement?.address)
        setValue("jdExport", getHRdetails?.addHiringRequest?.jdfilename)
        setValue("contractDuration", getHRdetails?.salesHiringRequest_Details?.durationType)
        setValue("getDurationType", getHRdetails?.months)
        setContractDuration(getHRdetails?.salesHiringRequest_Details?.durationType)
        if (getHRdetails?.clientName) {
            getListData(getHRdetails?.clientName, getHRdetails?.clientName.substring(0, 3));

        }
        setUploadFileData(getHRdetails?.addHiringRequest?.jdfilename)
    }, [getHRdetails])
    useEffect(() => {
        if (localStorage.getItem("hrID")) {
            getHRdetailsHandler(localStorage.getItem("hrID"))
        }
    }, [])


    useEffect(() => {
        if (getHRdetails?.addHiringRequest?.requestForTalent) {
            const findRole = talentRole.filter((item) => item?.value === getHRdetails?.addHiringRequest?.requestForTalent)
            setValue("role", findRole[0])
            setControlledRoleValue(findRole[0]?.value)
        }
    }, [getHRdetails, talentRole])

    useEffect(() => {
        if (getHRdetails?.salesHiringRequest_Details?.currency) {
            const findCurrency = currencyResult.filter((item) => item?.value === getHRdetails?.salesHiringRequest_Details?.currency)
            setValue("budget", findCurrency[0]?.value)
            setControlledBudgetValue(findCurrency[0]?.value)
        }
    }, [getHRdetails, currencyResult])

    useEffect(() => {
        if (getHRdetails?.addHiringRequest?.salesUserId) {
            const findSalesPerson = salesPerson.filter((item) => item?.id === getHRdetails?.addHiringRequest?.salesUserId)
            setValue("salesPerson", findSalesPerson[0]?.id)
            setControlledSalesValue(findSalesPerson[0]?.value)
        }
    }, [getHRdetails, salesPerson])

    useEffect(() => {
        if (getHRdetails?.addHiringRequest?.availability) {
            const findAvailability = availability.filter((item) => item?.value === getHRdetails?.addHiringRequest?.availability)
            setValue("availability", findAvailability[0])
            setControlledAvailabilityValue(findAvailability[0]?.value)
        }
    }, [getHRdetails, availability])

    useEffect(() => {
        if (getHRdetails?.salesHiringRequest_Details?.timezoneId) {
            const findRegion = region.filter((item) => item?.id === getHRdetails?.salesHiringRequest_Details?.timezoneId)
            setValue("region", findRegion[0])
            setControlledRegionValue(findRegion[0]?.value)
        }
    }, [getHRdetails, region])

    useEffect(() => {
        if (getHRdetails?.salesHiringRequest_Details?.timezonePreferenceId) {
            const findTimeZone = timeZonePref.filter((item) => item?.id === getHRdetails?.salesHiringRequest_Details?.timezonePreferenceId)
            setValue("timeZone", findTimeZone[0])
            setControlledTimeZoneValue(findTimeZone[0]?.value)
        }
    }, [getHRdetails, timeZonePref])


    useEffect(() => {
        if (getHRdetails?.salesHiringRequest_Details?.howSoon) {
            const findSoon = howSoon.filter((item) => item?.value === getHRdetails?.salesHiringRequest_Details?.howSoon)
            setValue("howSoon", findSoon[0])
            setControlledTimeSoonValue(findSoon[0]?.value)
        }
    }, [getHRdetails, howSoon])

    useEffect(() => {
        if (getHRdetails?.hdnModeOfWork) {
            const findWorkingMode = workingMode.filter((item) => item?.value === getHRdetails?.hdnModeOfWork)
            setValue("workingMode", findWorkingMode[0])
            setControlledWorkingValue(findWorkingMode[0]?.value)
        }
    }, [getHRdetails])

    useEffect(() => {
        if (getHRdetails?.directPlacement?.country) {
            const findCountryMode = country.filter((item) => item?.id === Number(getHRdetails?.directPlacement?.country))
            setValue("country", findCountryMode[0])
            setControlledCountryValue(findCountryMode[0]?.value)
        }
    }, [getHRdetails])

    useEffect(() => {
        if (getHRdetails?.months) {
            const findDurationMode = durationDataMemo.filter((item) => Number(item?.id) === getHRdetails?.months)
            setValue("getDurationType", findDurationMode[0]?.id)
            setControlledDurationTypeValue(findDurationMode[0]?.value)
        }
    }, [getHRdetails, durationDataMemo])

    useEffect(() => {
        if (getHRdetails?.salesHiringRequest_Details?.durationType) {
            const findcontactMode = items.filter((item) => item === getHRdetails?.salesHiringRequest_Details?.durationType)
            setValue("contractDuration", findcontactMode[0])
            setContractDuration(findcontactMode[0])
        }
    }, [getHRdetails, items])


    useEffect(() => {
        if (localStorage.getItem("fromEditDeBriefing")) {
            setTitle('Edit Debriefing HR')
        }
    }, [localStorage.getItem("fromEditDeBriefing")])


    return (
        <div className={HRFieldStyle.hrFieldContainer}>
            {contextHolder}
            <div className={HRFieldStyle.partOne}>
                <div className={HRFieldStyle.hrFieldLeftPane}>
                    <h3>Hiring Request Details</h3>
                    <p>Please provide the necessary details</p>
                </div>

                <form
                    id="hrForm"
                    className={HRFieldStyle.hrFieldRightPane}>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd12}>
                            <div className={HRFieldStyle.formGroup}>
                                <label>Client Email/Name</label>
                                <Controller
                                    render={({ ...props }) => (
                                        <AutoComplete
                                            options={getClientNameSuggestion}
                                            onSelect={(clientName) => getClientNameValue(clientName)}
                                            filterOption={true}
                                            onSearch={(searchValue) => {
                                                // setClientNameSuggestion([]);
                                                getClientNameSuggestionHandler(searchValue);
                                            }}
                                            onChange={(clientName) => {
                                                setValue('clientName', clientName)
                                            }
                                            }
                                            placeholder="Enter Client Email/Name"
                                            ref={controllerRef}
                                            // name="clientName"
                                            // defaultValue={clientNameValue}
                                            value={watchClientName}
                                        />
                                    )}
                                    {...register('clientName', {
                                        validate,
                                    })}
                                    name="clientName"
                                    // rules={{ required: true }}
                                    control={control}
                                />
                                {errors.clientName && (
                                    <div className={HRFieldStyle.error}>
                                        {errors.clientName?.message &&
                                            `* ${errors?.clientName?.message}`}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <div className={HRFieldStyle.colMd12}>
							<HRInputField
								disabled={pathName === ClientHRURL.ADD_NEW_CLIENT || isLoading}
								register={register}
								errors={errors}
								validationSchema={{
									required: 'please enter the client email/name.',
								}}
								label={'Client Email/Name'}
								name="clientName"
								type={InputType.TEXT}
								placeholder="Enter Client Email/Name"
								required
							/>
						</div> */}
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                disabled={
                                    pathName === ClientHRURL.ADD_NEW_CLIENT ||
                                    isCompanyNameAvailable ||
                                    isLoading
                                }
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the company name.',
                                }}
                                label="Company Name"
                                name="companyName"
                                type={InputType.TEXT}
                                placeholder="Enter Company Name"
                                required
                            />
                        </div>

                        <div className={HRFieldStyle.colMd6}>
                            <HRSelectField
                                controlledValue={controlledSalesValue}
                                setControlledValue={setControlledSalesValue}
                                isControlled={true}
                                setValue={setValue}
                                mode={'id'}
                                register={register}
                                label={'Sales Person'}
                                options={salesPerson && salesPerson}
                                name="salesPerson"
                                isError={errors['salesPerson'] && errors['salesPerson']}
                                required
                                errorMsg={'Please select hiring request sales person'}
                            />
                        </div>

                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledRoleValue}
                                    setControlledValue={setControlledRoleValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    searchable={true}
                                    setValue={setValue}
                                    register={register}
                                    label={'Hiring Request Role'}
                                    options={talentRole && talentRole}
                                    name="role"
                                    isError={errors['role'] && errors['role']}
                                    required
                                    errorMsg={'Please select hiring request role'}
                                />
                            </div>
                        </div>
                    </div>
                    {watch('role')?.id === -1 && (
                        <div className={HRFieldStyle.row}>
                            <div className={HRFieldStyle.colMd12}>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter the other role.',
                                        pattern: {
                                            value: /^((?!other).)*$/,
                                            message: 'Please remove "other" keyword.',
                                        },
                                    }}
                                    label="Other Role"
                                    name="otherRole"
                                    type={InputType.TEXT}
                                    placeholder="Enter Other role"
                                    maxLength={50}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd12}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the hiring request title.',
                                }}
                                label={'Hiring Request Title'}
                                name="hrTitle"
                                type={InputType.TEXT}
                                placeholder="Enter title"
                                required
                            />
                        </div>
                    </div>
                    <div className={`${HRFieldStyle.row} ${HRFieldStyle.fieldOr}`}>
                        <div className={HRFieldStyle.colMd6}>
                            {!getUploadFileData ? (
                                <HRInputField
                                    disabled={!_isNull(watch('jdURL'))}
                                    register={register}
                                    leadingIcon={<UploadSVG />}
                                    label="Job Description"
                                    name="jdExport"
                                    type={InputType.BUTTON}
                                    buttonLabel="Upload JD File"
                                    setValue={setValue}
                                    onClickHandler={() => setUploadModal(true)}

                                    errors={errors}
                                />
                            ) : (
                                <div className={HRFieldStyle.uploadedJDWrap}>
                                    <label>Job Description</label>
                                    <div className={HRFieldStyle.uploadedJDName}>
                                        {getUploadFileData}{' '}
                                        <CloseSVG
                                            className={HRFieldStyle.uploadedJDClose}
                                            onClick={() => {
                                                // setJDParsedSkills({});
                                                setUploadFileData('');
                                                setValue("jdExport", "");
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <UploadModal
                            isLoading={isLoading}
                            uploadFileRef={uploadFile}
                            uploadFileHandler={(e) => uploadFileHandler(e.target.files[0])}
                            googleDriveFileUploader={() => googleDriveFileUploader()}
                            uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                            modalTitle={'Upload JD'}
                            isFooter={true}
                            modalSubtitle={'Job Description'}
                            openModal={showUploadModal}
                            setUploadModal={setUploadModal}
                            cancelModal={() => setUploadModal(false)}
                            setValidation={setValidation}
                            getValidation={getValidation}
                            getGoogleDriveLink={getGoogleDriveLink}
                            setGoogleDriveLink={setGoogleDriveLink}
                            setUploadFileData={setUploadFileData}
                        />
                        <div className={HRFieldStyle.orLabel}>OR</div>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                disabled={getUploadFileData}
                                label="Job Description URL"
                                name="jdURL"
                                type={InputType.TEXT}
                                placeholder="Add JD link"
                                register={register}
                                errors={errors}
                                required={!getUploadFileData}
                                validationSchema={{
                                    // pattern: {
                                    //     value: URLRegEx.url,
                                    //     message: 'Entered value does not match url format',
                                    // },
                                }}
                            />
                        </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd4}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledBudgetValue}
                                    setControlledValue={setControlledBudgetValue}
                                    isControlled={true}
                                    setValue={setValue}
                                    register={register}
                                    label={'Add your estimated budget'}
                                    options={currencyResult && currencyResult}
                                    name="budget"
                                    isError={errors['budget'] && errors['budget']}
                                    required
                                    mode={'value'}
                                    errorMsg={'Please select hiring request budget'}
                                />
                            </div>
                        </div>
                        <div className={HRFieldStyle.colMd4}>
                            <HRInputField
                                label={'Minimum Budget'}
                                register={register}
                                name="minimumBudget"
                                type={InputType.NUMBER}
                                placeholder="Minimum- Ex: 2300, 2000"
                                required
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the minimum budget.',
                                    min: {
                                        value: 1,
                                        message: `please don't enter the value less than 1`,
                                    },
                                }}
                            />
                        </div>

                        <div className={HRFieldStyle.colMd4}>
                            <HRInputField
                                label={'Maximum Budget'}
                                register={register}
                                name="maximumBudget"
                                type={InputType.NUMBER}
                                placeholder="Maximum- Ex: 2300, 2000"
                                required
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the maximum budget.',
                                    min: {
                                        value: watch('minimumBudget'),
                                        message: 'Budget should me more than minimum budget.',
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the nr margin percentage.',
                                }}
                                label="NR Margin Percentage"
                                name="NRMargin"
                                type={InputType.TEXT}
                                placeholder="Select NR margin percentage"
                                required
                            />
                        </div>

                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                {/* <HRSelectField
                                    setValue={setValue}
                                    register={register}
                                    label={'Sales Person'}
                                    defaultValue="Select sales Person"
                                    options={salesPerson && salesPerson}
                                    name="salesPerson"
                                    isError={errors['salesPerson'] && errors['salesPerson']}
                                    required
                                    errorMsg={'Please select hiring request sales person'}
                                /> */}
                                {/* <HRSelectField
                                    controlledValue={controlledSalesValue}
                                    setControlledValue={setControlledSalesValue}
                                    isControlled={true}
                                    setValue={setValue}
                                    mode={'id/value'}
                                    register={register}
                                    label={'Sales Person'}
                                    options={salesPerson && salesPerson}
                                    name="salesPerson"
                                    isError={errors['salesPerson'] && errors['salesPerson']}
                                    required
                                    errorMsg={'Please select hiring request sales person'}
                                /> */}
                            </div>
                        </div>
                    </div>

                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd4}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledDurationTypeValue}
                                    setControlledValue={setControlledDurationTypeValue}
                                    setValue={setValue}
                                    isControlled={true}
                                    register={register}
                                    label={'Long Term/Short Term'}
                                    options={durationDataMemo && durationDataMemo}
                                    name="getDurationType"
                                    mode={'id'}
                                    isError={errors['getDurationType'] && errors['getDurationType']}
                                    required
                                    errorMsg={'Please select duration type'}
                                />
                            </div>
                        </div>
                        <div className={HRFieldStyle.colMd4}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}

                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <label>Other:</label>
                                                <input
                                                    type={InputType.NUMBER}
                                                    className={HRFieldStyle.addSalesItem}
                                                    placeholder="Ex: 5,6,7..."
                                                    ref={inputRef}
                                                    value={name}
                                                    onChange={onNameChange}
                                                />

                                                <Button
                                                    style={{
                                                        backgroundColor: `var(--uplers-grey)`,
                                                    }}
                                                    disabled={disableButton ? true : false}
                                                    shape="round"
                                                    type="text"
                                                    icon={<PlusOutlined />}
                                                    onClick={addItem}>
                                                    Add item
                                                </Button>
                                            </Space>
                                            <br />
                                        </>
                                    )}
                                    options={items.map((item) => ({
                                        id: item,
                                        label: item,
                                        value: item,
                                    }))}
                                    controlledValue={contractDurationValue}
                                    setControlledValue={setContractDuration}
                                    isControlled={true}
                                    setValue={setValue}
                                    register={register}
                                    label={'Contract Duration (in months)'}
                                    defaultValue="Ex: 3,6,12..."
                                    inputRef={inputRef}
                                    addItem={addItem}
                                    mode={'value'}
                                    onNameChange={onNameChange}
                                    name="contractDuration"
                                    isError={
                                        errors['contractDuration'] && errors['contractDuration']
                                    }
                                    required
                                    errorMsg={'Please select hiring request conrtact duration'}
                                />
                            </div>
                        </div>
                        <div className={HRFieldStyle.colMd4}>
                            <div className={HRFieldStyle.formGroup}>
                                {/* <label>
                                    Required Experience
                                    <span className={HRFieldStyle.reqField}>*</span>
                                </label> */}
                                {/* <div className={HRFieldStyle.reqExperience}> */}
                                <HRInputField
                                    required
                                    label="Required Experience"
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter the years.',
                                        min: {
                                            value: 1,
                                            message: `please don't enter the value less than 1`,
                                        },
                                    }}
                                    register={register}
                                    name="years"
                                    type={InputType.NUMBER}
                                    placeholder="Enter years"
                                />
                                {/* <HRInputField
                                        register={register}
                                        required
                                        errors={errors}
                                        validationSchema={{
                                            max: {
                                                value: 12,
                                                message: `please don't enter the value more than 12`,
                                            },
                                            min: {
                                                value: 0,
                                                message: `please don't enter the value less than 0`,
                                            },
                                        }}
                                        name="months"
                                        type={InputType.NUMBER}
                                        placeholder="Enter months"
                                    /> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the number of talents.',
                                    min: {
                                        value: 1,
                                        message: `please enter the value more than 0`,
                                    },
                                }}
                                label="How many talents are needed."
                                name="talentsNumber"
                                type={InputType.NUMBER}
                                placeholder="Please enter number of talents needed"
                                required
                            />
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                {/* <HRSelectField
                                    mode={'id/value'}
                                    setValue={setValue}
                                    register={register}
                                    label={'Availability'}
                                    defaultValue="Select availability"
                                    options={availability}
                                    name="availability"
                                    isError={errors['availability'] && errors['availability']}
                                    required
                                    errorMsg={'Please select the availability.'}
                                /> */}
                                <HRSelectField
                                    controlledValue={controlledAvailabilityValue}
                                    setControlledValue={setControlledAvailabilityValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    setValue={setValue}
                                    register={register}
                                    label={'Availability'}
                                    defaultValue="Select availability"
                                    options={availability}
                                    name="availability"
                                    isError={errors['availability'] && errors['availability']}
                                    required
                                    errorMsg={'Please select the availability.'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledRegionValue}
                                    setControlledValue={setControlledRegionValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    setValue={setValue}
                                    register={register}
                                    label={'Select Region'}
                                    defaultValue="Select Region"
                                    options={region && region}
                                    name="region"
                                    isError={errors['region'] && errors['region']}
                                    required
                                    errorMsg={'Please select the region.'}
                                />
                            </div>
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledTimeZoneValue}
                                    setControlledValue={setControlledTimeZoneValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    disabled={_isNull(prefRegion)}
                                    setValue={setValue}
                                    register={register}
                                    label={'Select Time Zone'}
                                    defaultValue="Select time zone"
                                    options={timeZonePref}
                                    name="timeZone"
                                    isError={errors['timeZone'] && errors['timeZone']}
                                    required
                                    errorMsg={'Please select hiring request time zone.'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledSoonValue}
                                    setControlledValue={setControlledTimeSoonValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    setValue={setValue}
                                    register={register}
                                    label={'How soon can they join?'}
                                    defaultValue="Select how soon?"
                                    options={howSoon}
                                    name="howSoon"
                                    isError={errors['howSoon'] && errors['howSoon']}
                                    required
                                    errorMsg={'Please select the how soon.'}
                                />
                            </div>
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                label="Deal ID"
                                name="dealID"
                                type={InputType.NUMBER}
                                placeholder="Enter ID"
                            />
                        </div>
                    </div>

                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the BQ form link.',
                                }}
                                label="BQ Form Link"
                                name="bqFormLink"
                                type={InputType.TEXT}
                                placeholder="Enter the link for BQ form"
                                required
                            />
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the discovery call link.',
                                }}
                                label="Discovery Call Link"
                                name="discoveryCallLink"
                                type={InputType.TEXT}
                                placeholder="Enter the link for Discovery call"
                                required
                            />
                        </div>
                    </div>

                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd12}>
                            <div className={HRFieldStyle.checkBoxGroup}>
                                <Checkbox onClick={toggleHRDirectPlacement}>
                                    Is this HR a Direct Placement?
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <div className={HRFieldStyle.formGroup}>
                                {/* <HRSelectField
                                    mode={'id/value'}
                                    searchable={false}
                                    setValue={setValue}
                                    register={register}
                                    label={'Mode of Working?'}
                                    defaultValue="Select working mode"
                                    options={workingMode && workingMode}
                                    name="workingMode"
                                    isError={errors['workingMode'] && errors['workingMode']}
                                    required
                                    errorMsg={'Please select the working mode.'}
                                /> */}
                                <HRSelectField
                                    controlledValue={controlledWorkingValue}
                                    setControlledValue={setControlledWorkingValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    searchable={false}
                                    setValue={setValue}
                                    register={register}
                                    label={'Mode of Working?'}
                                    defaultValue="Select working mode"
                                    options={workingMode && workingMode}
                                    name="workingMode"
                                    isError={errors['workingMode'] && errors['workingMode']}
                                    required
                                    errorMsg={'Please select the working mode.'}
                                />
                            </div>
                        </div>
                        {isHRDirectPlacement && (
                            <div className={HRFieldStyle.colMd6}>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter the DP Percentage.',
                                    }}
                                    label="DP Percentage"
                                    name="dpPercentage"
                                    type={InputType.NUMBER}
                                    placeholder="Enter the DP Percentage"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {getWorkingModelFields()}
                </form>
            </div>
            <Divider />
            {/* <AddInterviewer
				errors={errors}
				append={append}
				remove={remove}
				register={register}
				fields={fields}
			/> */}

            <div className={HRFieldStyle.formPanelAction}>
                <button
                    style={{ cursor: type === SubmitType.SUBMIT ? 'no-drop' : 'pointer' }}
                    disabled={type === SubmitType.SUBMIT}
                    className={HRFieldStyle.btn}
                    onClick={hrSubmitHandler}>
                    Save as Draft
                </button>

                <button
                    onClick={handleSubmit(hrSubmitHandler)}
                    className={HRFieldStyle.btnPrimary}>
                    Create HR
                </button>
            </div>
        </div>
    );

    function getWorkingModelFields() {
        if (
            watch('workingMode') === undefined ||
            watch('workingMode').value === undefined ||
            watch('workingMode').value === WorkingMode.REMOTE
        ) {
            return null;
        } else {
            return (
                <>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the postal code.',
                                }}
                                label="Postal Code"
                                name="postalCode"
                                type={InputType.TEXT}
                                placeholder="Enter the Postal Code"
                                required
                            />
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                        <div className={HRFieldStyle.formGroup}>
                                <HRSelectField
                                    controlledValue={controlledCountryValue}
                                    setControlledValue={setControlledCountryValue}
                                    isControlled={true}
                                    mode={'id/value'}
                                    searchable={false}
                                    setValue={setValue}
                                    register={register}
                                    label={'Country'}
                                    defaultValue="Select country"
                                    options={country && country}
                                    name="country"
                                    isError={errors['country'] && errors['country']}
                                    required
                                    errorMsg={'Please select the country.'}
                                />
                            </div>
                            </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the state.',
                                }}
                                label="State"
                                name="state"
                                type={InputType.TEXT}
                                placeholder="Enter the State"
                                required
                            />
                        </div>
                        <div className={HRFieldStyle.colMd6}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the city.',
                                }}
                                label="City"
                                name="city"
                                type={InputType.TEXT}
                                placeholder="Enter the City"
                                required
                            />
                        </div>
                    </div>
                    <div className={HRFieldStyle.row}>
                        <div className={HRFieldStyle.colMd12}>
                            <HRInputField
                                isTextArea={true}
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the address.',
                                }}
                                label="Address"
                                name="address"
                                type={InputType.TEXT}
                                placeholder="Enter the Address"
                                required
                            />
                        </div>
                    </div>
                </>
            );
        }
    }
};

export default EditHRFields;
