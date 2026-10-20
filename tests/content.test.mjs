import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// Run the actual TypeScript parser in one process; fixtures exercise publication
// boundaries rather than checking that a template contains its own literals.
test('article publication rejects unsafe or ambiguous content and broken coverage', () => {
  execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import {readFileSync} from 'node:fs';
    import {parsePost,loadPosts} from './src/posts.ts';
    const path='content/guides/en/transcribe-social-video-link-iphone.md';
    const source=readFileSync(path,'utf8');
    assert.equal(parsePost(source,path).status,'published');
    for (const invalid of [
      source.replace(/status: .+/, 'status: invalid'),
      source.replace(/publishedAt: .+/, 'publishedAt: 2099-01-01'),
      source.replace(/updatedAt: .+/, 'updatedAt: 2099-01-01'),
      source+'\\n<script>alert(1)</script>',
      source+'\\n[open](javascript:alert(1))',
      source+'\\n![x](data:image/svg+xml,x)',
      source+'\\n# second page title',
    ]) assert.throws(()=>parsePost(invalid,path));
    assert.equal(parsePost(source.replace(/status: .+/, 'status: draft'),path).status,'draft');
    const posts=loadPosts();
    assert.equal(new Set(posts.map(p=>p.locale)).size,11);
    assert.ok(posts.length>=33);
    for(const post of posts) assert.ok(post.related.every(slug=>posts.some(p=>p.locale===post.locale&&p.slug===slug)));
  `], { cwd: process.cwd(), stdio: 'pipe' });
  assert.ok(true);
});
