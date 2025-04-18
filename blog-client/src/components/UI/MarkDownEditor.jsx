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
import ImageInputDialog from "../UI/ImageInputDialog";

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
      imagePlugin({
        imageUploadHandler: async (file) => {
          const formData = new FormData();
          formData.append("image", file);
      
          const res = await fetch("/uploads/new", {
            method: "POST",
            body: formData,
          });
      
          if (!res.ok) throw new Error("Failed to upload image");
      
          const { url } = await res.json();
          return url;
        },
      }),      
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
                      <ImageInputDialog />
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