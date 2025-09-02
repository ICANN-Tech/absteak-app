(function(d,t) {
  var BASE_URL="http://localhost:3002";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 'xj7ws8BJbZwWzEuAiSW5CnhA',
      baseUrl: BASE_URL
    })
  }
})(document,"script");

// Initialize Chatwoot widget
window.addEventListener('DOMContentLoaded', function() {
  // Widget will be automatically loaded
  console.log('Chatwoot widget initialized');
});