package com.teamNode.domain;

import java.util.ArrayList;
import java.util.List;

import com.teamNode.enumerators.ShipType;
import com.teamNode.interfaces.AbstractDomain;

public class Board extends AbstractDomain {
	
	private static final long serialVersionUID = 6744923310810956238L;

	private List<Ship> ships;
	
	public Board() {
		this.ships = new ArrayList<Ship>();
	}

	public List<Ship> getShips() {
		return ships;
	}
	
	public void addShip (Ship ship){
		//try to validate if its possible to add then,...
		ships.add(ship);
	}
		
	public boolean notContainsShipByType(ShipType currentShipType) {
		for (Ship ship : ships) {
			if (ship.getType().equals(currentShipType)){
				return false;
			}
		}
		return true;
	}

	public List<String> validateInformations() {
		List<String> validationMessages = new ArrayList<String>();
		if (this.getShips().isEmpty()){
			validationMessages.add("Any ship was added to you board.");
		} else {
			for (ShipType currentShipType : ShipType.values()) {
				if (this.notContainsShipByType(currentShipType)){
					validationMessages.add("You missed to set up your "+currentShipType.getName()+" in your board.");
				}
			}
			String repeatedType = findRepeatedShipType(); 
			if (!repeatedType.isEmpty()){
				validationMessages.add(repeatedType);
			}
		}
		if (validationMessages.isEmpty()){
			for (Ship currentShip : this.ships) {
				validationMessages.addAll(currentShip.validateInformations());
			}
		}
		if (validationMessages.isEmpty()){
			String firstRepeatedPosition = findFirstRepeatedShipPosition();
			if (!firstRepeatedPosition.isEmpty()){
				validationMessages.add(firstRepeatedPosition);
			}
		}
		return validationMessages;
	}

	private String findRepeatedShipType() {
		for (int i = 0; i < ships.size(); i++) {
			for (int j = 0; j < ships.size(); j++) {
				if (i != j){
					if (ships.get(i).getType().equals(ships.get(j).getType())){
						return ships.get(i).getType().getName();
					}
				}
			}
		}
		return "";
	}
	
	private String findFirstRepeatedShipPosition() {
		List<BoardCell> cellsFromAllShips = new ArrayList<BoardCell>();
		for (Ship ship : ships) {
			for (ShipPart part : ship.getParts()) {
				cellsFromAllShips.add(part.getPositionOnTable());
			}
		}
		for (int i = 0; i < cellsFromAllShips.size(); i++) {
			for (int j = 0; j < cellsFromAllShips.size(); j++) {
				if (i != j){
					if (cellsFromAllShips.get(i).equals(cellsFromAllShips.get(j))){
						return "The position "+cellsFromAllShips.get(i).toString()+" is repeated.";
					}
				}
			}
		}
		return "";
	}
	
}
