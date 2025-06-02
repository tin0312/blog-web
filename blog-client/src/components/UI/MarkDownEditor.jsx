import React, { useMemo, useRef } from "react";
import '@mdxeditor/editor/style.css'
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CodeToggle,
  InsertCodeBlock,
  codeBlockPlugin,
  listsPlugin,
  linkPlugin,
  ListsToggle,
  linkDialogPlugin,
  CreateLink,
  InsertTable,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  Separator,
  InsertThematicBreak,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import ImageInputDialog from "../UI/ImageInputDialog";

export default function MarkDownEditor({ setPostContent, postContent }) {
  const editorRef = useRef(null);
  const plugins = useMemo(() => [
    listsPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    tablePlugin(),
    imagePlugin({ disableImageSettingsButton: true }),
    codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
    codeMirrorPlugin({
      codeBlockLanguages: { jsx: "JavaScript (react)", js: "JavaScript", css: "CSS", tsx: "TypeScript (react)" },
      autoLoadLanguageSupport: true,
    }),
    diffSourcePlugin({ viewMode: "rich-text" }),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <ConditionalContents
            options={[
              {
                when: (editor) => editor?.editorType === "codeblock",
                contents: () => <ChangeCodeMirrorLanguage />
              },
              {
                fallback: () => (
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                    <ImageInputDialog />
                    <Separator />
                    <InsertTable />
                    <InsertThematicBreak />
                    <Separator />
                    <InsertCodeBlock />
                  </DiffSourceToggleWrapper>
                )
              }
            ]}
          />
        </>
      )
    })
  ], []);

  return (
    <MDXEditor
      ref={editorRef}
      className="text-editor"
      markdown={postContent}
      placeholder="Write your post here..."
      onBlur={() => {
        const editor = editorRef.current;
        if (editor && editor.getMarkdown()) {
          const updatedMarkdown = editor.getMarkdown();
          setPostContent(updatedMarkdown);
        }
      }}
      plugins={plugins}
    />
  );
}
