package com.teamNode.enumerators;

public enum ShipType {

	CARRIER		("Carrier", 	5), 
	BATTLESHIP	("Battle ship", 4), 
	CRUISER		("Cruiser", 	3), 
	SUBMARINE	("Submarine",	3), 
	DESTROYER	("Destroyer", 	2);

	private String name;
	private int numberOfCells;

	private ShipType(String name, int numberOfCells) {
		this.name = name;
		this.numberOfCells = numberOfCells;
	}

	public String getName() {
		return name;
	}

	public int getNumberOfCells() {
		return numberOfCells;
	}

}
