package com.teamNode.domain;

import java.util.ArrayList;
import java.util.List;

import com.teamNode.interfaces.AbstractDomain;

public class Board extends AbstractDomain {
	
	private static final long serialVersionUID = 6744923310810956238L;

	private List<Ship> ships;
	
	private List<BoardCell> hittedCells;
	
	public Board() {
		this.ships = new ArrayList<Ship>();
		this.hittedCells = new ArrayList<BoardCell>();
	}

	public List<Ship> getShips() {
		return ships;
	}
	
	public void addShip (Ship ship){
		//try to validate if its possible to add then,...
		ships.add(ship);
	}
		
	public List<BoardCell> getHittedCells() {
		return hittedCells;
	}

	public void setHittedCells(List<BoardCell> hittedCells) {
		this.hittedCells = hittedCells;
	}
	
}
