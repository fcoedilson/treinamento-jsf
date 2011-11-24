<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@ taglib prefix="h" uri="http://java.sun.com/jsf/html"%>
<%@ taglib prefix="rich" uri="http://richfaces.ajax4jsf.org/rich"%>

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

		<rich:messages />

		<fieldset style="width:200px; margin-left:480px; margin-top:200px">

			<h:panelGrid columns="2">

					<h:outputText value="E-mail" styleClass="rotulos" />

					<h:inputText id="email" value="#{pessoaBean.pessoa.email}" styleClass="edit" size="90" style=" width : 150px;">
						<f:validator validatorId="emailValidator" />
					</h:inputText>	
										
					<h:outputLabel for="senha" value="Senha" styleClass="rotulos"/>

					<h:inputSecret id="senha" styleClass="edit" validatorMessage="Informe 6 caracteres ou +" 
					value="#{pessoaBean.pessoa.senha}" size="60" style=" width : 150px;">
						<f:validateLength minimum="6"/>
					</h:inputSecret>
					
					<h:commandButton id="botao" value="Entrar" action="#{pessoaBean.login}" />
			</h:panelGrid>

		</fieldset>

	</h:form>

</f:view>
</body>
</html>