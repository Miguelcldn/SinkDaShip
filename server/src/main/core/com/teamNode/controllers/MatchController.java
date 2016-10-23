package com.teamNode.controllers;

import javax.inject.Inject;

import com.teamNode.domain.BoardCell;
import com.teamNode.domain.Match;
import com.teamNode.exceptions.MatchException;
import com.teamNode.responses.AttackResponse;
import com.teamNode.responses.TurnResponse;

import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Result;

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
		serializeToJsonOutput(successResponseList(gamePlayController.getActiveMatches()));
	}
	
	@Path("/player-turn/{matchIdentificator}")
	public void getNumberOfPlayerOfTheTurn (String matchIdentificator) {
		try {
			Match match = gamePlayController.getMatch(matchIdentificator);
			serializeToJsonOutput(successResponse(new TurnResponse(match)));
		} catch (MatchException e) {
			serializeToJsonOutput(failResponse(e.getMessage()));
		}
	}
	
	@Path("/attack/{matchIdentificator}")
	public void addNewAttack (String matchIdentificator, BoardCell cellHitted){
		try {
			Match match = gamePlayController.getMatch(matchIdentificator);
			AttackResponse attackResponse = match.receiveAttack(cellHitted);
			serializeToJsonOutput(successResponse(attackResponse));
		} catch (MatchException e) {
			serializeToJsonOutput(failResponse(e.getMessage()));
		}
	}
	
}

