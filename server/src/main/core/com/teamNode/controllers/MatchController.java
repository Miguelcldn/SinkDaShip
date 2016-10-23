package com.teamNode.controllers;

import java.util.List;

import javax.inject.Inject;

import com.teamNode.domain.Match;
import com.teamNode.domain.Player;
import com.teamNode.exceptions.MatchException;
import com.teamNode.responses.AttackRequest;
import com.teamNode.responses.AttackResponse;
import com.teamNode.responses.TurnResponse;

import br.com.caelum.vraptor.Consumes;
import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.serialization.gson.WithoutRoot;

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
	
	@Post
	@Path("/attack")
	@Consumes(value="application/json", options=WithoutRoot.class)
	public void addNewAttack (AttackRequest attackRequest){
		try {
			Match match = gamePlayController.getMatch(attackRequest.getMatchId());
			if (match.getPlayerTurn() == attackRequest.getPlayerNumber()){
				AttackResponse attackResponse = match.receiveAttack(attackRequest.getCellHitted());
				serializeToJsonOutput(successResponse(attackResponse));
			} else {
				throw new MatchException("It's not your turn! Please wait for enemy's attack!");
			}
		} catch (MatchException e) {
			serializeToJsonOutput(failResponse(e.getMessage()));
		}
	}

	@Post
	@Path("/add-new-player")
	@Consumes(value="application/json", options=WithoutRoot.class)
	public void addNewPlayer (Player player){
		List<String> validationMessages = player.validateInformations();
		if (validationMessages.isEmpty()){
			try {
				serializeToJsonOutput(successResponse(gamePlayController.addNewPlayer(player)));
			} catch (MatchException e) {
				serializeToJsonOutput(failResponse(e.getMessage()));
			}
		} else {
			StringBuilder completeMessage = new StringBuilder();
			for (String message : validationMessages) {
				completeMessage.append(message+" ");
			}
			serializeToJsonOutput(failResponse(completeMessage.toString()));
		}
	}
	
}

