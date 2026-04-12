---
layout: post
title: Globbing at the speed of light
---

When writing tools for developers, it's often useful to write scripts that look at many files in a codebase.

The first choice in Javascript might be the [`glob`](https://www.npmjs.com/package/glob) package, but I quickly found out that it was too slow.

[`fast-glob`](https://www.npmjs.com/package/fast-glob) is faster, but [`globby`](https://www.npmjs.com/package/globby) is even better because it supports a `gitignore` option.

Still, globbing in a large repo (~6 million LOC) was taking ~3-4 seconds on my 10-core M3 Macbook.

I discovered a neat trick though: you can use `git ls-files` (and `picomatch`) for _really_ fast globbing.

Here's what this looks like in Node:

```javascript
import { spawn } from 'node:child_process';
import picomatch from 'picomatch';

const isMatch = picomatch(
  '{@types,apps,libs,tools,toolchain/**/*.{ts,tsx,js,jsx}}'
)

const paths = [];
const gitProcess = spawn('git', ['ls-files'], {
  stdio: ['ignore', 'pipe', 'inherit'],
});

let buffer = '';
for await (const chunk of gitProcess.stdout) {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  lines.filter((line) => isMatch(line)).forEach((line) => paths.push(line));
}
if (buffer && isMatch(buffer)) {
  paths.push(buffer);
}
```

With this approach I'm able to get a relevant list of paths in milliseconds as opposed to seconds.
