module.exports = Object.assign(
    {},
    require('./runJavascript'),
);

/* 
 The import that works is above and the comment at the bottom
 Is the one that doesnt work but the linter accepts x.x 
*/

// > module.exports = { ...require('./runJavascript'), };