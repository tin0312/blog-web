import '@mdxeditor/editor/style.css'
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, listsPlugin, InsertCodeBlock, ListsToggle, Separator } from '@mdxeditor/editor'

function MarkDownEditor() {
  return   <MDXEditor
  className="text-editor"
  markdown=""
  plugins={[
    toolbarPlugin({
      toolbarClassName: 'my-classname',
      toolbarContents: () => (
        <>
          {' '}
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