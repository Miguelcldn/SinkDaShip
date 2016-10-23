package com.teamNode.responses;

import com.teamNode.domain.BoardCell;
import com.teamNode.interfaces.AbstractDomain;

public class AttackResponse extends AbstractDomain {

	private static final long serialVersionUID = -5632521796725134295L;
	
	private BoardCell cellHitted;
	
	private boolean fire;
	
	private boolean winner;

	public AttackResponse(BoardCell cellHitted) {
		this.cellHitted = cellHitted;
	}
	
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

	public boolean isWinner() {
		return winner;
	}

	public void setWinner(boolean winner) {
		this.winner = winner;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof BoardCell){
			BoardCell otherCellHited = (BoardCell)obj;
			return this.getCellHitted().equals(otherCellHited);
		} else if (obj instanceof AttackResponse){
			AttackResponse otherAttack = (AttackResponse)obj;
			return this.getCellHitted().equals(otherAttack.getCellHitted());
		} else {
			return super.equals(obj);
		}
	}
	
	
	
}
