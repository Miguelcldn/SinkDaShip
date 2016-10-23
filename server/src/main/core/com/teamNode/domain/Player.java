package com.teamNode.domain;

import java.util.ArrayList;
import java.util.List;

import com.teamNode.interfaces.AbstractDomain;
import com.teamNode.responses.AttackResponse;

public class Player extends AbstractDomain {

	private static final long serialVersionUID = 863403835133645741L;

	private String name;
	
	private Board board;
	
	private List<AttackResponse> allAttacksFired;

	public Player() {
	}
	
	public Player(String name) {
		this.name = name;
		this.board = new Board();
		this.allAttacksFired = new ArrayList<AttackResponse>();
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
		if (!allAttacksFired.isEmpty()){
			return allAttacksFired.get(allAttacksFired.size()-1);
		}
		return null;
	}
	
	public void addAttackResponse (AttackResponse attackResponse){
		this.allAttacksFired.add(attackResponse);
	}
	
	public boolean isAttackAvailable (BoardCell cellHitted) {
		return !allAttacksFired.contains(cellHitted);
	}

	public boolean isAnyShipAlive() {
		for (Ship ship : board.getShips()) {
			if (ship.isNotSunk()){
				return true;
			}
		}
		return false;
	}

	public List<String> validateInformations() {
		List<String> validationMessages = new ArrayList<String>();
		if (this.name == null || this.name.trim().equals("")){
			validationMessages.add("A player with no name can't be used!");
		}
		if (this.board == null){
			validationMessages.add("You didn't set up your board!");
		} else {
			validationMessages.addAll(this.board.validateInformations());
		}
		return validationMessages;
	}
	
}
