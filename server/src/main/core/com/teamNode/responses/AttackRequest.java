package com.teamNode.responses;

import com.teamNode.domain.BoardCell;
import com.teamNode.interfaces.AbstractDomain;

public class AttackRequest extends AbstractDomain {
	
	private static final long serialVersionUID = 6240106991953673114L;
	private String matchId;
	private int playerNumber;
	private BoardCell cellHitted;
	
	public AttackRequest() {
		this(null, 0, null);
	}
	
	public AttackRequest(String matchId, int playerNumber, BoardCell cellHitted) {
		this.matchId = matchId;
		this.playerNumber = playerNumber;
		this.cellHitted = cellHitted;
	}

	public String getMatchId() {
		return matchId;
	}

	public int getPlayerNumber() {
		return playerNumber;
	}

	public BoardCell getCellHitted() {
		return cellHitted;
	}
	
}