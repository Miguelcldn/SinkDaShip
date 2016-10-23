package com.teamNode.domain;

import java.util.ArrayList;
import java.util.Collections;
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

	public List<String> validateInformations() {
		List<String> validationMessages = new ArrayList<String>();
		if (parts.isEmpty()){
			validationMessages.add("You must to inform the position of each part of the ship");
		} else {
			if (parts.size() != type.getNumberOfCells()){
				validationMessages.add("You informed "+parts.size()+" parts"
						+ " but for a ship like "+type.getName()
						+" you have to provide "+type.getNumberOfCells()+" parts.");
			} else {
				validationMessages.addAll(validatePosition());
			}
		}
		return validationMessages;
	}

	private List<String> validatePosition() {
		List<String> validationMessages = new ArrayList<String>();
		
		List<Integer> horizontalPositions = getHorizontalPositions();
		List<Integer> verticalPositions = getVerticalPositions();
		
		if (areAllNumbersEquals(horizontalPositions)){
			if (areNotAllNumbersInSequence(verticalPositions)){
				validationMessages.add("The vertical positions for the "+type.getName()+" aren't valid.");	
			}
		} else if (areAllNumbersEquals(verticalPositions)){
			if (areNotAllNumbersInSequence(horizontalPositions)){
				validationMessages.add("The horizontal positions for the "+type.getName()+" aren't valid.");
			}
		} else {
			validationMessages.add("The vertical and horizontal positions for the "+type.getName()+" aren't valid.");
		}
		
		return validationMessages;
	}
	
	private List<Integer> getHorizontalPositions() {
		List<Integer> horizontalPositions = new ArrayList<Integer>();
		for (ShipPart shipPart : parts) {
			horizontalPositions.add(shipPart.getPositionOnTable().getHorizontalPosition());
		}
		return horizontalPositions;
	}
	
	private List<Integer> getVerticalPositions() {
		List<Integer> verticalPositions = new ArrayList<Integer>();
		for (ShipPart shipPart : parts) {
			verticalPositions.add(shipPart.getPositionOnTable().getVerticalPosition());
		}
		return verticalPositions;
	}
	
	private boolean areAllNumbersEquals(List<Integer> listOfNumbers){
		Integer last = listOfNumbers.iterator().next();
		for (Integer current : listOfNumbers) {
			if (!last.equals(current)){
				return false;
			}
		}
		return true;
	}
	
	private boolean areNotAllNumbersInSequence(List<Integer> listOfNumbers){
		Collections.sort(listOfNumbers);
		Integer last = null;
		for (Integer current : listOfNumbers) {
			if (last == null){
				last = current;
			} else {
				if (last + 1 == current){
					last = current;
				} else {
					return true;
				}
			}
		}
		return false;
	}
	

}
