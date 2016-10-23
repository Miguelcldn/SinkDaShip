package com.teamNode.domain;

import com.teamNode.interfaces.AbstractDomain;
import com.teamNode.responses.AttackResponse;

public class BoardCell extends AbstractDomain {

	private static final long serialVersionUID = 7680342118470460056L;
	
	private int verticalPosition;
	
	private int horizontalPosition;

	public int getVerticalPosition() {
		return verticalPosition;
	}

	public void setVerticalPosition(int verticalPosition) {
		this.verticalPosition = verticalPosition;
	}

	public int getHorizontalPosition() {
		return horizontalPosition;
	}

	public void setHorizontalPosition(int horizontalPosition) {
		this.horizontalPosition = horizontalPosition;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof AttackResponse){
			AttackResponse attack = (AttackResponse) obj;
			return this.horizontalPosition == attack.getCellHitted().getHorizontalPosition() && this.verticalPosition == attack.getCellHitted().getVerticalPosition();
		} else if (obj instanceof BoardCell){
			BoardCell otherCell = (BoardCell)obj;
			return this.horizontalPosition == otherCell.horizontalPosition && this.verticalPosition == otherCell.verticalPosition;
		} else {
			return super.equals(obj);
		}
	}

	@Override
	public String toString() {
		return "[horiontal:"+this.horizontalPosition+", vertical:"+this.verticalPosition+"]";
	}
	
	
	
}
