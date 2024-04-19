import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import allengagementReplceTalentStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Radio, Skeleton, Table,  } from 'antd';
import Select from 'react-select';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import { ReactComponent as TickMark } from "assets/svg/assignCurrect.svg";
import { MasterDAO } from 'core/master/masterDAO';


export default function EditAllBRPR({closeModal,allBRPRdata}) {
  const [allBRPRlist, setAllBRPRList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [availability, setAvailability] = useState([]);

const getAllBRPRTableData = async (onboardID)=>{
  setIsLoading(true)
    let result = await engagementRequestDAO.getAllBRPRListDAO(onboardID)
    // console.log("getAllBRPRTableData",result)
    if(result.statusCode === HTTPStatusCode.OK){
      setAllBRPRList(result.responseBody)
      setIsLoading(false)
    }
}

  useEffect(()=>{
    getAllBRPRTableData(allBRPRdata?.onboardID )
    getAvailability()
  }
  ,[allBRPRdata?.onboardID ])  

  const saveHandler = 
		async (d,isBillRateEdit) => {
			setIsLoading(true)
			let billRateDataFormatter = {
				onboardId: d.onBoardID,
				billRate: d.br,
				payRate: d.pr,
				nr: d.actual_NR_Percentage,
				billRateComment: 'Bulk_BR_PR_Update',
				payRateComment: 'Bulk_BR_PR_Update',
				billrateCurrency: d.currency,
				month: d.months,
				year: d.years,
        ContractType: d.contractType,
				billRateReason: 'Bulk_BR_PR_Update',
				payrateReason: 'Bulk_BR_PR_Update',
				isEditBillRate: isBillRateEdit,
        isFromMultiPopup : true
			};

			const response = await engagementRequestDAO.saveEditBillPayRateRequestDAO(
				billRateDataFormatter,
			);

			if (response.statusCode === HTTPStatusCode.OK) {
        getAllBRPRTableData(allBRPRdata?.onboardID)
			}
			setIsLoading(false)
		}
	

  const CompBRColField = ({val,data}) => {
    const [isEdit,setIsEdit] = useState(false)
    const [colval,setcolVal]= useState(val)

    const updateBRValue= () =>{
      if(colval > data.pr){
      let dataTochange = {...data}
      let newNRDPValue = colval - dataTochange.pr
      let newNRDPPer = (1 - (dataTochange.pr / colval)) * 100
      dataTochange.br = colval
      dataTochange.edited = true
      dataTochange.nR_DP_Value = newNRDPValue.toFixed(2)
      dataTochange.actual_NR_Percentage = newNRDPPer.toFixed(2)
      
      saveHandler(dataTochange,true)
      }
      
    }

    if(isEdit){
      return <div style={{display:'flex' , alignItems:'center'}}><div style={{display:'flex' ,flexDirection:'column'}}><input type='number' onDoubleClick={()=>{setIsEdit(false);setcolVal(val)}} value={colval} onChange={e=> setcolVal(+e.target.value)} /> 
      {colval < data.pr && <p style={{ margin:'0', color:'red'}}>BR can not be less then PR</p>}
      </div> <TickMark
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => updateBRValue()}
    /></div>
    }else{
      return <p style={{cursor:'pointer', margin:'0'}} onDoubleClick={()=>setIsEdit(true)}>{val}</p>
    }
  }

  const CompPRColField = ({val,data}) => {
    const [isEdit,setIsEdit] = useState(false)
    const [colval,setcolVal]= useState(val)

    const updatePRValue= () =>{
      if(colval < data.br){    
      let dataTochange = {...data}
      let newNRDPValue = dataTochange.br - colval  
      let newNRDPPer = (1 - (colval / dataTochange.br)) * 100
      dataTochange.pr = colval
      dataTochange.edited = true
      dataTochange.nR_DP_Value = newNRDPValue.toFixed(2)
      dataTochange.actual_NR_Percentage = newNRDPPer.toFixed(2)

      saveHandler(dataTochange,false)
      }
      
    }


    if(isEdit){
      return <div style={{display:'flex' }}><div style={{display:'flex' ,flexDirection:'column'}}><input type='number' onDoubleClick={()=>{setIsEdit(false);setcolVal(val)}} value={colval} onChange={e=> setcolVal(+e.target.value)} />
      {colval > data.br && <p style={{ margin:'0', color:'red'}}>PR can not be greater then  BR</p>}
      </div> <TickMark
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => updatePRValue()}
    /></div>
    }else{
      return <p style={{cursor:'pointer', margin:'0'}} onDoubleClick={()=>setIsEdit(true)}>{val}</p>
    }
  }

  const getAvailability = useCallback(async () => {
    const availabilityResponse = await MasterDAO.getFixedValueRequestDAO();
    setAvailability(
      availabilityResponse &&
        availabilityResponse.responseBody?.BindHiringAvailability.reverse()
    );
  }, []);

  const CompContractTypeColField = ({val,data}) => {
    const [isEdit,setIsEdit] = useState(false)
    const [colval,setcolVal]= useState({})

    useEffect(()=>{
      setcolVal({ value: val, label: val })
    },[val])

    const updatecontectTypeValue= () =>{
      let dataTochange = {...data}
      dataTochange.contractType = colval.value
      dataTochange.edited = true
      saveHandler(dataTochange,false)     
    }


    if(isEdit){
      return <div style={{display:'flex',alignItems:'center' }}><div style={{display:'flex' ,flexDirection:'column'}}>
        {/* <Select
      defaultValue={colval}
      style={{ width: 120 }}
      onChange={(val)=>setcolVal(val)}
      options={availability?.map(val=> ({ value: val.value, label: val.value }))}
    /> */}

     <Select
        value={colval}
        defaultValue={colval}
        onChange={(val)=>setcolVal(val)}
        options={availability?.map(val=> ({ value: val.value, label: val.value }))}
      />
      </div> <TickMark
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => updatecontectTypeValue()}
    /></div>
    }else{
      return <p style={{cursor:'pointer', margin:'0'}} onDoubleClick={()=>setIsEdit(true)}>{val}</p>
    }
  }

