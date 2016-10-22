package com.teamNode.domain;

import java.io.Serializable;
import java.util.List;

public class Board implements Serializable {
	
	private static final long serialVersionUID = 6744923310810956238L;

	private List<Ship> ships;
	
	private List<BoardCell> hittedCells;

	public List<Ship> getShips() {
		return ships;
	}

	public void setShips(List<Ship> ships) {
		this.ships = ships;
	}

	public List<BoardCell> getHittedCells() {
		return hittedCells;
	}

	public void setHittedCells(List<BoardCell> hittedCells) {
		this.hittedCells = hittedCells;
	}
	
}
