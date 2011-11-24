<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="f" uri="http://java.sun.com/jsf/core"%>
<%@ taglib prefix="h" uri="http://java.sun.com/jsf/html"%>

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
		<h:messages />
		<fieldset style="width:200px; margin-left:480px; margin-top:200px">
			<legend>Menu</legend> 
				<h:panelGrid>
					<h:commandLink value="Cadastrar Pessoa" action="cadastrarPessoa" />
					<h:commandLink value="Consultar Pessoa" action="pesquisarPessoa" />
					<h:commandLink value="Excluir Pessoa" action="removerPessoa" />
					<h:commandLink value="Sair" action="#{pessoaBean.logout}" />
				</h:panelGrid>
		</fieldset>
	</h:form>
</f:view>
</body>
</html>