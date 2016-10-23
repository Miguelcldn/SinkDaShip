package com.teamNode.responses;

import com.teamNode.domain.Match;
import com.teamNode.exceptions.MatchException;
import com.teamNode.interfaces.AbstractDomain;

public class TurnResponse extends AbstractDomain{

	private static final long serialVersionUID = -5115629681780809872L;
	
	private int playerOfTheTurn;
	
	private AttackResponse lastAttackSuffered;
	
	public TurnResponse(Match match){
		this.playerOfTheTurn = match.getPlayerTurn();
		try {
			this.lastAttackSuffered = match.getPlayerWaitingAttack().getLastAttackResponse();
		} catch (MatchException e) {
			lastAttackSuffered = null;
		}
	}

}
