<?php
class Servidor extends MyModel{
	protected $table = 'servidores';
	public function vaga(){
		return $this->hasOne('Vaga');
	}
	public function scopeFilter($q, $filter){
		if(is_array($filter)){
			foreach($filter as $k=>$v){
				switch($k){
					case 'nome':$q->where('nome', 'like', '%'.$v.'%');break;
					case 'mail':$q->where('mail', 'like', $v.'%');break;
					default:;
				}

			}
		}
	}
	public function byPost(){
		foreach($this->attributes as $k=>$v){
			$pval = Input::get($k);
			if($k=='media'){
				if(is_object($pval) || is_array($pval))
					$pval = @serialize($pval);
			}
			if($pval && $pval!==$this->$k)
				$this->$k = $pval;

		}
	}
	public function onSelect(){
		if(!empty($this->media))
			$this->media = @unserialize($this->media);
		else
			$this->media = array();
		return $this;
	}
}
