package com.teamNode.controllers;

import javax.inject.Inject;

import com.teamNode.domain.Match;

import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;

@Controller
@Path("/match")
public class MatchController {
	
	private Result result;
	
	public MatchController() {
	}
	
	@Inject
	public MatchController(Result result) {
		this.result = result;
	}
	
	public void test () {
		Match match = new Match();
		match.setHashId("121321321");
		match.setPlayerTurn(1);
		result.use(Results.json()).from(match).serialize();
	}
	
}
