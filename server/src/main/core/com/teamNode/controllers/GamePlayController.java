package com.teamNode.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;

import com.teamNode.domain.Match;
import com.teamNode.domain.Player;
import com.teamNode.exceptions.MatchException;
import com.teamNode.responses.InsertPlayerResponse;

@ApplicationScoped
public class GamePlayController {
	
	private final static int PLAYER_ONE = 1;
	private final static int PLAYER_TWO = 2;
	
	private Map<String, Match> activeMatches;
	
	private Match matchWaitingForOpponent;
	
	public GamePlayController() {
		activeMatches = new HashMap<String, Match>();
	}

	public List<Match> getActiveMatches() {
		ArrayList<Match> activeMatchesAsArrayList = new ArrayList<Match>();
		for (Match activeMatch : activeMatches.values()) {
			activeMatchesAsArrayList.add(activeMatch);
		}
		return activeMatchesAsArrayList;
	}

	public Match getMatch(String matchIdentificator) throws MatchException {
		if (activeMatches.containsKey(matchIdentificator)){
			return activeMatches.get(matchIdentificator);
		}
		throw new MatchException("The match with "+matchIdentificator+" identificator was not found on server.");
	}

	public InsertPlayerResponse addNewPlayer(Player newPlayer) throws MatchException {
		if (matchWaitingForOpponent == null){
			matchWaitingForOpponent = new Match();
			matchWaitingForOpponent.addNewPlayer(newPlayer);
			addMatchToMap();
			return new InsertPlayerResponse(matchWaitingForOpponent.getHashId(), PLAYER_ONE);
		} else {
			return insertPlayerInMatchWaitingForOpponents(newPlayer);
		}
	}

	private InsertPlayerResponse insertPlayerInMatchWaitingForOpponents(Player newPlayer) throws MatchException {
		matchWaitingForOpponent.addNewPlayer(newPlayer);
		addMatchToMap();
		String hashId = matchWaitingForOpponent.getHashId();
		this.matchWaitingForOpponent = null;
		return new InsertPlayerResponse(hashId, PLAYER_TWO);
	}
	
	private void addMatchToMap (){
		this.activeMatches.put(matchWaitingForOpponent.getHashId(), matchWaitingForOpponent);
	}
	
}
