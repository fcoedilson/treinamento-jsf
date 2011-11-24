<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@ taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@ taglib prefix="rich" uri="http://richfaces.ajax4jsf.org/rich"%>
<%@ taglib prefix="a4j" uri="http://richfaces.org/a4j"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="StyleSheet" type="text/css" href="/jsf/style/estilos.css" media="screen" />
</head>

<body>
<f:view>
	
	<h:form>
		<a4j:keepAlive beanName="pessoaBean" />
		<h:messages/>
	
		 <fieldset>
	        <legend>Pesquisa de Pessoas</legend>
			<h:panelGrid columns="2">
			
			    <h:outputLabel for="nomeLabel" value="Digite o nome: " />
				<h:inputText id="nomeInput" value="#{pessoaBean.pessoa.nome}" style=" width : 321px;" />

				<h:commandButton value="Pesquisar" action="#{pessoaBean.pesquisaByNome}" styleClass="botoes"/>
				<h:commandButton value="Voltar" immediate="true" action="toIndex" styleClass="botoes"/>
    		</h:panelGrid>
			
			<h:panelGrid columns="2" id="panelGridInputs">
				<h:outputLabel for="nome" value="Nome "  />
				<h:inputText id="nome" readonly="true" value="#{pessoaBean.pessoa.nome}" style=" width : 254px;"/>
				
				<h:outputLabel for="email" value="E-mail "  />
				<h:inputText id="email" readonly="true" value="#{pessoaBean.pessoa.email}" style=" width : 249px;"/>
				
				<h:outputLabel for="cpf" value="CPF "  />
				<h:inputText id="cpf" readonly="true" validatorMessage="CPF inválido!" value="#{pessoaBean.pessoa.cpf}" size="60" style=" width : 106px;"/>
				
				<h:outputLabel for="dataNasc" value="Data Nascimento: "  />
				<h:inputText id="dataNasc" readonly="true" validatorMessage="Data de nascimento com formato inválido!" value="#{pessoaBean.pessoa.dataNascimento}" size="60" style=" width : 75px;">
					<f:convertDateTime pattern="dd/MM/yyyy" />
				</h:inputText> 
					
				<h:outputLabel for="telCel" value="Tel. Celular "  />
				<h:inputText id="telCel" readonly="true" value="#{pessoaBean.pessoa.telefoneCelular}" />
			</h:panelGrid>
	    </fieldset>
	</h:form>
</f:view>
</body>
</html>
