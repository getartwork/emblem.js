// Generated by CoffeeScript 1.4.0
var CompilerContext, Emblem, Handlebars, assert, compileWithPartials, equal, equals, ok, shouldCompileTo, shouldCompileToString, shouldCompileToWithPartials, shouldThrow, throws, _equal,
  __hasProp = {}.hasOwnProperty;

if (!((typeof Handlebars !== "undefined" && Handlebars !== null) && (typeof Emblem !== "undefined" && Emblem !== null))) {
  Emblem = require('../lib/emblem');
  Handlebars = require('handlebars');
  assert = require("assert");
  equal = assert.equal, equals = assert.equals, ok = assert.ok, throws = assert.throws;
} else {
  _equal = equal;
  equals = equal = function(a, b, msg) {
    return _equal(a, b, msg || '');
  };
}

if (typeof CompilerContext === "undefined" || CompilerContext === null) {
  CompilerContext = {
    compile: function(template, options) {
      var templateSpec;
      templateSpec = Emblem.precompile(template, options);
      return Handlebars.template(eval("(" + templateSpec + ")"));
    }
  };
}

shouldCompileToString = function(string, hashOrArray, expected) {
  if (hashOrArray.constructor === String) {
    return shouldCompileToWithPartials(string, {}, false, hashOrArray, null, true);
  } else {
    return shouldCompileToWithPartials(string, hashOrArray, false, expected, null, true);
  }
};

shouldCompileTo = function(string, hashOrArray, expected, message) {
  if (hashOrArray.constructor === String) {
    return shouldCompileToWithPartials(string, {}, false, hashOrArray, message);
  } else {
    return shouldCompileToWithPartials(string, hashOrArray, false, expected, message);
  }
};

shouldCompileToWithPartials = function(string, hashOrArray, partials, expected, message, strings) {
  var options, result;
  options = null;
  if (strings) {
    options = {};
    options.stringParams = true;
  }
  result = compileWithPartials(string, hashOrArray, partials, options);
  return equal(expected, result, "'" + expected + "' should === '" + result + "': " + message);
};

compileWithPartials = function(string, hashOrArray, partials, options) {
  var ary, helpers, prop, template;
  if (options == null) {
    options = {};
  }
  template = CompilerContext.compile(string, options);
  if (Object.prototype.toString.call(hashOrArray) === "[object Array]") {
    if (helpers = hashOrArray[1]) {
      for (prop in Handlebars.helpers) {
        helpers[prop] = helpers[prop] || Handlebars.helpers[prop];
      }
    }
    ary = [];
    ary.push(hashOrArray[0]);
    ary.push({
      helpers: hashOrArray[1],
      partials: hashOrArray[2]
    });
  } else {
    ary = [hashOrArray];
  }
  return template.apply(this, ary);
};

shouldThrow = function(fn, exception, message) {
  var caught, exMessage, exType;
  caught = false;
  if (exception instanceof Array) {
    exType = exception[0];
    exMessage = exception[1];
  } else if (typeof exception === 'string') {
    exType = Error;
    exMessage = exception;
  } else {
    exType = exception;
  }
  try {
    fn();
  } catch (e) {
    if (!exType) {
      caught = true;
    } else {
      if (e instanceof exType) {
        if (!exMessage || e.message === exMessage) {
          caught = true;
        }
      }
    }
  }
  return ok(caught, message || null);
};

suite("html one-liners");

test("element only", function() {
  return shouldCompileTo("p", "<p></p>");
});

test("with text", function() {
  return shouldCompileTo("p Hello", "<p>Hello</p>");
});

test("with more complex text", function() {
  return shouldCompileTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>");
});

test("with trailing space", function() {
  return shouldCompileTo("p Hello   ", "<p>Hello   </p>");
});

suite("text lines");

test("basic", function() {
  return shouldCompileTo("| What what", "What what");
});

