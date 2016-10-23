package com.teamNode.domain;

public class ShipPart {

	private BoardCell positionOnTable;
	
	private boolean fired;

	public BoardCell getPositionOnTable() {
		return positionOnTable;
	}

	public void setPositionOnTable(BoardCell positionOnTable) {
		this.positionOnTable = positionOnTable;
	}

	public boolean isFired() {
		return fired;
	}
	
	public boolean isNotFired() {
		return !fired;
	}

	public void setFired(boolean fired) {
		this.fired = fired;
	}
	
}
