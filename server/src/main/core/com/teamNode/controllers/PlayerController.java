package com.teamNode.controllers;

import java.util.List;

import javax.inject.Inject;

import com.teamNode.domain.Player;

import br.com.caelum.vraptor.Consumes;
import br.com.caelum.vraptor.Controller;
import br.com.caelum.vraptor.Path;
import br.com.caelum.vraptor.Post;
import br.com.caelum.vraptor.Result;
import br.com.caelum.vraptor.serialization.gson.WithoutRoot;

@Controller
@Path("/player")
public class PlayerController extends DefaultController<Player>{

	public PlayerController() {
		this(null, null);
	}
	
	@Inject
	public PlayerController(Result result, GamePlayController gamePlayController) {
		this.result = result;
		this.gamePlayController = gamePlayController;
	}
	
	@Post
	@Path("/add-new")
	@Consumes(value="application/json", options=WithoutRoot.class)
	public void addNewPlayer (Player player){
		List<String> validationMessages = player.validateInformations();
		if (validationMessages.isEmpty()){
			gamePlayController.addNewPlayer(player);
			serializeToJsonOutput(successResponseObject(player));
		} else {
			StringBuilder completeMessage = new StringBuilder();
			for (String message : validationMessages) {
				completeMessage.append(message+" ");
			}
			serializeToJsonOutput(failResponse(completeMessage.toString()));
		}
	}
	
}
