package com.teamNode.responses;

import com.teamNode.exceptions.MatchException;
import com.teamNode.interfaces.AbstractDomain;

public class InsertPlayerResponse extends AbstractDomain{

	private static final long serialVersionUID = -5115629681780809872L;
	
	private int playerNumber;
	
	private String matchIdentificator;
	
	public InsertPlayerResponse(String matchIdentificator, int playerNumber) throws MatchException {
		this.playerNumber = playerNumber;
		this.matchIdentificator = matchIdentificator;
	}

}
