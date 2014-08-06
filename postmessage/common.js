window.onload = function() {
  var h1 = document.querySelector('h1');
  h1.innerHTML = 'you have not post any message';
  window.onmessage = function(e) {
    h1.innerHTML = e.data;
  }
};