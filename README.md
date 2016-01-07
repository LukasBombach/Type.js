<p align="center">
  &nbsp; <!-- booo hack, remove me -->
</p>
<p align="center">
  <img alt="Type JS" src="https://raw.githubusercontent.com/LukasBombach/new-type-js/master/demo/images/logo@2x.png" height="59">
</p>
<p align="center">
  <strong>Write your own WYSIWYG editor with Type.js</strong><br>
</p>
<p align="center">
  <img alt="separator" src="https://raw.githubusercontent.com/LukasBombach/new-type-js/master/demo/images/separator.png" height="59">
</p>

Type.js is a library that provides a simple high-level API that lets you implement your own WYSIWYG editor easily and reliably. Usually WYSIWYG-editors do not match the UI and the use-case of your project and it is a hassle to customize them. This is why Type.js provides all the functionality but leaves the implementation of the UI to you. The API is as simple as jQuery and gives you more possiblities and control than "regular" editors. It is really easy to create an editor that will work stable across browsers and will always create the same simple markup on all devices. As an important sidenote, it does not rely on `contenteditable`, which makes all this possible.

## Status

This project is a rewrite of my [master's thesis](https://github.com/LukasBombach/old-type-js). I am currently rewriting the document model [in a separate branch](https://github.com/LukasBombach/Type.js/tree/document-model). This project is under heavy development and I am aiming to release the first beta this quarter.

Other projects that are interesting right now (because they too avoid `contenteditable`):

* https://github.com/basecamp/trix
* https://github.com/ProseMirror/prosemirror

## Installation

Include `type.min.js` from the `dist` folder on your website. AMD / CommmonJs coming soon.

## Basic usage:

```javascript
// Instantiate Type and pass it an element that will be editable
var el = document.getElementById('editor-contents');
var editor = new Type(el);

// Will format the current selection bold
editor.format('<strong>');

// Will format characters 10 to 20 italic
editor.format('<em>', 10, 20);

// Will select the character 5 to 10
editor.select('<em>', 5, 10);
```

## Building

1. Install node js
2. Run `npm install` from the root directory
3. Run `npm run dist` from the root directory to build a minified file

## License

Type.js is licenced under the [MIT license](https://github.com/LukasBombach/Type.js/blob/master/LICENSE).
