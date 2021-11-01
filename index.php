<?php
function Site_debug(){ return ( strstr(basename($_SERVER['HTTP_HOST']), 'localhost') ) ? true : false; }
$root_dir = '../../z_js_loader_fafm/';
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>BomBrain: Jogo da Velha</title>
</head>
<body>
<div id="site">
     <div class="box rounded5 pad5 b_silver bg_white text_center shadow" id="conteudo">
          <h1>Jogo da Velha</h1>
          <div id="game_menu">
               Game:<span id="Partidas"></span> <span id="Nivel"></span> |
               Player1:<span id="Player1"></span> |
               Player2:<span id="Player2"></span> |
               <a href="./">reset</a> |
               <a id="newGame" href="#">new</a>
          </div>
          <div style="height:5px;"></div>
          <div id="status"></div>
          <div id="tabuleiro">
               <div class="div1" id="1" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div1" id="2" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div3" id="3" onclick="v_click(this);"><div class="div_inner"></div></div>
               
               <div class="div1" id="4" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div1" id="5" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div3" id="6" onclick="v_click(this);"><div class="div_inner"></div></div>
               
               <div class="div2" id="7" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div2" id="8" onclick="v_click(this);"><div class="div_inner"></div></div>
               <div class="div4" id="9" onclick="v_click(this);"><div class="div_inner"></div></div>
          </div>
          <div id="gameBegin">
               <h3>Options</h3>
               <p>Player 1 (<span class="bola bold">o</span>) (joga primeiro)</p>
               <p><select id="choosePlayer1">
                       <option value="Player1">Me</option>
                       <option value="pc1">Computer</option>
               </select></p>
               <p>Player 2 (<span class="xis bold">x</span>)</p>
               <p><select id="choosePlayer2">
                       <option value="pc2">Computer</option>
                       <option value="Player2">Me</option>
               </select></p>
               <p>Level:</p>
               <p><select id="chooseLevel">
                          <option value="2">hard</option>
                          <option value="1">easy</option>
               </select></p>
               <p><button onclick="gameBegin();">start</button></p>
          </div>
     </div>
     <div id="debug"></div>
     <div class="contador">www.BomBrain.com.br &copy; <?php echo $x; ?></div>
</div>
<script>
<?php
?>
</script>
<script src="<?php echo $root_dir;?>loader.js"></script>
<script>_fLoad('default', '<?php echo $root_dir;?>'); _fLoadOut(['css.css', 'js.js']);</script>
</body>
</html>

