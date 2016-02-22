// Load core editor class and its API
import Type from './core';
import './core_api';

// Load core modules
import TypeSelection from './selection';

// Expose modules
Type.Selection = TypeSelection;

// Expose Type
window.Type = Type;
