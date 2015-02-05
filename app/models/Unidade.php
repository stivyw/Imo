<?php
class Unidade extends MyModel{

	public function orgao(){
		return $this->belongsTo('Orgao');
	}
	//DÙVIDA SE EXISTE
	public function vagas(){
		return $this->hasMany('Vaga');
	}

	public function scopeFilter($q, $filter){
		if(is_array($filter)){
			foreach($filter as $k=>$v){
				switch($k){
					case 'nome':$q->where('nome', 'like', '%'.$v.'%');break;
					case 'mail':$q->where('mail', 'like', $v.'%');break;
					case 'end_logradouro':$q->where('end_logradouro', 'like', $v.'%');break;
					default:;
				}

			}
		}
	}
}