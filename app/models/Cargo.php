<?php
class Cargo extends MyModel{

	public function dados(){
		
		if($this->tipo == 2)
			return $this->belongsTo('CargoComissionado');
		//if($this->tipo == 1)
			return $this->belongsTo('CargoEfetivo');

	}
}
