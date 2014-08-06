<?php
  header("Content-type:text/Javascript");
  echo $_GET['callback'].'(';
  $txt = readfile('data.json');
  echo ')';
?>