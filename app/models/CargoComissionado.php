<?php
class CargoComissionado extends MyModel{
	protected $table = 'cargos_comissionados';
	public function cargo(){
		return $this->hasOne('Cargo');
	}
	public function simbologia(){
		return $this->hasOne('Simbologia');
	}
}/** /
banco_agencia
banco_conta
banco_nome
codigo
conjuge
contratotemp_final
contratotemp_inicio
data_admissao
data_nasc

doc_cpf
doc_ctps
doc_ctps_serie
doc_ctps_via
doc_pasep
doc_reservista
doc_rg
doc_rg_emissao
doc_rg_orgao
doc_titulo
doc_titulo_sessao
doc_titulo_zona

estado_civil
filiacao_mae
filiacao_pai
matricula
nacionalidade
naturalidade
natureza
nivel_esc
nome
ordem
serie
sexo
situacao
tel1
tel2
tipo
/**/