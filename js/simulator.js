function distance(a, b) { if(a && b) return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)); }
function move(start, end, style) { $('#field').drawLine(start.x, start.y, end.x, end.y, style); }

function move_n(start, end, style) {
	var del = distance(start, end);
	new_pos = {x: start.x+(end.x-start.x)/del, y: start.y+(end.y-start.y)/del};
	move(start, new_pos, style);
	return new_pos;
}

function move_h1(start, vector, style) {
	prediction = parseInt($('#heu1_prediction').val());
	
	var del = distance(vector.a, vector.b);
	new_pos = {x: vector.a.x+(vector.b.x-vector.a.x)/del*prediction, y: vector.a.y+(vector.b.y-vector.a.y)/del*prediction};
	
	if(start != new_pos)
		return move_n(start, new_pos, style);
	else
		return move_n(start, vector.b, style);
}

victim_moved = false;

function move_victim() {
	switch($("input[name='strategy_victim']:checked").val()) {
		case 'shortest':
			victim = move_n(victim, target, sv);
		break;
		
		case 'zigzag':
			zigzag_delta = parseInt($('#zigzag_delta').val());
			
			if(distance(victim, target) < zigzag_delta)
				victim = move_n(victim, target, sv);
			else
				if(!victim_moved)
					victim_moved = {where: victim, to: {x: zigzag_delta}};
				
				if(distance(victim_moved.where, victim) > 30) {
					victim_moved.where = victim;
					victim_moved.to.x = ((victim_moved.to.x == zigzag_delta) ? -zigzag_delta : zigzag_delta);
				}
				
				new_pos = {x: target.x + victim_moved.to.x, y: target.y};
				
				victim = move_n(victim, new_pos, sv);
		break;
	}
}

stop = false;
p1 = p2 = p3 = victim = target = {};
sv = {color: '#ff0'};
s1 = {color: '#f00'};
s2 = {color: '#0f0'};
s3 = {color: '#00f'};

function is_end() {
	if(distance(p1, victim) < 2 || distance(p2, victim) < 2 || distance(p2, victim) < 2 || distance(victim, target) < 2) {
		alert('край, жертвата е в позиция ' +Math.round(victim.x) + ',' + Math.round(victim.y));
		stop = true;
		return true;
	}
	
	return false;
}

function nextMove() {
	switch($("input[name='strategy']:checked").val()) {
		case 'normal':
			move_victim();
			p1 = move_n(p1, victim, s1);
			p2 = move_n(p2, victim, s2);
			p3 = move_n(p3, victim, s3);
		break;
		
		case 'heuristic1':
			prev_victim = victim;
			move_victim();
			
			p1 = move_h1(p1, {a: prev_victim, b: victim}, s1);
			p2 = move_h1(p2, {a: prev_victim, b: victim}, s2);
			p3 = move_h1(p3, {a: prev_victim, b: victim}, s3);
		break;
	}
	
	if( !stop && !is_end())
		setTimeout(nextMove, 100);
}

$(document).ready(function(){	
	count = 0;
	first = true;
	
	$('#start').click(function() {
		$('canvas').remove();
		
		p1.x = parseInt($('#p1x').val());
		p1.y = parseInt($('#p1y').val());
		p2.x = parseInt($('#p2x').val());
		p2.y = parseInt($('#p2y').val());
		p3.x = parseInt($('#p3x').val());
		p3.y = parseInt($('#p3y').val());
		
		victim.x = parseInt($('#victimx').val());
		victim.y = parseInt($('#victimy').val());
		target.x = parseInt($('#targetx').val());
		target.y = parseInt($('#targety').val());
		
		setTimeout('stop = false; nextMove();', 200);
		return false;
	});
	nextMove();
	stop = true;
	$('#start').click();
});