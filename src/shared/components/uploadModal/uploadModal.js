import { Divider, Modal } from 'antd';
import { InputType } from 'constants/application';
import React from 'react';
import { ReactComponent as CloudUploadSVG } from 'assets/svg/cloudUpload.svg';
import { ReactComponent as FolderSVG } from 'assets/svg/folder.svg';

import UploadModalStyle from './uploadModal.module.css';
const UploadModal = ({
	isFooter,
	openModal,
	cancelModal,
	fileUploadType,
	footer,
	modalTitle,
}) => {
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
						id="modalFile"
						name="modalFileUpload"
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
				<span style={{ margin: '16px 0' }}>Or,</span>
				<div className={UploadModalStyle.cloudUploadLink}>
					<CloudUploadSVG />
					Upload From Google Drive
				</div>
				<div className={UploadModalStyle.maxFileSize}>
					Max. File Size: 25 MB
				</div>
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
						/>
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
