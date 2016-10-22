package com.teamNode.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import com.teamNode.domain.Match;
import com.teamNode.domain.Player;
import com.teamNode.exceptions.MatchException;

@ApplicationScoped
public class GamePlayController {
	
	private List<Match> activeMatches;
	
	private Player playerWhoIsWaitingForOpponnent;
	
	public GamePlayController() {
		activeMatches = new ArrayList<Match>();
	}

	public List<Match> getActiveMatches() {
		return activeMatches;
	}

	public Match getMatch(String matchIdentificator) throws MatchException {
		for (Match match : activeMatches) {
			if (match.getHashId().equals(matchIdentificator)){
				return match;
			}
		}
		throw new MatchException("The match with "+matchIdentificator+" identificator was not found on server.");
	}

	public void addNewPlayer(Player newPlayer) {
		if (playerWhoIsWaitingForOpponnent == null){
			playerWhoIsWaitingForOpponnent = newPlayer;
		} else {
			insertNewMatch(newPlayer);
		}
	}

	private void insertNewMatch(Player newPlayer) {
		Match match = new Match(playerWhoIsWaitingForOpponnent, newPlayer);
		playerWhoIsWaitingForOpponnent = null;
		this.activeMatches.add(match);
	}
	
}