const columns = useMemo(()=>{
  return [
  {title: 'Months',
dataIndex: 'monthNames',
key: 'monthNames',
align: 'left',
render :(value,data)=>{
  return `${data.monthNames} ( ${data.years} )`
}
},
{title: 'Contract Type',
dataIndex: 'contractType',
key: 'contractType',
align: 'left',
render: (value,data)=>{
  return <CompContractTypeColField  val={value} data={data} />
}},
{title: 'BR',
dataIndex: 'br',
key: 'br',
align: 'left',
render: (value,data)=>{
  return <CompBRColField  val={value} data={data} />
}
},
{title: 'PR',
dataIndex: 'pr',
key: 'pr',
align: 'left',
render: (value,data)=>{
  return <CompPRColField  val={value} data={data} />
}
},
{title: 'NR',
dataIndex: 'nR_DP_Value',
key: 'nR_DP_Value',
align: 'left',
},
{title: 'NR%',
dataIndex: 'actual_NR_Percentage',
key: 'actual_NR_Percentage',
align: 'left',
}
]
},[allBRPRlist]) 

  return (
    <div className={allengagementReplceTalentStyles.engagementModalContainer}>
        <div
            className={`${allengagementReplceTalentStyles.headingContainer} ${allengagementReplceTalentStyles.replaceTalentWrapper}`}>
            <h1> {allBRPRdata?.engagementID} ( {allBRPRdata?.actualBillRate.split(' ')[1]} )</h1>
            <p>
                *Double Click on BR, PR to enable edit
            </p>
        </div>

        <div className={allengagementReplceTalentStyles.firstFeebackTableContainer}>
           {isLoading? <Skeleton /> :<Table 
            // scroll={{ x: '500vw', y: '100vh' }}
            id="allBRPRTable"
            columns={columns}
            bordered={false}
            dataSource={allBRPRlist}
            pagination={false} 
             />} 
        </div>
    </div>
  )
}
