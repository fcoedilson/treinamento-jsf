<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@ taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@ taglib prefix="rich" uri="http://richfaces.ajax4jsf.org/rich"%>
<%@ taglib prefix="stella" uri="http://stella.caelum.com.br/faces"%>
<%@ taglib prefix="a4j" uri="http://richfaces.org/a4j"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="StyleSheet" type="text/css" href="/jsf/style/estilos.css" media="screen" />
	<script type="text/javascript" src="/jsf/resources/jquery.maskedinput-1.2.1.js"></script>
</head>

<body>
<f:view>
	<h:form>
		<rich:messages/>
	
		 <fieldset>
	        <legend>Cadastro de Pessoa</legend>
		        <a4j:region id="regiaoAjax">
					<a4j:status id="sts">
	                    <f:facet name="start">
	            		     <h:graphicImage value="/images/ajax-loader.gif" />
	               		</f:facet>
	                </a4j:status>
	            </a4j:region>
	        
				<h:panelGrid columns="2" id="inputs">
					<h:outputLabel for="nome" value="Nome "  />
					<h:inputText id="nome" value="#{pessoaBean.pessoa.nome}" styleClass="edit" size="40" />

					<h:outputLabel for="email" value="E-mail "  />
					<h:inputText id="email" value="#{pessoaBean.pessoa.email}" required="true" requiredMessage="Campo e-mail obrigatório!" styleClass="edit" size="30">
						<f:validator validatorId="emailValidator"/>
					</h:inputText>

					<h:outputLabel for="senha" value="Senha "  />
					<h:inputSecret id="senha" value="#{pessoaBean.pessoa.senha}" required="true" requiredMessage="Campo senha obrigatório!" styleClass="edit" size="30"/>
						
					<h:outputLabel for="cpf" value="CPF "  />
					<h:inputText id="cpf" value="#{pessoaBean.pessoa.cpf}" styleClass="edit" size="11">
						<rich:jQuery selector="#cpf" query="mask('999.999.999-99')" timing="onload"/>
						<stella:validateCPF formatted="true"/>
					</h:inputText>

					<h:outputLabel for="dataNasc" value="Data Nascimento "  />
					<h:inputText id="dataNasc" validatorMessage="Data de nascimento com formato inválido!" value="#{pessoaBean.pessoa.dataNascimento}" styleClass="edit" size="10" >
						<f:convertDateTime pattern="dd/MM/yyyy" />
						<rich:jQuery selector="#dataNasc" query="mask('99/99/9999')" timing="onload"/>
	     			</h:inputText>

					<h:outputLabel for="telCel" value="Tel. Celular "  />
					<h:inputText id="telCel" value="#{pessoaBean.pessoa.telefoneCelular}" styleClass="edit" size="10">
						<rich:jQuery selector="#telCel" query="mask('(99) 9999-9999')" timing="onload"/>
					</h:inputText>
					
					<a4j:commandButton value="Inserir" action="#{pessoaBean.save}" status="sts" reRender="inputs" styleClass="botoes"/>
					<a4j:commandButton value="Voltar" immediate="true" action="toIndex" styleClass="botoes"/>
		    	</h:panelGrid>
		    </fieldset>
	</h:form>
</f:view>
</body>
</html>