package com.teamNode.domain;

import com.teamNode.interfaces.AbstractDomain;

public class Player extends AbstractDomain {

	private static final long serialVersionUID = 863403835133645741L;

	private String name;
	
	private Board board;
	
	private AttackResponse lastAttackResponse;

	public Player() {
	}
	
	public Player(String name) {
		this.name = name;
		this.board = new Board();
	}
	
	public String getName() {
		return name;
	}

	public Board getBoard() {
		return board;
	}

	public void setBoard(Board board) {
		this.board = board;
	}

	public AttackResponse getLastAttackResponse() {
		return lastAttackResponse;
	}

	public void setLastAttackResponse(AttackResponse lastAttackResponse) {
		this.lastAttackResponse = lastAttackResponse;
	}
	
}
