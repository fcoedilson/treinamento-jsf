package br.org.ce.fortaleza.cti.treinamento.facade;

import java.util.List;

import br.org.ce.fortaleza.cti.treinamento.modelo.Pessoa;

public interface PessoaFacade extends BaseFacade<Pessoa>{
	public void salva(Pessoa p);

	public void remove(Pessoa p);
	
	public Pessoa procura(Long id);

	public void atualiza(Pessoa p);
	
	public List<Pessoa> pesquisaPessoasByNome(String nome);
	
	public boolean autentica(String email, String senha);
}