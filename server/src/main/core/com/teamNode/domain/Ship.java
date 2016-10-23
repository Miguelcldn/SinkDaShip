package com.teamNode.domain;

import java.util.List;

import com.teamNode.enumerators.ShipType;
import com.teamNode.interfaces.AbstractDomain;

public class Ship extends AbstractDomain {
	
	private static final long serialVersionUID = 2503484956407160270L;

	private ShipType type;
	
	private List<ShipPart> parts;
	
	public ShipType getType() {
		return type;
	}

	public void setType(ShipType type) {
		this.type = type;
	}

	public boolean isNotSunk () {
		for (ShipPart shipPart : parts) {
			if (shipPart.isNotFired()){
				return true;
			}
		}
		return false;
	}

	public List<ShipPart> getParts() {
		return this.parts;
	}

}
