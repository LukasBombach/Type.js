# Type js

Type js is a WYSIWYG library that **lets you implement your own wysiwyg editor**.
It has no ui but provides a high-level API for all your WYSIWYG needs. Most 
importantly, **it does not rely contenteditable**.

# Status

I am currently rewriting my old project [Type.js](https://github.com/LukasBombach/Type.js). 
This is a 100% WIP right now.

## Installation

Include `type.min.js` from the `dist` folder on your website.

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
3. Run `npm run build` from the root directory to build a minified file

## License

Type is licenced under the MIT license (see `LICENSE.txt`).
