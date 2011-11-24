<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@ taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@ taglib prefix="rich" uri="http://richfaces.ajax4jsf.org/rich"%>
<%@ taglib prefix="a4j" uri="http://richfaces.org/a4j"%>
<%@ taglib prefix="stella" uri="http://stella.caelum.com.br/faces"%>

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

		<a4j:keepAlive beanName="pessoaBean" />

			<fieldset><legend>Atualização de Dados</legend> 

			<rich:dataTable value="#{pessoaBean.pessoas}" var="fisica" rows="10" id="fisicas" 
				width="100%" cellspacing="0" cellpadding="0" border="1">	
				<h:column>
					<f:facet name="header"><h:outputText value="Nome"/></f:facet>
					<h:outputText value="#{fisica.nome}" />
				</h:column>
	
				<h:column>
					<f:facet name="header"><h:outputText value="E-mail" /></f:facet>
					<h:outputText value="#{fisica.email}" />
				</h:column>
	
				<h:column>
					<f:facet name="header"><h:outputText value="CPF" /></f:facet>
					<h:outputText value="#{fisica.cpf}" />
				</h:column>
			
				<h:column>
					<f:facet name="header"><h:outputText value="Data Nasc." /></f:facet>
					<h:outputText value="#{fisica.dataNascimento}">
						<f:convertDateTime pattern="dd/MM/yyyy" />
					</h:outputText>
				</h:column>
			 
				<h:column>
					<f:facet name="header"><h:outputText value="CELULAR" /></f:facet>
					<h:outputText value="#{fisica.telefoneCelular}" />
				</h:column>
	
				<h:column>
					<f:facet name="header"><h:outputText value="Excluir"/></f:facet>
					<a4j:commandLink reRender="panelGridInputs">
						<h:outputText value="Selecionar"/>
						<f:setPropertyActionListener  value="#{fisica}" target="#{pessoaBean.pessoa}"/>
					</a4j:commandLink>
				</h:column>
	 			
		 		<f:facet name="footer"><rich:datascroller /></f:facet>
			</rich:dataTable>
			
			<rich:messages/>
			
    	    <a4j:region id="regiaoAjax">
			 	<a4j:status id="sts">
	            	<f:facet name="start">
	            		<h:graphicImage value="/images/ajax-loader.gif" />
	               	</f:facet>
	            </a4j:status>
	        </a4j:region>

			<h:panelGrid columns="2" id="panelGridInputs">
				<h:outputLabel for="nome" value="Nome "  />
				<h:inputText id="nome" value="#{pessoaBean.pessoa.nome}" style=" width : 254px;"/>
				
				<h:outputLabel for="email" value="E-mail "  />
				<h:inputText id="email" value="#{pessoaBean.pessoa.email}" style=" width : 249px;">
					<f:validator validatorId="emailValidator"/>
				</h:inputText>
				
				<h:outputLabel for="cpf" value="CPF "  />
				<h:inputText id="cpf" validatorMessage="CPF inválido!" value="#{pessoaBean.pessoa.cpf}" size="60" style=" width : 106px;">
					<rich:jQuery selector="#cpf" query="mask('999.999.999-99')" timing="onload"/>
					<stella:validateCPF formatted="true"/>
				</h:inputText>
				
				<h:outputLabel for="senha" value="Senha "  />
				<h:inputSecret id="senha" value="#{pessoaBean.pessoa.senha}" size="30"/>
				
				<h:outputLabel for="dataNasc" value="Data Nascimento: "  />
				<h:inputText id="dataNasc" validatorMessage="Data de nascimento com formato inválido!" value="#{pessoaBean.pessoa.dataNascimento}" size="60" style=" width : 75px;">
					<f:convertDateTime pattern="dd/MM/yyyy" />
					<rich:jQuery selector="#dataNasc" query="mask('99/99/9999')" timing="onload"/>
				</h:inputText> 
					
				<h:outputLabel for="telCel" value="Tel. Celular "  />
				<h:inputText id="telCel" value="#{pessoaBean.pessoa.telefoneCelular}">
					<rich:jQuery selector="#telCel" query="mask('(99) 9999-9999')" timing="onload"/>
				</h:inputText>
				
				<a4j:commandButton value="Atualizar" action="#{pessoaBean.merge}" styleClass="botoes" status="sts" reRender="fisicas"/>
				<a4j:commandButton value="Voltar" immediate="true" action="toIndex" styleClass="botoes"/>
			</h:panelGrid>
		</fieldset>
				
	</h:form>
</f:view>
</body>
</html>