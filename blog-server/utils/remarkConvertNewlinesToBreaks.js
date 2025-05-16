import { u } from 'unist-builder';

export function remarkEmptyLinesToBreaks() {
  return (tree) => {
    const newChildren = [];
    const blockTypes = new Set([
      'paragraph',
      'heading',
      'list',
      'table',
      'blockquote',
      'code',
      'thematicBreak',
    ]);

    for (let i = 0; i < tree.children.length; i++) {
      const current = tree.children[i];
      const next = tree.children[i + 1];

      newChildren.push(current);

      if (next && blockTypes.has(current.type) && blockTypes.has(next.type)) {
        const emptyLines = (next.position.start.line - current.position.end.line) - 1;

        if (emptyLines > 0) {
          for (let j = 0; j < emptyLines; j++) {
            newChildren.push(u('paragraph', [u('break')]));
          }
        }
      }
    }

    tree.children = newChildren;
  };
}
