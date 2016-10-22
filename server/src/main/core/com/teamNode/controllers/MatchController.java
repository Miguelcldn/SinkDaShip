package com.teamNode.controllers;

import javax.inject.Inject;

import com.teamNode.domain.Match;
import com.teamNode.domain.Player;
import com.teamNode.exceptions.FullGameException;

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

		
		try {

			Player playerOne = new Player();
			match.addNewPlayer(playerOne);
			Player playerTwo = new Player();
			match.addNewPlayer(playerTwo);
			
		} catch (FullGameException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		result.use(Results.json()).from(match).serialize();
		
	}
	
}

