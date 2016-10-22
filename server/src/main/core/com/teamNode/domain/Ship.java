package com.teamNode.domain;

import java.util.List;

import com.teamNode.enumerators.ShipType;
import com.teamNode.interfaces.AbstractDomain;

public class Ship extends AbstractDomain {
	
	private static final long serialVersionUID = 2503484956407160270L;

	private ShipType type;
	
	private List<BoardCell> positions;

	public ShipType getType() {
		return type;
	}

	public void setType(ShipType type) {
		this.type = type;
	}

	public List<BoardCell> getPositions() {
		return positions;
	}

	public void setPositions(List<BoardCell> positions) {
		this.positions = positions;
	}

}
