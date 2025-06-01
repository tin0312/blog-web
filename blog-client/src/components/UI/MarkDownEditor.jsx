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
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import ImageInputDialog from "../UI/ImageInputDialog";

function MarkDownEditor({ setPostContent, postContent }) {
  return <MDXEditor
    // contentEditableClassName="prose"
    className="text-editor"
    markdown={postContent}
    placeholder="Write your post here..."
    onChange={(markdown) => setPostContent(markdown)}
    plugins={[
      listsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      imagePlugin({
        disableImageSettingsButton: true,
    }),     
      codeBlockPlugin({
        defaultCodeBlockLanguage: "js",
      }),
      codeMirrorPlugin({
        codeBlockLanguages: { jsx: "JavaScript (react)", js: "JavaScript", css: "CSS", tsx: "TypeScript (react)" },
        autoLoadLanguageSupport: true,
      }),
      diffSourcePlugin({ viewMode: "rich-text"}),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <ConditionalContents
              options={[
                { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                {
                  fallback: () => (
                    <>
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