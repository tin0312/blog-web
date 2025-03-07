import '@mdxeditor/editor/style.css'
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, listsPlugin, InsertCodeBlock, ListsToggle, Separator } from '@mdxeditor/editor'

function MarkDownEditor({setPostContent, postContent}) {
  return   <MDXEditor
  contentEditableClassName="prose"
  className="text-editor"
  markdown= {postContent}
  placeholder="Write your post here..."
  onChange={(markdown) => setPostContent(markdown)}
  plugins={[
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <UndoRedo />
          <BoldItalicUnderlineToggles />
          <ListsToggle/>
         
        </>
      )
    }),
    listsPlugin()
  ]}
/>
}

export default MarkDownEditor;