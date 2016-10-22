package com.teamNode.controllers;

import javax.inject.Inject;

import com.teamNode.domain.Match;
import com.teamNode.exceptions.MatchException;

import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.view.Results;

@Controller
@Path("/match")
public class MatchController extends DefaultController<Match> {
	
	public MatchController() {
		this(null, null);
	}
	
	@Inject
	public MatchController(Result result, GamePlayController gamePlayController) {
		this.result = result;
		this.gamePlayController = gamePlayController;
	}
	
	@Path("/all")
	public void getActiveMatches () {
		serializeToJsonOutput(gamePlayController.getActiveMatches());
	}
	
	@Path("/player-turn/{matchIdentificator}")
	public void getPlayerTurn (String matchIdentificator) {
		try {
			Match match = gamePlayController.getMatch(matchIdentificator);
			result.use(Results.json()).from(match.getPlayerTurn()).serialize();
		} catch (MatchException e) {
			result.use(Results.json()).from(e.getMessage()).serialize();
		}
	}
	
}

