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
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { Divider, Tag, Tooltip } from 'antd';

const Editor = ({ tagUsers }) => {
	const [isStyleEditor, setStyleEditor] = useState(false);
	const [isShowDropDownList, setShowDropDownList] = useState(false);
	const [tagUserSearch, setTagUserSearch] = useState('');
	const [positionOfSymbol, setPositionOfSymbol] = useState(0);
	const [selectTaggedUser, setSelectTaggedUser] = useState('');
	const tagRef = useRef();
	const commentRef = useRef();
	const tagUserSearchMemo = useMemo(() => {
		if (tagUserSearch) return tagUserSearch;
		else return tagUsers;
	}, [tagUserSearch, tagUsers]);

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
		if (e.shiftKey && e.which === 50) {
			setShowDropDownList(true);
			setPositionOfSymbol(commentRef.current.innerText.length);
			console.log(
				commentRef.current.innerText[commentRef.current.innerText.length],
				'---length',
			);
		} else if (e.which === 8) {
			// setShowDropDownList(false);
			console.log(commentRef.current.innerText.split('@'));
			// tagRef.current.removeChild();
			// if (tagRef) document.getElementById(tagRef).remove();
		}
	};
	// console.log(selectTaggedUser, '-editor');
	return (
		<div className={EditorStyle.activityFeed}>
			{isShowDropDownList ? (
				<div
					style={{
						// position: 'absolute',
						zIndex: '0',
						backgroundColor: `var(--background-color-light)`,
						maxHeight: '300px',
						// height: '300px',
						width: '300px',
						// marginTop: '-300px',
						boxShadow: '-4px 4px 20px rgba(166, 166, 166, 0.4)',
						// top: 0,
						borderRadius: '8px',
						paddingTop: '15px',
						overflow: 'scroll',
					}}>
					{tagUserSearchMemo?.map((item) => (
						<Fragment>
							<div
								onClick={(e) => {
									let tempInnerHTML = commentRef.current.innerHTML.split('');
									let spanTag = `<span id=${item?.Value} contentEditable="false" class=${EditorStyle.personTaggedValue}>
										@${item?.Text} 
									</span>`;
									tempInnerHTML[tempInnerHTML.length - 1] = spanTag;

									document.getElementById('commentBox').innerHTML =
										tempInnerHTML.join('');
									document.getElementById('comment').focus();
									setShowDropDownList(false);
								}}
								key={item?.Value}
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
							<Divider
								style={{
									margin: '5px 0',
								}}
							/>
						</Fragment>
					))}
				</div>
			) : null}
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
								<UnorderedListSVG />
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
											setTagUserSearch(
												userFilter ? userFilter : 'User not found',
											);
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
					style={{
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
	);
};

export default Editor;
