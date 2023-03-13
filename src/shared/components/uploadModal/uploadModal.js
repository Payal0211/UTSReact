import { Divider, Modal, message } from 'antd';
import { InputType } from 'constants/application';
import React, { useEffect, useState, useRef } from 'react';
import { ReactComponent as CloudUploadSVG } from 'assets/svg/cloudUpload.svg';
import { ReactComponent as FolderSVG } from 'assets/svg/folder.svg';
import useDrivePicker from 'react-google-drive-picker'
import UploadModalStyle from './uploadModal.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { Form } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';
const UploadModal = ({
	isFooter,
	openModal,
	cancelModal,
	fileUploadType,
	footer,
	modalTitle,
	setValidation,
	getValidation,
	getGoogleDriveLink,
	setGoogleDriveLink,
	setUploadModal
}) => {

	const uploadFile = useRef(null)
	const [openPicker, authResponse] = useDrivePicker();

	const uploadFileValidator = async (fileData) => {
		if ((fileData?.type !== "application/pdf") && (fileData?.type !== "application/docs") && (fileData?.type !== "application/msword") && (fileData?.type !== "text/plain") && (fileData?.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") && (fileData?.type !== "image/png") && (fileData?.type !== "image/jpeg")) {
			setValidation({
				...getValidation,
				systemFileUpload: 'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
			})
		}
		else if (fileData?.size >= 500000) {
			setValidation({
				...getValidation,
				systemFileUpload: 'Upload file size more than 500kb, Please Upload file upto 500kb',
			})
		}
		else {
			let formData = new FormData();
			formData.append('File', fileData);
			let uploadFileResponse = await hiringRequestDAO.uploadFileDAO(formData);
			if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
				setUploadModal(false);
				setValidation({
					...getValidation,
					systemFileUpload: '',
				})
				message('File Uploaded Successfully')
			}
		}
		uploadFile.current.value = '';
	}

	const uploadFileFromGoogleDriveValidator = async (fileData) => {
		setValidation({
			...getValidation,
			googleDriveFileUpload: '',

		})
		if ((fileData[0]?.mimeType !== "application/vnd.google-apps.document") && (fileData[0]?.mimeType !== "application/pdf") && (fileData[0]?.mimeType !== "text/plain") && (fileData[0]?.mimeType !== "application/docs") && (fileData[0]?.mimeType !== "application/msword") && (fileData[0]?.mimeType !== "image/png") && (fileData[0]?.mimeType !== "image/jpeg") && (fileData[0]?.mimeType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
			setValidation({
				...getValidation,
				googleDriveFileUpload: 'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',

			})
		}
		else if (fileData[0]?.sizeBytes >= 500000) {
			setValidation({
				...getValidation,
				googleDriveFileUpload: 'Upload file size more than 500kb, Please Upload file upto 500kb',

			})
		}
		else {
			let fileType;
			let fileName;
			if (fileData[0]?.mimeType === "application/vnd.google-apps.document") {
				fileType = "docs"
				fileName = `${fileData[0]?.name}.${fileType}`
			}
			else {
				fileName = `${fileData[0]?.name}`
			}
			const formData = {
				fileID: fileData[0]?.id,
				FileName: fileName,
			}
			let uploadFileResponse = await hiringRequestDAO.uploadGoogleDriveFileDAO(formData);

			if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
				setUploadModal(false);
				message('File uploaded successfully')

			}
		}
	}

	const googleDriveFileUploader = () => {
		openPicker({
			clientId: "643188410943-pqbg632ja9hji6qoia62p5bnjanir9t9.apps.googleusercontent.com",
			developerKey: "AIzaSyCW6lF0-A6JCVWjOJRVlwN4F1OA3zaOwJw",
			viewId: "DOCS",
			// token: token, // pass oauth token in case you already have one
			showUploadView: true,
			showUploadFolders: true,
			supportDrives: true,
			multiselect: true,
			// customViews: customViewsArray, // custom view
			callbackFunction: (data) => {
				if (data?.action === 'cancel') {
				}
				else {
					data?.docs && uploadFileFromGoogleDriveValidator(data?.docs)
				}
			},
		})
	}

	const uploadFileFromGoogleDriveLink = async () => {
		setValidation({
			...getValidation,
			linkValidation: '',
		})
		if (!getGoogleDriveLink) {
			setValidation({
				...getValidation,
				linkValidation: 'Please enter google docs url',
			})
		}
		else if (!(/https:\/\/docs\.google\.com\/document\/d\/(.*?)\/.*?\?/g.test(getGoogleDriveLink))) {
			setValidation({
				...getValidation,
				linkValidation: 'Please enter valid google docs url',
			})
		}
		else {
			let uploadFileResponse = await hiringRequestDAO.uploadFileFromGoogleDriveLinkDAO(getGoogleDriveLink);
			if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
				setUploadModal(false);
				setGoogleDriveLink("")
				message('File uploaded successfully')
			}
		}
	}

	return (
		<Modal
			width="864px"
			centered
			footer={isFooter}
			open={openModal}
			onCancel={cancelModal}>
			<h1 className={UploadModalStyle.modalTitle}>{modalTitle}</h1>
			<p className={UploadModalStyle.modalUploadType}>
				File should be (JPG, PNG, SVG)
			</p>
			<Divider style={{ borderTop: '1px solid #E8E8E8' }} />
			<div className={UploadModalStyle.uploadBox}>
				<span>
					<input
						style={{ height: '10vh', background: 'red' }}
						type={InputType.FILE}
						ref={uploadFile}
						id="modalFile"
						name="modalFileUpload"
						onChange={(e) => {
							uploadFileValidator(e.target.files[0])
						}}
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
				<span style={{ color: 'red' }}>{getValidation?.systemFileUpload}</span>
				<span style={{ margin: '16px 0' }}>Or,</span>

				{/* <button onClick={() => handleOpenPicker()}>Open Picker</button> */}
				<div className={UploadModalStyle.cloudUploadLink} onClick={() => googleDriveFileUploader()}>
					<CloudUploadSVG />
					Upload From Google Drive
				</div>
				<div className={UploadModalStyle.maxFileSize}>
					Max. File Size: 500 KB
				</div>
				<span style={{ color: 'red' }}>{getValidation?.googleDriveFileUpload}</span>
			</div>

			{footer && (
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
							onChange={(e) => setGoogleDriveLink((e.target.value).trim())}
							value={getGoogleDriveLink}
						/>
						<label className={UploadModalStyle.linkError}>{getValidation?.linkValidation}</label>
						<button
							type="button"
							className={UploadModalStyle.btnPrimary}>
							Add
						</button>
					</div>
				</>
			)}

		</Modal>
	);
};

export default UploadModal;
