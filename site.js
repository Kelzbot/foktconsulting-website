/* Shared site config. ADDRESS is the single source of truth for the company
   address on every page. While it is still the placeholder, pages render
   ADDRESS_FALLBACK instead (which is also the static text in the HTML).

   TEMPORARY: once the real registered agent address is known, hard-code it
   into index.html, terms.html, privacy.html and refund.html (find-and-replace
   the <span data-address> contents) so it appears in the page source, then
   remove this JS swap and the site.js script tags. */
var ADDRESS = "[NEW REGISTERED AGENT ADDRESS]";
var ADDRESS_FALLBACK = "Wyoming, United States";

(function(){
  function isPlaceholder(value){
    return !value || /^\s*\[.*\]\s*$/.test(value);
  }
  var text = isPlaceholder(ADDRESS) ? ADDRESS_FALLBACK : ADDRESS;
  document.querySelectorAll('[data-address]').forEach(function(el){
    el.textContent = text;
  });
})();
