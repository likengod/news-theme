import { getPublicArchiveArticles } from '../src/lib/articles.functions.ts';

async function run() {
  try {
    console.log('Testing getPublicArchiveArticles query...');
    const result = await getPublicArchiveArticles({
      data: {
        page: 1,
        limit: 15
      }
    });
    console.log('Query result success! Items count:', result.items.length);
  } catch (e) {
    console.error('Query failed with error:', e);
  }
}

run();
