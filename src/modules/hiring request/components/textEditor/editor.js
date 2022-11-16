import { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdSend } from 'react-icons/io';
import EditorStyle from './editor.module.css';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import { GoListOrdered, GoListUnordered } from 'react-icons/go';
import { Tooltip } from 'antd';
const Editor = () => {
	const [isStyleEditor, setStyleEditor] = useState(false);

	useEffect(() => {
		const elements = document.querySelectorAll('#editorBtn');
		elements.forEach((ele) => {
			ele.addEventListener('click', () => {
				let command = ele.getAttribute('data-element');

				document.execCommand(command, false, null);
			});
		});
	});

	return (
		<div className={EditorStyle.activityFeedPost}>
			<div className={EditorStyle.activityFeedPostBody}>
				<img
					src="https://www.w3schools.com/howto/img_avatar.png"
					className={EditorStyle.avatar}
					alt="avatar"
				/>

				<div
					className={EditorStyle.commentBox}
					contentEditable={true}
					placeholder="Comment on this thread by typing here or mention someone with @..."></div>
				<div className={EditorStyle.actionItems}>
					{isStyleEditor && (
						<div className={EditorStyle.buttonGroup}>
							<button
								id="editorBtn"
								type="button"
								data-element="bold">
								<FaBold />
							</button>
							<button
								id="editorBtn"
								type="button"
								data-element="italic">
								<FaItalic />
							</button>
							<button
								id="editorBtn"
								type="button"
								data-element="underline">
								<FaUnderline />
							</button>
							<button
								id="editorBtn"
								type="button"
								data-element="insertOrderedList">
								<GoListOrdered />
							</button>
							<button
								id="editorBtn"
								type="button"
								data-element="insertUnorderedList">
								<GoListUnordered />
							</button>
						</div>
					)}

					<Tooltip
						placement="bottom"
						title="Editor Actions">
						<AiOutlineEdit
							style={{
								height: '50px',
								width: '50px',
								boxShadow: '-4px 4px 20px rgba(166, 166, 166, 0.4)',
								borderRadius: '50%',
								padding: '12px',
								cursor: 'pointer',
								marginRight: '50px',
								color: `var(--uplers-black)`,
								backgroundColor: `var(--color-sunlight)`,
							}}
							onClick={() => setStyleEditor(!isStyleEditor)}
						/>
					</Tooltip>
					<IoMdSend
						style={{
							fontSize: '30px',
							color: `var(--background-color-ebony)`,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Editor;
