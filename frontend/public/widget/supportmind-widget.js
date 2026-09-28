// Compatibility wrapper for legacy SupportMind AI script references
// Loads the updated MERIDAS Operational Intelligence Widget
(function() {
  var current = document.currentScript;
  var script = document.createElement('script');
  var scriptPath = current ? current.src.replace('supportmind-widget.js', 'meridas-widget.js') : '/widget/meridas-widget.js';
  script.src = scriptPath;
  
  if (current) {
    for (var i = 0; i < current.attributes.length; i++) {
      var attr = current.attributes[i];
      if (attr.name !== 'src') {
        script.setAttribute(attr.name, attr.value);
      }
    }
  }
  
  document.head.appendChild(script);
})();
