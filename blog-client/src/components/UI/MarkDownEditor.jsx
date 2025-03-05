// import "@toast-ui/editor/dist/toastui-editor.css";
// import { Editor } from "@toast-ui/react-editor";
// import React, { createRef } from "react";

// export default function MarkDownEditor({setPostContent, content}) {
//     const editorRef = createRef();
//     function handleSavePostContent() {
//         setPostContent(editorRef.current?.getInstance().getMarkdown())
//         const placeholdElem = editorRef.current?.getInstance().getEditorElements().mdEditor.children[1];
//         placeholdElem.classList.remove("opacity-50");
      
//     }
//     function hanldePlaceholderText(){
//         const placeholderElem = editorRef.current?.getInstance().getEditorElements().mdEditor.children[1];
//         placeholderElem.classList.add("opacity-50", "fs-5");
//     }

//     return (
//         <Editor
//             onFocus={hanldePlaceholderText}
//             onChange={handleSavePostContent}
//             previewStyle="tab"
//             height="55vh"
//             initialEditType="markdown"
//             ref={editorRef}
//             hideModeSwitch={true}
//             initialValue= {`${content ? content : " Write your post content here..."}`}
//         />
//     );
// }
