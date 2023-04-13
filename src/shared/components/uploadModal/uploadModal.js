import { Divider, Modal, Progress, Spin, message } from 'antd';
import { InputType } from 'constants/application';
import React, { useCallback, useEffect, useRef } from 'react';
import { ReactComponent as CloudUploadSVG } from 'assets/svg/cloudUpload.svg';
import { ReactComponent as FolderSVG } from 'assets/svg/folder.svg';
import useDrivePicker from 'react-google-drive-picker';
import UploadModalStyle from './uploadModal.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { LoadingOutlined } from '@ant-design/icons';
import { ReactComponent as CrossSVG } from 'assets/svg/cross.svg';
const antIcon = (
	<LoadingOutlined
		style={{
			fontSize: 50,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			marginLeft: '350px',
			fontWeight: 500,
			color: `var(--uplers-black)`,
		}}
		spin
	/>
);

const UploadModal = ({
	isLoading,
	isFooter,
	openModal,
	cancelModal,
	fileUploadType,
	footer,
	modalTitle,
	isGoogleDriveUpload,
	setValidation,
	getValidation,
	getGoogleDriveLink,
	setGoogleDriveLink,
	setUploadModal,
	// uploadFileRef,
	uploadFileHandler,
	googleDriveFileUploader,
	uploadFileFromGoogleDriveLink,
	modalSubtitle,
}) => {
	const uploadFileRef = useRef(null);

	useEffect(() => {
		return () => {
			if (!openModal) uploadFileRef.current = null;
		};
	}, [openModal]);
	return (
		<Modal
			width="864px"
			centered
			footer={isFooter}
			open={openModal}
			onCancel={cancelModal}>
			<h1 className={UploadModalStyle.modalTitle}>{modalTitle}</h1>
			<p className={UploadModalStyle.modalUploadType}>
				{modalSubtitle || 'File should be (JPG, PNG, SVG)'}
			</p>
			<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
			{isLoading ? (
				<Spin indicator={antIcon} />
			) : (
				<>
					<div className={UploadModalStyle.uploadBox}>
						<span>
							<input
								style={{ height: '10vh', background: 'red' }}
								type={InputType.FILE}
								ref={uploadFileRef}
								id="modalFile"
								name="modalFileUpload"
								onChange={uploadFileHandler}
							/>

							<label
								htmlFor="modalFile"
								style={{ cursor: 'pointer' }}>
								<center>
									<FolderSVG />
								</center>
								<div
									style={{
										fontSize: '14px',
										fontWeight: '500',
										lineHeight: '17px',
										color: `var(--uplers-black)`,
										marginTop: '8px',
									}}>
									Browse My Device to Upload File
								</div>
							</label>
						</span>
						<span style={{ color: 'red' }}>
							{getValidation?.systemFileUpload}
						</span>
						{isGoogleDriveUpload && (
							<>
								<span style={{ margin: '16px 0' }}>Or,</span>

								<div
									className={UploadModalStyle.cloudUploadLink}
									onClick={googleDriveFileUploader}>
									<CloudUploadSVG />
									Upload From Google Drive
								</div>
								<div className={UploadModalStyle.maxFileSize}>
									Max. File Size: 500 KB
								</div>
								<span style={{ color: 'red' }}>
									{getValidation?.googleDriveFileUpload}
								</span>
							</>
						)}
					</div>

					{isFooter && (
						<>
							<center>
								<p
									style={{
										fontSize: '14px',
										fontWeight: '400',
										lineHeight: '18px',
									}}>
									Or,
								</p>
							</center>
							<span className={UploadModalStyle.suggestionText}>
								You can also upload the file using Google Drive Link
							</span>
							<div className={UploadModalStyle.urlBox}>
								<input
									className={UploadModalStyle.uploadURLBox}
									type={InputType.TEXT}
									placeholder="Paste URL here"
									onChange={(e) => setGoogleDriveLink(e.target.value.trim())}
									value={getGoogleDriveLink}
								/>
								<label className={UploadModalStyle.linkError}>
									{getValidation?.linkValidation}
								</label>
								<button
									onClick={uploadFileFromGoogleDriveLink}
									type="button"
									className={UploadModalStyle.btnPrimary}>
									Add
								</button>
							</div>
						</>
					)}
					{/* <div className={UploadModalStyle.progressBox}>
						<div className={UploadModalStyle.progressBoxBody}>
							<Progress
								className={UploadModalStyle.progress}
								percent={99.9}
								status="active"
								strokeColor={{ from: '#108ee9', to: '#87d068' }}
							/>
							<CrossSVG />
						</div>
					</div> */}
				</>
			)}
		</Modal>
	);
};

export default UploadModal;
