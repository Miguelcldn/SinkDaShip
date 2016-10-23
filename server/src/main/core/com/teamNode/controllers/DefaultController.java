package com.teamNode.controllers;

import java.util.List;

import com.teamNode.domain.GeneralResponse;
import com.teamNode.interfaces.AbstractDomain;

import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;

public abstract class DefaultController<T extends AbstractDomain> {

	protected Result result;
	
	protected GamePlayController gamePlayController;
	
	protected void serializeToJsonOutput(GeneralResponse response) {
		result.use(Results.json()).withoutRoot().from(response).recursive().serialize();
	}
	
	protected GeneralResponse failResponse (String message) {
		return new GeneralResponse(false, message);
	}
	
	protected GeneralResponse successResponseObject (T obj) {
		return new GeneralResponse(true, obj);
	}
	
	protected GeneralResponse successResponseList (List<T> obj) {
		return new GeneralResponse(true, obj);
	}
	
	protected GeneralResponse successResponse (Object sucessResponse) {
		return new GeneralResponse(true, sucessResponse);
	}
	
}
