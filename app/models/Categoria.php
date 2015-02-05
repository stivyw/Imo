<?php
class Categoria extends Eloquent{
	public function artigos(){
		return $this->hasMany('Artigo');
	}
}