test("with html", function() {
  return shouldCompileTo('| What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork";
  return shouldCompileTo(emblem, "BlorkSnork");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = "| Blork \n  Snork";
  return shouldCompileTo(emblem, "Blork Snork");
});

test("multiline with empty first line", function() {
  var emblem;
  emblem = "| \n  Good";
  return shouldCompileTo(emblem, "Good");
});

test("with a mustache", function() {
  var emblem;
  emblem = "| Bork {{foo}}!";
  return shouldCompileTo(emblem, {
    foo: "YEAH"
  }, 'Bork YEAH!');
});

test("with mustaches", function() {
  var emblem;
  emblem = "| Bork {{foo}} {{{bar}}}!";
  return shouldCompileTo(emblem, {
    foo: "YEAH",
    bar: "<span>NO</span>"
  }, 'Bork YEAH <span>NO</span>!');
});

suite("preprocessor");

test("it strips out preceding whitespace", function() {
  var emblem;
  emblem = "\np Hello";
  return shouldCompileTo(emblem, "<p>Hello</p>");
});

test("it handles preceding indentation", function() {
  var emblem;
  emblem = "  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines", function() {
  var emblem;
  emblem = "\n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines pt 2", function() {
  var emblem;
  emblem = "  \n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

suite("comments");

test("it strips out single line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments without text on the first line", function() {
  var emblem;
  emblem = "p Hello\n\n/ \n  A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

suite("indentation");

test("it throws when indenting after a line with inline content", function() {
  var emblem;
  emblem = "p Hello\n  p invalid";
  return shouldThrow(function() {
    return CompilerContext.compile(emblem);
  });
});

test("it throws on half dedent", function() {
  var emblem;
  emblem = "p\n    span This is ok\n  span This aint";
  return shouldThrow(function() {
    return CompilerContext.compile(emblem);
  });
});

suite("attribute shorthand");

test("id shorthand", function() {
  shouldCompileTo("#woot", '<div id="woot"></div>');
  return shouldCompileTo("span#woot", '<span id="woot"></span>');
});

test("class shorthand", function() {
  shouldCompileTo(".woot", '<div class="woot"></div>');
  shouldCompileTo("span.woot", '<span class="woot"></span>');
  return shouldCompileTo("span.woot.loot", '<span class="woot loot"></span>');
});

suite("full attributes - tags without content");

test("class only", function() {
  return shouldCompileTo('p class="yes"', '<p class="yes"></p>');
});

test("id only", function() {
  return shouldCompileTo('p id="yes"', '<p id="yes"></p>');
});

test("class and i", function() {
  return shouldCompileTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

suite("full attributes - tags with content");

test("class only", function() {
  return shouldCompileTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

test("id only", function() {
  return shouldCompileTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

test("class and id", function() {
  return shouldCompileTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

test("class and id and embedded html one-liner", function() {
  return shouldCompileTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

test("nesting", function() {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  return shouldCompileTo(emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>');
});

suite("html nested");

test("basic", function() {
  var emblem;
  emblem = "p\n  span Hello\n  strong Hi\ndiv\n  p Hooray";
  return shouldCompileTo(emblem, '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
});

test("empty nest", function() {
  var emblem;
  emblem = "p\n  span\n    strong\n      i";
  return shouldCompileTo(emblem, '<p><span><strong><i></i></strong></span></p>');
});

test("empty nest w/ attribute shorthand", function() {
  var emblem;
  emblem = "p.woo\n  span#yes\n    strong.no.yes\n      i";
  return shouldCompileTo(emblem, '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
});

suite("simple mustache");

test("various one-liners", function() {
  var emblem;
  emblem = "= foo\narf\np = foo\nspan.foo\np data-foo=\"yes\" = goo";
  return shouldCompileTo(emblem, {
    foo: "ASD",
    arf: "QWE",
    goo: "WER"
  }, 'ASDQWE<p>ASD</p><span class="foo"></span><p data-foo="yes">WER</p>');
});

test("double =='s un-escape", function() {
  var emblem;
  emblem = "== foo\nfoo\np == foo";
  return shouldCompileTo(emblem, {
    foo: '<span>123</span>'
  }, '<span>123</span>&lt;span&gt;123&lt;/span&gt;<p><span>123</span></p>');
});

test("nested combo syntax", function() {
  var emblem;
  emblem = "ul = each items\n  li = foo";
  return shouldCompileTo(emblem, {
    items: [
      {
        foo: "YEAH"
      }, {
        foo: "BOI"
      }
    ]
  }, '<ul><li>YEAH</li><li>BOI</li></ul>');
});

suite("mustache helpers");

Handlebars.registerHelper('ahelper', function(param) {
  return "HELPED " + param;
});

Handlebars.registerHelper('frank', function() {
  var options;
  options = arguments[arguments.length - 1];
  return "WOO: " + options.hash.text + " " + options.hash.text2;
});

Handlebars.registerHelper('sally', function() {
  var content, options, param, params;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  param = params[0] || 'none';
  if (options.fn) {
    content = options.fn(this);
    return new Handlebars.SafeString("<sally class=\"" + param + "\">" + content + "</sally>");
  } else {
    content = param;
    return new Handlebars.SafeString("<sally class=\"" + param + "\">" + content + "</sally>");
  }
});

test("basic", function() {
  return shouldCompileTo('ahelper foo', {
    foo: "YES"
  }, 'HELPED YES');
});

test("hashed parameters should work", function() {
  return shouldCompileTo('frank text="YES" text2="NO"', 'WOO: YES NO');
});

test("nesting", function() {
  var emblem;
  emblem = "sally\n  p Hello";
  return shouldCompileTo(emblem, '<sally class="none"><p>Hello</p></sally>');
});

test("recursive nesting", function() {
  var emblem;
  emblem = "sally\n  sally\n    p Hello";
  return shouldCompileTo(emblem, '<sally class="none"><sally class="none"><p>Hello</p></sally></sally>');
});

test("recursive nesting pt 2", function() {
  var emblem;
  emblem = "sally\n  sally thing\n    p Hello";
  return shouldCompileTo(emblem, {
    thing: "woot"
  }, '<sally class="none"><sally class="woot"><p>Hello</p></sally></sally>');
});

Handlebars.registerHelper('view', function(param, a, b, c) {
  var content, options;
  options = arguments[arguments.length - 1];
  content = param;
  if (options.fn) {
    content = options.fn(this);
  }
  return new Handlebars.SafeString("<view class=\"" + param + "\">" + content + "</view>");
});

suite("capitalized line-starter");

test("should invoke `view` helper by default", function() {
  var emblem;
  emblem = "SomeView";
  return shouldCompileToString(emblem, '<view class="SomeView">SomeView</view>');
});

test("should support block mode", function() {
  var emblem;
  emblem = "SomeView\n  p View content";
  return shouldCompileToString(emblem, '<view class="SomeView"><p>View content</p></view>');
});

test("should not kick in if preceded by equal sign", function() {
  var emblem;
  emblem = "= SomeView";
  return shouldCompileTo(emblem, {
    SomeView: 'erp'
  }, 'erp');
});

test("should not kick in explicit {{mustache}}", function() {
  var emblem;
  emblem = "p Yeah {{SomeView}}";
  return shouldCompileTo(emblem, {
    SomeView: 'erp'
  }, '<p>Yeah erp</p>');
});

suite("bang syntax defaults to `unbound` helper syntax");

Handlebars.registerHelper('unbound', function() {
  var content, options, params, stringedParams;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  stringedParams = params.join(' ');
  content = options.fn ? options.fn(this) : stringedParams;
  return new Handlebars.SafeString("<unbound class=\"" + stringedParams + "\">" + content + "</unbound>");
});

test("bang helper defaults to `unbound` invocation", function() {
  var emblem;
  emblem = "foo! Yar\n= foo!";
  return shouldCompileToString(emblem, '<unbound class="foo Yar">foo Yar</unbound><unbound class="foo">foo</unbound>');
});

test("bang helper works with blocks", function() {
  var emblem;
  emblem = "hey! you suck\n  = foo!";
  return shouldCompileToString(emblem, '<unbound class="hey you suck"><unbound class="foo">foo</unbound></unbound>');
});

suite("question mark syntax defaults to `if` helper syntax");

test("? helper defaults to `if` invocation", function() {
  var emblem;
  emblem = "foo?\n  p Yeah";
  return shouldCompileTo(emblem, {
    foo: true
  }, '<p>Yeah</p>');
});

test("else works", function() {
  var emblem;
  emblem = "foo?\n  p Yeah\nelse\n  p No";
  return shouldCompileTo(emblem, {
    foo: false
  }, '<p>No</p>');
});

test("compound", function() {
  var emblem;
  emblem = "p = foo? \n  | Hooray\nelse\n  | No\np = bar? \n  | Hooray\nelse\n  | No";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, '<p>Hooray</p><p>No</p>');
});

test("compound", function() {
  var emblem;
  emblem = "p = foo? \n  bar\nelse\n  baz";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: "borf",
    baz: "narsty"
  }, '<p>borf</p>');
});

suite("conditionals");

test("simple if statement", function() {
  var emblem;
  emblem = "if foo\n  | Foo\nif bar\n  | Bar";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'Foo');
});

test("if else ", function() {
  var emblem;
  emblem = "if foo\n  | Foo\n  if bar\n    | Bar\n  else\n    | Woot\nelse\n  | WRONG\nif bar\n  | WRONG\nelse\n  | Hooray";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'FooWootHooray');
});

test("unless", function() {
  var emblem;
  emblem = "unless bar\n  | Foo\n  unless foo\n    | Bar\n  else\n    | Woot\nelse\n  | WRONG\nunless foo\n  | WRONG\nelse\n  | Hooray";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'FooWootHooray');
});

Handlebars.registerHelper('bindAttr', function() {
  var bindingString, k, options, param, params, v, _ref;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  bindingString = "";
  _ref = options.hash;
  for (k in _ref) {
    if (!__hasProp.call(_ref, k)) continue;
    v = _ref[k];
    bindingString += " " + k + " to " + v;
  }
  if (!bindingString) {
    bindingString = " narf";
  }
  param = params[0] || 'none';
  return "bindAttr" + bindingString;
});

suite("bindAttr behavior for unquoted attribute values");

test("basic", function() {
  return shouldCompileTo('p class=foo', '<p bindAttr class to foo></p>');
});

test("multiple", function() {
  return shouldCompileTo('p class=foo id="yup" data-thinger=yeah Hooray', '<p bindAttr class to foo id="yup" bindAttr data-thinger to yeah>Hooray</p>');
});

test("class bindAttr special syntax", function() {
  return shouldCompileTo('p class=foo:bar:baz', '<p bindAttr class to foo:bar:baz></p>');
});

suite("in-tag explicit mustache");

Handlebars.registerHelper('inTagHelper', function(p) {
  return p;
});

test("single", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

test("double", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

test("triple", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

Handlebars.registerHelper('insertClass', function(p) {
  return 'class="' + p + '"';
});

test("with singlestache", function() {
  return shouldCompileTo('p{insertClass foo} Hello', {
    foo: "yar"
  }, '<p class=&quot;yar&quot;>Hello</p>');
});

test("with doublestache", function() {
  return shouldCompileTo('p{{insertClass foo}} Hello', {
    foo: "yar"
  }, '<p class=&quot;yar&quot;>Hello</p>');
});

test("with triplestache", function() {
  return shouldCompileTo('p{{{insertClass foo}}} Hello', {
    foo: "yar"
  }, '<p class="yar">Hello</p>');
});

test("multiple", function() {
  return shouldCompileTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', {
    foo: "yar",
    boo: "nar"
  }, '<p class="yar" class="nar">Hello</p>');
});

test("with nesting", function() {
  var emblem;
  emblem = "p{{bindAttr class=\"foo\"}}\n  span Hello";
  return shouldCompileTo(emblem, {
    foo: "yar"
  }, '<p bindAttr class to foo><span>Hello</span></p>');
});

suite("actions");

Handlebars.registerHelper('action', function() {
  var hashString, k, options, params, paramsString, v, _ref;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  hashString = "";
  paramsString = params.join('|');
  _ref = options.hash;
  for (k in _ref) {
    if (!__hasProp.call(_ref, k)) continue;
    v = _ref[k];
    hashString += " " + k + "=" + v;
  }
  if (!hashString) {
    hashString = " nohash";
  }
  return "action " + paramsString + hashString;
});

test("basic (click)", function() {
  var emblem;
  emblem = "button click=\"submitComment\" Submit Comment";
  return shouldCompileToString(emblem, '<button action submitComment on=click>Submit Comment</button>');
});

test("nested (mouseEnter)", function() {
  var emblem;
  emblem = "a mouseEnter='submitComment target=\"view\"'\n  | Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>');
});

test("nested (mouseEnter, doublequoted)", function() {
  var emblem;
  emblem = "a mouseEnter=\"submitComment target='view'\"\n  | Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>');
});

test("manual", function() {
  var emblem;
  emblem = "a{action submitComment target=\"view\"} Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view>Submit Comment</a>');
});

test("manual nested", function() {
  var emblem;
  emblem = "a{action submitComment target=\"view\"}\n  p Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view><p>Submit Comment</p></a>');
});

suite("misc.");

test("Emblem has a VERSION defined", function() {
  return ok(Emblem.VERSION, "Emblem.VERSION should be defined");
});
