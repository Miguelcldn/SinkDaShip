package com.teamNode.controllers;

import java.util.List;

import com.teamNode.domain.DefaultDomain;
import com.teamNode.domain.Match;

import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;

public abstract class DefaultController<T extends DefaultDomain> {

	protected Result result;
	
	protected GamePlayController gamePlayController;
	
	protected void serializeToJsonOutput(T simpleObject) {
		result.use(Results.json()).from(simpleObject).recursive().serialize();
	}
	
	protected void serializeToJsonOutput(List<Match> listOfObjects) {
		result.use(Results.json()).from(listOfObjects).recursive().serialize();
	}
	
}
