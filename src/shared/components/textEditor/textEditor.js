import { useEffect, useRef, useState } from 'react';
import TextEditorStyle from './textEditor.module.css';
import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
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
import { Tooltip } from 'antd';

const TextEditor = ({
	label,
	required,
	placeholder,
	register,
	errors,
	validationSchema,
	name,
	setValue,
	watch,
	isControlled,
	controlledValue,
}) => {
	const [showEditor, setShowEditor] = useState(false);
	const commentRef = useRef();
	useEffect(() => {
		const elements = document.querySelectorAll('#editorBtn');
		elements.forEach((ele) => {
			ele.addEventListener('click', () => {
				let command = ele.getAttribute('data-element');
				document.execCommand(command, false, null);
			});
		});
	});

	useEffect(() => {
		if (isControlled){
			document.getElementById(name).innerHTML = controlledValue;
			setValue(name, controlledValue, {
				shouldDirty: true,
			});
		}
	}, [controlledValue, isControlled, name]);

	return (
		<div className={TextEditorStyle.editorContainer}>
			<label
				style={{
					fontSize: '12px',
					marginBottom: '8px',
					display: 'inline-block',
				}}>
				{label}
			</label>
			{required && (
				<span style={{ paddingLeft: '5px', color:'#E03A3A' }}>
					<b>*</b>
				</span>
			)}
			{showEditor && (
				<div className={TextEditorStyle.editor}>
					<div className={TextEditorStyle.editorOptionsBody}>
						<div className={TextEditorStyle.editorSet1}>
							<button
								className={TextEditorStyle.editorBoldBtn}
								id="editorBtn"
								type="button"
								data-element="bold">
								<BoldSVG />
							</button>
							<button
								className={TextEditorStyle.editorItalicBtn}
								id="editorBtn"
								type="button"
								data-element="italic">
								<ItalicSVG />
							</button>
							<button
								className={TextEditorStyle.editorUnderlineBtn}
								id="editorBtn"
								type="button"
								data-element="underline">
								<UnderlineSVG />
							</button>
						</div>
						<div className={TextEditorStyle.editorSet2}>
							<button
								className={TextEditorStyle.editorBoldBtn}
								id="editorBtn"
								type="button"
								data-element="justifyLeft">
								<JustifyLeftSVG />
							</button>
							<button
								className={TextEditorStyle.editorItalicBtn}
								id="editorBtn"
								type="button"
								data-element="justifyCenter">
								<JustifyCenterSVG />
							</button>
							<button
								className={TextEditorStyle.editorUnderlineBtn}
								id="editorBtn"
								type="button"
								data-element="justifyRight">
								<JustifyRightSVG />
							</button>
						</div>
						<div className={TextEditorStyle.editorSet3}>
							<button
								className={TextEditorStyle.editorBoldBtn}
								id="editorBtn"
								type="button"
								data-element="insertOrderedList">
								<OrderedListSVG />
							</button>
							<button
								className={TextEditorStyle.editorItalicBtn}
								id="editorBtn"
								type="button"
								data-element="insertUnorderedList">
								<UnorderedListSVG />
							</button>
							<button
								className={TextEditorStyle.editorUnderlineBtn}
								id="editorBtn"
								type="button"
								data-element="createLink">
								<LinkSVG />
							</button>
						</div>
					</div>
				</div>
			)}

			<div className={TextEditorStyle.editorBody}>
				<div
					{...register(name, {
						required: `please enter the ${label.toLowerCase()}`,
					})}
					ref={commentRef}
					id={name || 'commentBox'}
					className={TextEditorStyle.commentBox}
					contentEditable={true}
					placeholder={placeholder}
					suppressContentEditableWarning={true}
					onInput={(e) => {
						setValue(name, e.currentTarget.innerHTML, {
							shouldDirty: true,
						});
					}}></div>
				<div className={TextEditorStyle.actionItem}>
					{showEditor ? (
						<ArrowDownSVG
							style={{
								height: '50px',
								width: '50px',
								borderRadius: '50%',
								padding: '12px',
								cursor: 'pointer',
								color: `var(--uplers-black)`,
							}}
							onClick={() => setShowEditor(!showEditor)}
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
								onClick={() => setShowEditor(!showEditor)}
							/>
						</Tooltip>
					)}
				</div>
			</div>

			{required
				? errors &&
				  errors[name] && (
						<div className={TextEditorStyle.error}>
							{errors[name]?.message && `* ${errors[name]?.message}`}
						</div>
				  )
				: false}
		</div>
	);
};

export default TextEditor;
