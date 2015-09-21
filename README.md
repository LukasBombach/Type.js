
  <img alt="babel" src="https://raw.githubusercontent.com/LukasBombach/new-type-js/master/demo/images/logo@2x.png" height="59">



  Type js is a WYSIWYG library that lets you implement your own wysiwyg editor.

--

Type js is a pure library and does not have a UI.

* It leaves the implementation of the the editor (the UI) to you.
* It provides an easy and high-level API for implementing WYSIWYG editors.
* It provides an extensive API, giving you more possiblities and more control than "regular" editors.
* It creates simple and consistent markup across browsers.
* It does not rely on `contenteditable`

## Status

I am currently rewriting my old project [Type.js](https://github.com/LukasBombach/Type.js). 
This is a 100% WIP right now.

## Installation

Include `type.min.js` from the `dist` folder on your website. AMD / CommmonJs coming soon.

## Basic usage:

```javascript
// Instantiate Type and pass it an element that will be editable
var el = document.getElementById('editor-contents');
var editor = new Type(el);

// Will format characters 10 to 20 as bold
editor.format('<strong>', 10, 20);
```

## Building

1. Install node js
2. Run `npm install` from the root directory
3. Run `npm run dist` from the root directory to build a minified file

## License

Type.js is licenced under the [MIT license](https://github.com/LukasBombach/new-type-js/blob/master/LICENSE).
