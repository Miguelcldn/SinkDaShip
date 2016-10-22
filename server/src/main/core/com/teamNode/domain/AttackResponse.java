package com.teamNode.domain;

import com.teamNode.interfaces.AbstractDomain;

public class AttackResponse extends AbstractDomain {

	private static final long serialVersionUID = -5632521796725134295L;
	
	private BoardCell cellHitted;
	
	private boolean fire;
	
	private Player winner;

	public BoardCell getCellHitted() {
		return cellHitted;
	}

	public void setCellHitted(BoardCell cellHitted) {
		this.cellHitted = cellHitted;
	}

	public boolean isFire() {
		return fire;
	}

	public void setFire(boolean fire) {
		this.fire = fire;
	}

	public Player getWinner() {
		return winner;
	}

	public void setWinner(Player winner) {
		this.winner = winner;
	}

}
