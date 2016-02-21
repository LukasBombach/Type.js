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

<p align="center"
<a href="https://david-dm.org/LukasBombach/Type.js"><img src="https://david-dm.org/LukasBombach/Type.js.svg" alt="Dependency Status"></a>
<a href="https://david-dm.org/LukasBombach/Type.js#info=devDependencies"><img src="https://david-dm.org/LukasBombach/Type.js/dev-status.svg" alt="devDependency Status"></a>
<a href="https://codeclimate.com/github/LukasBombach/Type.js"><img src="https://codeclimate.com/github/LukasBombach/Type.js/badges/gpa.svg" alt="Code Climate"></a>
</p>

**Type.js** is a library that provides a simple high-level API that lets you implement your own WYSIWYG editor easily and reliably. Usually WYSIWYG-editors do not match the UI and the use-case of your project and it is a hassle to customize them. This is why Type.js provides all the functionality but leaves the implementation of the UI to you. The API is as simple as jQuery and gives you more possiblities and control than "regular" editors. It is really easy to create an editor that will work stable across browsers and will always create the same simple markup on all devices. 

## How does it work

[![Join the chat at https://gitter.im/LukasBombach/Type.js](https://badges.gitter.im/LukasBombach/Type.js.svg)](https://gitter.im/LukasBombach/Type.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Most current WYSIWYG editors rely on a browser API called `contenteditable`, which essentially enables users to interactively modify contents on a website and offers methods to apply formattings to the text. This API is utilized to make a particular part of a website—the editor's contents—editable which then acts as an input field. Some controls are added and voilà—there's your editor.

The problem with this is that the API is badly designed (by Internet Explorer 5.5), broken and inconsitent across all browsers. This is why most editors do not *really* work and end up being a pain to developers. Another big problem is that there can be in inifinte number of DOM-representations for the same visual output, which makes editing messy.

To tackle this, Type.js uses an elaborate internal document model on which editing operations are performed and renders clean and constistent markup on all browsers. The document model also makes sure editing operations always behave similarly and it can be extended to render other formats like Markdown or ODT.

## Status

This project is a rewrite of my [master's thesis](https://github.com/LukasBombach/old-type-js) and is pretty much WIP. Since I am not expecting much traffic I am actively working on the master branch and it might be broken from time to time. 

**I am aiming to release a first version this quarter.**

## Agenda:

1. [ ] :fire: **Heavy WIP** :fire: Write document model & renderer for editing
1. [ ] :fire: **Heavy WIP** :fire: Undo / Redo based on document model
1. [ ] Clean up code
1. [ ] Write tests
1. [ ] Go alpha

Other projects that are interesting right now (because they too avoid `contenteditable`):

* https://github.com/basecamp/trix
* https://github.com/ProseMirror/prosemirror

## Basic usage:

```javascript
// Instantiate Type and pass it an element that will be editable
var el = document.getElementById('editor-contents');
var editor = new Type(el);

// Will format the current selection bold
editor.format('bold');

// Will format characters 10 to 20 italic
editor.format('italic', 10, 20);

// Will select the characters 5 to 10
editor.select(5, 10);
```

## Installation

Include `type.min.js` from the `dist` folder on your website. AMD / CommmonJs coming soon.

## Building

1. Install node js
2. Run `npm install` from the root directory
3. Run `npm run dist` from the root directory to build a minified file

## License

Type.js is licenced under the [MIT license](https://github.com/LukasBombach/Type.js/blob/master/LICENSE).
