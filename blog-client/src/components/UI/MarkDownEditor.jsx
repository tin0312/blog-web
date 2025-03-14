import '@mdxeditor/editor/style.css'
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, listsPlugin, ListsToggle, codeMirrorPlugin, InsertCodeBlock, codeBlockPlugin, ConditionalContents, ChangeCodeMirrorLanguage } from '@mdxeditor/editor'

function MarkDownEditor({ setPostContent, postContent }) {
  return <MDXEditor
    contentEditableClassName="prose"
    className="text-editor"
    markdown={postContent}
    placeholder="Write your post here..."
    onChange={(markdown) => setPostContent(markdown)}
    plugins={[
      codeBlockPlugin({
         defaultCodeBlockLanguage: 'js', 
    }),
      codeMirrorPlugin({
        codeBlockLanguages: { jsx: 'JavaScript (react)', js: 'JavaScript', css: 'CSS', tsx: 'TypeScript (react)' }
      }),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <ListsToggle />
            <ConditionalContents
              options={[
                { when: (editor) => editor?.editorType === 'codeBlock', contents: () => <ChangeCodeMirrorLanguage /> },
                {
                  fallback: () => <InsertCodeBlock />
                }
              ]}
            />
          </>
        )
      }),
      listsPlugin()
    ]}
  />
}

export default MarkDownEditor;