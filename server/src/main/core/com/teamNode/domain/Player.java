package com.teamNode.domain;

import java.io.Serializable;

public class Player implements Serializable {

	private static final long serialVersionUID = 863403835133645741L;

	private String name;
	
	private Board board;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Board getBoard() {
		return board;
	}

	public void setBoard(Board board) {
		this.board = board;
	}
	
}
