var player1 = {
	nome:'',
};
var player2 = {
	nome:'',
};
var game = {
	is_running:false,
	is_debug:false,
	vez:'',
	divs:['1','2','3','4','5','6','7','8','9'],
	divs_selected:[],
	p1: '',
	p2: '',
	p1ok:'',
	p2ok:'',
	jogada:0,
	nivel:0,
	computer:'',
	usuario:'',
	ia_centro:false,
	Init:function(){
		A = this.Init.arguments;
		var reinit = A[0] || false;
		if ( reinit ){	
			$('#status').html('');
			for(i=1;i<=9;i++){
				$('#'+i).find('.div_inner').html('');
			}
			$('#tabuleiro').fadeOut().queue(function(){
				$(this).fadeIn();
				$(this).dequeue();
			});
		}
		this.is_running = true;
		this.vez = '';
		this.divs_selected = [];
		this.p1 = '<span class="bola">o</span>';
		this.p1ok = '<span class="bola ok">o</span>';
		this.p2 = '<span class="xis">x</span>';
		this.p2ok = '<span class="xis ok">x</span>';
		this.jogada = 0;
		if ( this.nivel == 2 ){
			if ( player1.nome == 'pc1' ){
				this.computer = this.p1;
				this.usuario = this.p2;
			}else{
				this.computer = this.p2;
				this.usuario = this.p1;
			}
		}
		// --- saida de tela:
		var pa = this.get_stats('velhaPartidas');
		pa++;
		ws.set('velhaPartidas', pa);
		$('#Partidas').html(pa);
		$('#Player1').html(this.get_stats('velhaP1'));
		$('#Player2').html(this.get_stats('velhaP2'));
		var nivel_nome = ( this.nivel == 1 ) ? 'Easy':'Hard';
		$('#Nivel').html(nivel_nome);
		if ( (player1.nome == 'pc1' && player2.nome == 'pc2') || player1.nome == 'pc1' ){
			this.processa_click(0);
		}		
	},
	set_click:function(pl,id){
		var c = ( pl == '1' ) ? this.p1 : this.p2;
		$('#'+id).find('.div_inner').html(c);
	},
	set_jogada_for:function(pl, id){
		var c = ( pl == '1' ) ? this.p1ok : this.p2ok;
		$('#'+id).find('.div_inner').html(c);
	},
	get_div_content:function(id){
		return $('#'+id).find('.div_inner').html() || false;
	},
	ja_clicado:function(id){
		if ( this.divs_selected.length == 0 ){
			return false;
		}else{
			var x = this.get_div_content(id);
			return ( x && x != '' );
		}
	},
	processa_click:function(id){
		if ( !this.is_running ){
			return;
		}
		this.jogada++;
		if ( this.vez == '' ){
			this.vez = player1.nome;
		}
		if ( this.vez == player1.nome ){
			if ( player1.nome == 'pc1' ){
				this.computer_player('1');
			}else{
				if ( id != 0 ) { this.vez_player('1', id); }
			}
		}else{
			if ( player2.nome == 'pc2' ){
				this.computer_player('2');
			}else{
				if ( id != 0 ) { this.vez_player('2', id); }
			}
		}
		if ( this.is_debug ){
			txt = 'debug: jogada('+this.jogada+')<br>';
			txt += 'player('+this.vez+'), idclick('+id+')<br>';
			txt += 'game.divs_seleted('+this.divs_selected.toString() +')<br>';
			txt += 'game_running('+this.is_running.toString()+')';
		}else{
			txt = 'Next player: ' + this.vez;
		}
		if ( this.is_running ){
			this.talk(txt);
		}
	},
	computer_player:function(pl){
		this.vez = ( this.vez == player1.nome ) ? player2.nome : player1.nome;
		var x = 0;
		x = ( this.nivel == 1 ) ? this.make_random() : this.IA();
		if ( this.is_debug ) {
			$('#debug').html('computer_player::IA_id('+x+')');
		}
		this.divs_selected.push(x);
		this.set_click(pl, x);	
		this.analisa_jogo();
		this.processa_click(0);
	},
	vez_player:function(pl, id){
		this.vez = ( this.vez == player1.nome ) ? player2.nome : player1.nome;
		if ( this.ja_clicado(id) ){
			return;
		}
		this.divs_selected.push(id);
		this.set_click(pl, id);
		this.analisa_jogo();
		this.processa_click(0);
	},
	IA_jogada:function(a, b, c, para){
		var usuario = this.usuario;
		var pc = this.computer;
		_A = this.get_div_content(a);
		_B = this.get_div_content(b);
		_C = this.get_div_content(c);
		if ( para == 'pc' ){
			if ( !_A && _B == pc && _C == pc ) { 
				return a;
			}else if ( _A == pc && !_B && _C == pc ){ 
				return b;
			}else if ( _A == pc && _B == pc && !_C ) { 
				return c;
			}else{
				return 0;
			}
		}else{
			if ( !_A && _B == usuario && _C == usuario ) { 
				return a;
			}else if ( _A == usuario && !_B && _C == usuario ){ 
				return b;
			}else if ( _A == usuario && _B == usuario && !_C ) { 
				return c;
			}else{	
				return 0;
			}
		}
	},
	IA_init_centro:function(){
		var quinas = ['1','3','7','9'];
		id = Math.floor( Math.random() * (quinas.length-1) );
		quina = quinas[id];
		var r = ( !this.ja_clicado(quina) ) ? quina : 0;
		return r;
	},
	IA:function(){
		var _id = 0;
		// --- se user marca o centro, tenho que fechar as quinas:
		if ( !this.ia_centro && this.ja_clicado(5) && this.get_div_content(5) == this.usuario ){
			_id = this.IA_init_centro();
			this.ia_centro = true;
			if ( _id != 0 )return _id;
		}else if ( !this.ja_clicado(5) ){ // --- se centro ta vazio, pega centro:
			this.ia_centro = true;
			return 5;
		}
		_id = this.IA_jogada(1,2,3, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(4,5,6, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(7,8,9, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(1,5,9, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(3,5,7, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(1,4,7, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(2,5,8, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(3,6,9, 'pc');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		// --- jogadas user:
		_id = this.IA_jogada(1,2,3, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(4,5,6, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(7,8,9, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(1,5,9, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(3,5,7, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(1,4,7, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(2,5,8, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		_id = this.IA_jogada(3,6,9, 'u');
		if ( _id != 0 ){
			return ( this.ja_clicado(_id) ) ? this.make_random() : _id;
		}
		return this.make_random();
	},
	make_random:function(){ 
		var n = this._get_rand();
		if ( this.ja_clicado(n) ){
			//alert(n + ' ja clicado (aqui vai todo chamar recursiva');
			n = this.make_random();
		}
		return n;
	},
	_get_rand:function(){
		return Math.floor( (Math.random() * 9) +1 ); // entre 1 e 9
	},
	analisa_jogo:function(){
		// --- jogada 1,2,3:
		this.analisa_jogada(1,2,3);
		if ( !this.is_running ){ return; }
		// --- jogada 4,5,6:
		this.analisa_jogada(4,5,6);
		if ( !this.is_running ){ return; }
		// --- jogada 7,8,9:
		this.analisa_jogada(7,8,9);
		if ( !this.is_running ){ return; }
		// --- jogada 1,5,9:
		this.analisa_jogada(1,5,9);
		if ( !this.is_running ){ return; }
		// --- jogada 3,5,7:
		this.analisa_jogada(3,5,7);
		if ( !this.is_running ){ return; }
		// --- jogada 1,4,7:
		this.analisa_jogada(1,4,7);
		if ( !this.is_running ){ return; }
		// --- jogada 2,5,8:
		this.analisa_jogada(2,5,8);
		if ( !this.is_running ){ return; }
		// --- jogada 3,6,9:
		this.analisa_jogada(3,6,9);
		if ( !this.is_running ){ return; }
		// --- velha
		this.deu_velha();
		if ( !this.is_running ){ return; }
	},
	analisa_jogada:function(a, b, c){
		var p_1 = 0;
		var p_2 = 0;
		var div1 = this.get_div_content(a);
		var div2 = this.get_div_content(b);
		var div3 = this.get_div_content(c);
		if ( div1 == this.p1 ) { p_1++; }
		if ( div2 == this.p1 ) { p_1++; }
		if ( div3 == this.p1 ) { p_1++; }
		
		if ( div1 == this.p2 ) { p_2++; }
		if ( div2 == this.p2 ) { p_2++; }
		if ( div3 == this.p2 ) { p_2++; }
		
		if ( p_1 == 3 ){ 
			this.set_jogada_for('1', a); 
			this.set_jogada_for('1', b); 
			this.set_jogada_for('1', c); 
			this.end_game('1');
		}
		if ( p_2 == 3 ){ 
			this.set_jogada_for('2', a);
			this.set_jogada_for('2', b);
			this.set_jogada_for('2', c);
			this.end_game('2');
		}
	},
	deu_velha:function(){
		var total = 0;
		for (i=1; i<=9; i++ ){
			if ( this.ja_clicado(i) ){
				total++;
			}
		}
		if ( total == 9 ){
			// --- deu velha
			this.is_running = false;
			this.talk('Deu Velha!');
		}
	},
	get_stats:function(item){
		return (ws.get(item))?parseInt(ws.get(item)):0;
	},
	end_game:function(p){
		var partida = this.get_stats('velhaPartidas');
		var p1 = this.get_stats('velhaP1');
		var p2 = this.get_stats('velhaP2');
		if ( p == '1' ){
			p1++;
			$('#Player1').html(p1);
			nome = player1.nome;
		}else{
			p2++;
			$('#Player2').html(p2);
			nome = player2.nome;
		}
		nome = ( nome == 'pc1' || nome == 'pc2' ) ? 'Computer' : 'You';
		if ( player1.nome == 'pc1' && player2.nome == 'pc2' ) { nome = (p=='1') ? player1.nome:player2.nome;}
		ws.set('velhaPartidas', partida);
		ws.set('velhaP1', p1);
		ws.set('velhaP2', p2);
		$('#Partidas').html(partida);
		this.is_running = false;
		this.talk(nome+' win');
	},
	talk:function(txt){
		$('#status').html(txt);
	},
	
};
/*geral*/
function array_exists(arrai, item)
{
	for ( i=0; i<arrai.length; i++ ){
		if ( item == arrai[i] ){
			return true;
			break;
		}
	}
	return false;
}
$(document).ready(function(){
	$('body').gradient({
		direction:'45deg',
		colors:'white, #efefef',
	});
	$('#newGame').click(function(e){
		e.preventDefault();
		game.Init(true);
	});
});
function v_click(o)
{
	if ( game.is_running ){
		var temp = setTimeout(function(){ 
			game.processa_click(o.id);
		}, 300);
	}
}
function gameBegin()
{
	player1.nome = $('#choosePlayer1').val();
	player2.nome = $('#choosePlayer2').val();
	game.nivel = $('#chooseLevel').val();
	$('#gameBegin').fadeOut().delay(400, function(){
		$('#tabuleiro').fadeIn();
		});
	game.Init();
}