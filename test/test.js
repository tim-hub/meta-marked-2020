const metaMarked = require("../lib/meta-marked.js");
const marked = require("marked");
const tape = require("tape");

tape("meta-marked", function(t) {
  const basicTestText =
    "---\nTitle:   My awesome markdown file\nAuthor:  Me\nScripts:\n    - js/doStuff.js\n    - js/doMoreStuff.js\n...\n\n##Header\nRegular text and stuff goes here. \n\n...\n\n---\n";
  const basicTestMD =
    "\n\n##Header\nRegular text and stuff goes here. \n\n...\n\n---\n";
  const basicResult = metaMarked(basicTestText);

  t.ok(basicResult.meta, "result.meta exists");
  t.ok(basicResult.html, "result.html exists");
  t.ok(basicResult.markdown, "result.markdown exists");

  t.equal(
    basicResult.html,
    marked(basicTestMD),
    "result.html matches the marked output"
  );
  t.deepEqual(
    basicResult.meta,
    {
      Title: "My awesome markdown file",
      Author: "Me",
      Scripts: ["js/doStuff.js", "js/doMoreStuff.js"]
    },
    "result.meta matches the yml output"
  );
  t.equal(
    basicResult.markdown,
    basicTestMD,
    "result.markdown matches the markdown input"
  );

  t.equal(
    metaMarked.noMeta(basicTestMD),
    marked(basicTestMD),
    ".noMeta produces the same output as marked"
  );

  t.equal(metaMarked.lexer, marked.lexer, "inherits from marked");

  const dashTestText = basicTestText.replace("...", "---");
  t.deepEqual(
    basicResult,
    metaMarked(dashTestText),
    "works with dashes as yaml terminators too"
  );

  const testTextWithoutDashes = basicTestText.slice(3, basicTestText.length);
  const basicWithoutDashesResult = metaMarked(testTextWithoutDashes);
  t.ok(basicWithoutDashesResult.meta, "result.meta exists");

  t.deepEqual(
    basicWithoutDashesResult.meta,
    {
      Title: "My awesome markdown file",
      Author: "Me",
      Scripts: ["js/doStuff.js", "js/doMoreStuff.js"]
    },
    "result.meta matches the yml output"
  );

  t.end();
});
