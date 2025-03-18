import '@mdxeditor/editor/style.css'
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CodeToggle,
  InsertCodeBlock,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  ListsToggle,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  InsertTable,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  Separator,
  InsertThematicBreak,
  diffSourcePlugin,
} from "@mdxeditor/editor";

function MarkDownEditor({ setPostContent, postContent }) {
  return <MDXEditor
    contentEditableClassName="prose"
    className="text-editor"
    markdown={postContent}
    placeholder="Write your post here..."
    onChange={(markdown) => setPostContent(markdown)}
    plugins={[
      listsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      imagePlugin(),
      codeBlockPlugin({
        defaultCodeBlockLanguage: "js",
      }),
      codeMirrorPlugin({
        codeBlockLanguages: { jsx: "JavaScript (react)", js: "JavaScript", css: "CSS", tsx: "TypeScript (react)" },
        autoLoadLanguageSupport: true,
      }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <ConditionalContents
              options={[
                { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />
                      <InsertCodeBlock />
                    </>
                  ),
                }
              ]}
            />
          </>
        )
      }),
    ]}
  />
}

export default MarkDownEditor;