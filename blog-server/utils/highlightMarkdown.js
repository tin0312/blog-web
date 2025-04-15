import rehypeStarryNight from 'rehype-starry-night';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { VFile } from 'vfile';
import { unified } from 'unified';
import rehypeRaw from 'rehype-raw';

export async function highlightMarkdown(markdown) {
  try {
    const file = new VFile({ value: markdown });
    const result = await unified()
      .use(remarkParse)           
      .use(remarkRehype,  { allowDangerousHtml: true })             
      .use(rehypeRaw)   
      .use(rehypeStarryNight)      
      .use(rehypeStringify, { allowDangerousHtml: true } )   
      .process(file);
    return result.value;
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw new Error('Failed to highlight markdown');
  }
}
