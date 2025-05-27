import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Table, Input, Tooltip, Spin } from 'antd';
import taStyles from './taGoalList.module.css';
import { GrEdit } from 'react-icons/gr';
import { IoIosRemoveCircle } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { TaDashboardDAO } from 'core/taDashboard/taDashboardDRO';
import { HTTPStatusCode } from 'constants/network';

const TAGOALList = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [isEditMode, setEditMode] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [goalList, setGoalList] = useState([]);
	const [selectedGoal, setSelectedGoal] = useState(null);
	const [newTAUserValue, setNewTAUserValue] = useState('');
	const [goalAmount, setGoalAmount] = useState('');
	const [allTAUsersList, setAllTAUsersList] = useState([]);
	const [taError, setTaError] = useState(false);
	const [amountError, setAmountError] = useState(false);
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);
    const [goalToRemove, setGoalToRemove] = useState(null);

	useEffect(() => {
		getTAMonthlyGoal();
        getTAAllMasterData();
	}, []);

    const getTAAllMasterData = async () => {
        let req = await TaDashboardDAO.geAllTAUSERSRequestDAO();
        if (req.statusCode === HTTPStatusCode.OK) {
            setAllTAUsersList(req.responseBody);
        }
    }

	const getTAMonthlyGoal = async () => {
		setLoading(true);		
		const response = await TaDashboardDAO.getTAMonthlyGoalDAO();
		if (response && response.statusCode === 200) {			
			setGoalList(response?.responseBody?.rows);
		}
		setLoading(false);
	};

	const columns = useMemo(() => [
		{
			title: 'TA Name',
			dataIndex: 'ta',
			key: 'ta',
		},
		{
			title: 'Goal Amount',
			dataIndex: 'goalStr',
			key: 'goalStr',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_, record) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<IconContext.Provider
						value={{
							color: '#FFDA30',
							style: { width: '19px', height: '19px', cursor: 'pointer' },
						}}
					>
						<Tooltip title="Edit" placement="top">
							<span
								onClick={() => {
									setEditMode(true);
									setModalVisible(true);
									setSelectedGoal(record);
									setNewTAUserValue(record.tA_ID);
									setGoalAmount(record.goalStr);
								}}
								style={{ padding: '0' }}
							>
								<GrEdit />
							</span>
						</Tooltip>
					</IconContext.Provider>

					<IconContext.Provider
						value={{
							color: 'red',
							style: {
								width: '19px',
								height: '19px',
								marginLeft: '10px',
								cursor: 'pointer',
							},
						}}
					>
						<Tooltip title="Delete" placement="top">
							<span
                                onClick={() => {
                                    setGoalToRemove(record);
                                    setShowConfirmRemove(true);
                                }}
                                style={{ padding: '0' }}
                            >
                                <IoIosRemoveCircle />
                            </span>
						</Tooltip>
					</IconContext.Provider>
				</div>
			),
		},
	], []);

	const handleSave = async () => {
	const isTAInvalid = !newTAUserValue;
	const isAmountInvalid = !goalAmount || parseFloat(goalAmount) <= 0;

	setTaError(isTAInvalid);
	setAmountError(isAmountInvalid);

	if (isTAInvalid || isAmountInvalid) return;

	const payload = {
		ID: isEditMode && selectedGoal ? selectedGoal.id : 0,
		TA_User_ID: newTAUserValue,
		Goal: parseFloat(goalAmount),
	};	
	try {
		setLoading(true);
		const response = await TaDashboardDAO.addOrUpdateTAMonthlyGoalDAO(payload);
		setLoading(false);
		if (response && response.statusCode === HTTPStatusCode.OK) {
			await getTAMonthlyGoal();
			handleCloseModal();
		} else {
			console.error('Failed to add/update TA goal:', response);
		}
	} catch (error) {
		console.error('API error:', error);
	}
	
};


	const handleCloseModal = () => {
		setModalVisible(false);
		setEditMode(false);
		setSelectedGoal(null);
		setNewTAUserValue('');
		setGoalAmount('');
		setTaError(false);
		setAmountError(false);
	};

    const handleDeleteGoal = async () => {
	if (!goalToRemove) return;

	setLoading(true);
	try {
		const response = await TaDashboardDAO.deleteTAMonthlyGoalDAO({
			ID: goalToRemove.id, 
		});

		if (response && response.statusCode === HTTPStatusCode.OK) {
			await getTAMonthlyGoal(); 
			setShowConfirmRemove(false);
			setGoalToRemove(null);
		} else {
			console.error('Failed to delete TA goal:', response);
		}
	} catch (error) {
		console.error('API error:', error);
	}
	setLoading(false);
};


	return (
		<div className={taStyles.taGoalContainer}>
			<div className={taStyles.headerRow}>
				<h2>TA Goal Listing</h2>
				<button
					className={taStyles.btnPrimary}
					onClick={() => {
						setModalVisible(true);
						setEditMode(false);
						setSelectedGoal(null);
						setNewTAUserValue('');
						setGoalAmount('');
					}}
				>
					Add TA Goal
				</button>
			</div>

			{/* <LogoLoader visible={isLoading} /> */}

			<Table
				columns={columns}
				dataSource={goalList}
				rowKey="id"
				pagination={{ pageSize: 10 }}
				loading={isLoading}
			/>

			<Modal
				title={isEditMode ? 'Edit TA Goal' : 'Add TA Goal'}
				open={isModalVisible}
				footer={null}
				onCancel={handleCloseModal}
			>
				<div className="col-12 form-group mb-0">
					<label
						className={`${taStyles.label} ${taError ? taStyles.errorLabel : ''}`}
					>
						Select TA
					</label>
					<Select
						placeholder="Select TA"
						value={newTAUserValue}
						className={taError ? taStyles.selectError : ''}
						style={{ width: '100%' }}
						onChange={(value) => {
							setNewTAUserValue(value);
							setTaError(false);
						}}
						options={allTAUsersList.map((v) => ({
							label: v.data,
							value: v.id,
						}))}
					/>
					{taError && (
						<div style={{ color: 'red', fontSize: '12px' }}>
							Please select a TA.
						</div>
					)}
				</div>

				<div className="col-12 form-group mb-0" style={{ marginTop: '16px' }}>
					<label
						className={`${taStyles.label} ${amountError ? taStyles.errorLabel : ''}`}
					>
						Goal Amount
					</label>
					<input
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						placeholder="Enter goal"
						className={`${taStyles.formcontrol} ${amountError ? taStyles.inputError : ''}`}
						value={goalAmount}
						onChange={(e) => {
							const numericValue = e.target.value.replace(/\D/g, ''); // Allow only digits
							setGoalAmount(numericValue);
							setAmountError(false);
						}}
						onPaste={(e) => {
						const pasted = e.clipboardData.getData('Text');
						if (!/^\d+$/.test(pasted)) {
							e.preventDefault();
						}
						}}
						/>
					{amountError && (
						<div style={{ color: 'red', fontSize: '12px' }}>
							Please enter a valid goal.
						</div>
					)}
				</div>

				<div
					style={{
						marginTop: '20px',
						display: 'flex',
						justifyContent: 'flex-end',
						gap: '10px',
					}}
				>
					<button className={taStyles.btnPrimary} onClick={handleSave}>
						{isLoading ? <Spin size="small"/> : 'Save'}
					</button>
					<button className={taStyles.btnCancle} onClick={handleCloseModal} disabled={isLoading}>
						Cancel
					</button>
				</div>
			</Modal>

            {showConfirmRemove && (
                <Modal
                    transitionName=""
                    width="500px"
                    centered
                    footer={null}
                    open={showConfirmRemove}
                    className="engagementModalStyle"
                    onCancel={() => setShowConfirmRemove(false)}
                >
                    <div style={{ padding: '35px 15px 10px 15px' }}>
                        <h3>
                            Are you sure you want to remove{' '}
                            <strong>{goalToRemove?.ta}</strong> from the goal list?
                        </h3>
                    </div>

                    <div
                        style={{
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                        }}
                    >
                        <button
                            className={taStyles.btnPrimary}
                            onClick={handleDeleteGoal}
                        >
                            Yes, Remove
                        </button>
                        <button
                            className={taStyles.btnCancle}
                            onClick={() => {
                                setShowConfirmRemove(false);
                                setGoalToRemove(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

		</div>
	);
};

export default TAGOALList;
