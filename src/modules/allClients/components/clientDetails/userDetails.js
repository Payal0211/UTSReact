import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import userDetails from "./userDetails.module.css";
import { InputType } from "constants/application";
import { useForm } from "react-hook-form";
import { _isNull } from "shared/utils/basic_utils";
import { useEffect, useState } from "react";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { allClientRequestDAO } from "core/allClients/allClientsDAO";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkbox, Spin } from "antd";
import LogoLoader from "shared/components/loader/logoLoader";

const UserDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [IsChecked, setIsChecked] = useState({
    IsPostaJob: false,
    IsProfileView: false,
    IsHybridModel: false,
  });
  const [error, setErrors] = useState(false);
  const [errorData, setErrorsData] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const {
    watch,
    register,
    setError,
    formState: { errors },
  } = useForm();

  let full_name = watch("fullName");
  let company_name = watch("companyName");
  let work_email = watch("workEmail");
  let free_credits = watch("freeCredits");
  useEffect(() => {
    if (full_name) {
      setError("fullName", null);
    }
  }, [full_name]);
  useEffect(() => {
    if (company_name) {
      setError("companyName", null);
    }
  }, [company_name]);
  useEffect(() => {
    if (work_email) {
      setError("workEmail", null);
    }
  }, [work_email]);
  useEffect(() => {
    if (free_credits) {
      setError("freeCredits", null);
    }
  }, [free_credits]);

  const handleSubmit = () => {
    let isValid = true;
    let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (_isNull(full_name)) {
      isValid = false;
      setError("fullName", {
        type: "fullName",
        message: "please enter client full name.",
      });
    }
    if (_isNull(company_name)) {
      isValid = false;
      setError("companyName", {
        type: "companyName",
        message: "please enter company name.",
      });
    }
    if (_isNull(work_email)) {
      isValid = false;
      setError("workEmail", {
        type: "workEmail",
        message: "please enter work email.",
      });
    } else if (!emailRegex.test(work_email)) {
      isValid = false;
      setError("workEmail", {
        type: "workEmail",
        message: "Please enter a valid work email.",
      });
    }
    if (_isNull(free_credits)) {
      isValid = false;
      setError("freeCredits", {
        type: "freeCredits",
        message: "please enter free Credits.",
      });
    } else if (free_credits < 1) {
      isValid = false;
      setError("freeCredits", {
        type: "freeCredits",
        message: "please enter value more than 0.",
      });
    } else if (free_credits > 999) {
      isValid = false;
      setError("freeCredits", {
        type: "freeCredits",
        message: "please do not enter value more than 3 digits.",
      });
    }
    if (IsChecked?.IsPostaJob === false && IsChecked?.IsProfileView === false) {
      setErrors(true);
      isValid = false;
    }

    if (isValid) {
      onSubmitData();
    }
  };

  const onSubmitData = async () => {
    setIsLoading(true);
    let payload = {
      fullName: full_name,
      workEmail: work_email,
      companyName: company_name,
      freeCredit: Number(free_credits),
      IsPostaJob: IsChecked?.IsPostaJob,
      IsProfileView: IsChecked?.IsProfileView,
      IsHybridModel: IsChecked?.IsHybridModel,
    };
    const response = await allClientRequestDAO.userDetailsDAO(payload);
    if (response.statusCode === HTTPStatusCode.OK) {
      toast.success("Client added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate(UTSRoutes.ALLCLIENTS);
      }, 1000);
      setErrorsData(false);
    } else if (response.statusCode === HTTPStatusCode.BAD_REQUEST) {
      // toast.error(response.responseBody, {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 2000,
      //   });
      setErrorsData(true);
      setErrorMessage(response?.responseBody);
    }
    setIsLoading(false);
  };
  return (
    <div className={userDetails.addNewContainer}>
      <LogoLoader visible={isLoading} />
      <div className={userDetails.tabsBody}>
        <div className={userDetails.tabsFormItem}>
          <div className={userDetails.tabsFormItemInner}>
            <>
              <div className={userDetails.tabsLeftPanel}>
                <h3>Invite Credit Base Client</h3>
                {/* <p>Please provide the necessary details</p> */}
              </div>
              <div className={userDetails.tabsRightPanel}>
                {/* {isLoading ? <div className={userDetails.spin}> <Spin/> </div>:  */}
                <form
                  id="userDetailsform"
                  className={userDetails.hrFieldRightPane}
                >
                  <ToastContainer />

                  <div className={userDetails.row}>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Client Full Name"
                        name="fullName"
                        type={InputType.TEXT}
                        placeholder="Enter client full name"
                        required
                      />
                    </div>
                  </div>
                  <div className={userDetails.row}>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Company Name"
                        name="companyName"
                        type={InputType.TEXT}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>

                  <div className={userDetails.row}>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Work Email"
                        name="workEmail"
                        type={InputType.TEXT}
                        placeholder="Enter work email"
                        required
                      />
                    </div>

                  </div>
                  <div className={userDetails.row}>
                    <div className={userDetails.colMd6}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Free Credits"
                        name="freeCredits"
                        type={InputType.NUMBER}
                        placeholder="Enter free credits"
                        required
                        onKeyDownHandler={(e) => {
                          if (
                            e.key === "-" ||
                            e.key === "+" ||
                            e.key === "E" ||
                            e.key === "e"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className={userDetails.checkbox}>
                    <Checkbox
                      name="IsPostaJob"
                      checked={IsChecked?.IsPostaJob}
                      onChange={(e) => {
                        setIsChecked({
                          ...IsChecked,
                          IsPostaJob: e.target.checked,
                        });
                        setErrors(false);
                      }}
                    >
                      Credit per post a job.
                    </Checkbox>
                    <Checkbox
                      name="IsProfileView"
                      checked={IsChecked?.IsProfileView}
                      onChange={(e) => {
                        setIsChecked({
                          ...IsChecked,
                          IsProfileView: e.target.checked,
                        });
                        setErrors(false);
                      }}
                    >
                      Credit per profile view.
                    </Checkbox>
                  </div>
                  {error && (
                    <p className={userDetails.error}>
                      *Please select option per post a job or per profile view.
                    </p>
                  )}
                  <div className={userDetails.checkbox}>
                    <Checkbox
                      name="IsHybridModel"
                      checked={IsChecked?.IsHybridModel}
                      onChange={(e) =>
                        setIsChecked({
                          ...IsChecked,
                          IsHybridModel: e.target.checked,
                        })
                      }
                    >
                      Do you want to continue with Pay Per Hire (Hybrid) model ?
                    </Checkbox>
                  </div>
                  {errorData && (
                    <p className={userDetails.error}>{errorMessage}</p>
                  )}
                  <div>
                    <button
                      type="button"
                      className={userDetails.btn}
                      onClick={handleSubmit}
                    >
                      SUBMIT
                    </button>
                  </div>
                </form>
                {/* } */}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
