package com.teamNode.domain;

public class Player extends DefaultDomain {

	private static final long serialVersionUID = 863403835133645741L;

	private String name;
	
	private Board board;

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
	
}
