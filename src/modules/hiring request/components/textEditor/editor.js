import { useEffect, useState, useRef, useMemo, Fragment } from 'react';
import EditorStyle from './editor.module.css';
import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
import { ReactComponent as SendSVG } from 'assets/svg/send.svg';
import { ReactComponent as BoldSVG } from 'assets/svg/bold.svg';
import { ReactComponent as ItalicSVG } from 'assets/svg/italic.svg';
import { ReactComponent as UnderlineSVG } from 'assets/svg/underline.svg';
import { ReactComponent as JustifyLeftSVG } from 'assets/svg/justifyLeft.svg';
import { ReactComponent as JustifyRightSVG } from 'assets/svg/justifyRight.svg';
import { ReactComponent as JustifyCenterSVG } from 'assets/svg/justifyCenter.svg';
import { ReactComponent as LinkSVG } from 'assets/svg/link.svg';
import { ReactComponent as UnorderedListSVG } from 'assets/svg/unorderedList.svg';
import { ReactComponent as OrderedListSVG } from 'assets/svg/orderedList.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { message, Tooltip } from 'antd';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useLocation } from 'react-router-dom';

const Editor = ({ tagUsers, hrID, callActivityFeedAPI,saveNote }) => {
	const [isStyleEditor, setStyleEditor] = useState(false);
	const [isShowDropDownList, setShowDropDownList] = useState(false);
	const [tagUserSearch, setTagUserSearch] = useState('');
	const commentRef = useRef();
	const [messageAPI, contextHolder] = message.useMessage();
	const tagUserSearchMemo = useMemo(() => {
		if (tagUserSearch) return tagUserSearch;
		else return tagUsers;
	}, [tagUserSearch, tagUsers]);

	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	useEffect(() => {
		const elements = document.querySelectorAll('#editorBtn');
		elements.forEach((ele) => {
			ele.addEventListener('click', () => {
				let command = ele.getAttribute('data-element');
				document.execCommand(command, false, null);
			});
		});
	});

	const onKeyPressHandler = (e) => {
		let tempString = commentRef.current.innerText;
		if (e.ctrlKey && e.which === 65) {
			setShowDropDownList(false);
		}
		if (tempString.length === 0) setShowDropDownList(false);
		if (e.shiftKey && e.which === 50) {
			setShowDropDownList(true);
		} else if (e.which === 8) {
			if (
				tempString[tempString.length - 1] === '@' ||
				tempString[tempString.length] === 0
			)
				setShowDropDownList(false);
			else if (tempString.length > 0 && tempString.includes('@'))
				setShowDropDownList(true);
			else if (tempString.length > 0 && !tempString.includes('@'))
				setShowDropDownList(false);
		}
	};

	return (
		<>
			{contextHolder}
			{isShowDropDownList ? (
				<div className={EditorStyle.dropUp}>
					{tagUserSearchMemo?.map((item) => (
						<Fragment key={item?.Value}>
							<div
								onClick={() => {
									let tempInnerHTML = commentRef.current.innerHTML.split('@');
									let spanTag = `&nbsp;<span id=${item?.Value} contentEditable="false" class='personTaggedValue'>
										${item?.Text} </span>&nbsp;`;
									tempInnerHTML[tempInnerHTML.length - 1] = spanTag;
									commentRef.current.innerHTML = tempInnerHTML.join('');
									setShowDropDownList(false);
								}}
								className={EditorStyle.dropUpItems}
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
									alignItems: 'center',
									padding: '5px 0',
									gap: '10px',
								}}>
								<img
									src="https://www.w3schools.com/howto/img_avatar.png"
									className={EditorStyle.avatar}
									alt="avatar"
								/>
								{item?.Text}
							</div>
						</Fragment>
					))}
				</div>
			) : null}
			<div className={EditorStyle.activityFeed}>
				{isStyleEditor && (
					<div className={EditorStyle.editor}>
						<div className={EditorStyle.editorBody}>
							<div className={EditorStyle.editorSet1}>
								<button
									className={EditorStyle.editorBoldBtn}
									id="editorBtn"
									type="button"
									data-element="bold">
									<BoldSVG />
								</button>
								<button
									className={EditorStyle.editorItalicBtn}
									id="editorBtn"
									type="button"
									data-element="italic">
									<ItalicSVG />
								</button>
								<button
									className={EditorStyle.editorUnderlineBtn}
									id="editorBtn"
									type="button"
									data-element="underline">
									<UnderlineSVG />
								</button>
							</div>
							<div className={EditorStyle.editorSet2}>
								<button
									className={EditorStyle.editorBoldBtn}
									id="editorBtn"
									type="button"
									data-element="justifyLeft">
									<JustifyLeftSVG />
								</button>
								<button
									className={EditorStyle.editorItalicBtn}
									id="editorBtn"
									type="button"
									data-element="justifyCenter">
									<JustifyCenterSVG />
								</button>
								<button
									className={EditorStyle.editorUnderlineBtn}
									id="editorBtn"
									type="button"
									data-element="justifyRight">
									<JustifyRightSVG />
								</button>
							</div>
							<div className={EditorStyle.editorSet3}>
								<button
									className={EditorStyle.editorBoldBtn}
									id="editorBtn"
									type="button"
									data-element="insertOrderedList">
									<OrderedListSVG />
								</button>
								<button
									className={EditorStyle.editorItalicBtn}
									id="editorBtn"
									type="button"
									data-element="insertUnorderedList">
									<UnorderedListSVG />
								</button>
								<button
									className={EditorStyle.editorUnderlineBtn}
									id="editorBtn"
									type="button"
									data-element="createLink">
									<LinkSVG />
								</button>
							</div>
						</div>
					</div>
				)}

				<div className={EditorStyle.activityFeedBody}>
					<div className={EditorStyle.activityFeedPost}>
						<div className={EditorStyle.activityFeedPostBody}>
							<img
								src="https://www.w3schools.com/howto/img_avatar.png"
								className={EditorStyle.avatar}
								alt="avatar"
							/>

							<div
								ref={commentRef}
								id="commentBox"
								className={EditorStyle.commentBox}
								contentEditable={true}
								placeholder="Comment on this thread by typing here or mention someone with @..."
								onKeyDown={(e) => onKeyPressHandler(e)}
								onInput={
									isShowDropDownList
										? (e) => {
												let text = e.target.innerText.split('@');
												let userFilter = tagUsers.filter((item) => {
													return item.Text.toLowerCase().includes(
														text[text.length - 1].toLowerCase(),
													);
												});

												if (userFilter.length > 0 && userFilter)
													setTagUserSearch(userFilter && userFilter);
												else setShowDropDownList(false);
										  }
										: null
								}
								suppressContentEditableWarning={true}></div>
						</div>
						<div className={EditorStyle.actionItems}>
							{isStyleEditor ? (
								<ArrowDownSVG
									style={{
										height: '50px',
										width: '50px',
										borderRadius: '50%',
										padding: '12px',
										cursor: 'pointer',
										color: `var(--uplers-black)`,
									}}
									onClick={() => setStyleEditor(!isStyleEditor)}
								/>
							) : (
								<Tooltip
									placement="bottom"
									title="Editor Actions">
									<EditSVG
										style={{
											height: '50px',
											width: '50px',
											borderRadius: '50%',
											padding: '12px',
											cursor: 'pointer',
											color: `var(--uplers-black)`,
										}}
										onClick={() => setStyleEditor(!isStyleEditor)}
									/>
								</Tooltip>
							)}
						</div>
					</div>
					<div
						onClick={async () => {
							let editorDetails = {
								id: hrID,
								note: commentRef.current.innerHTML,
							};
							if (commentRef.current.innerText.replace(/\s/g, '').length) {
								if(saveNote){
									saveNote(commentRef.current.innerHTML)
									commentRef.current.innerText = ''
									return
								}
								await hiringRequestDAO.sendHREditorRequestDAO(editorDetails);
								callActivityFeedAPI(urlSplitter?.split('HR')[0]);
								commentRef.current.innerText = '';
							} else {
								messageAPI.open({
									type: 'warning',
									content: 'Please enter the comment and tag someone.',
								});
							}
						}}
						style={{
							top: '0',
							right: '0',
							position: 'absolute',
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'white',
							height: '64px',
							width: '64px',
							borderRadius: '50%',
							border: `1px solid var(--uplers-border-color) `,
							boxShadow: '-4px 4px 20px rgba(166, 166, 166, 0.2)',
						}}>
						<SendSVG style={{ marginLeft: '5px' }} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Editor;
