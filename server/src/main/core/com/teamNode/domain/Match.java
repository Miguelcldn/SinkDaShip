package com.teamNode.domain;

import java.security.MessageDigest;
import java.util.Calendar;

import javax.xml.bind.DatatypeConverter;

import com.teamNode.exceptions.MatchException;
import com.teamNode.interfaces.AbstractDomain;
import com.teamNode.responses.AttackResponse;

@SuppressWarnings("restriction")
public class Match extends AbstractDomain {

	private static final long serialVersionUID = 4244956101691004024L;

	private String hashId;
	
	private Player playerOne;
	
	private Player playerTwo;
	
	private int playerTurn;
	
	public Match() {
		createHashIdentificator();
	}
	
	private void createHashIdentificator () {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			String timestampValue = String.valueOf(Calendar.getInstance().getTimeInMillis());
			byte[] hash = digest.digest(timestampValue.getBytes("UTF-8"));
			this.hashId = DatatypeConverter.printHexBinary(hash);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public String getHashId() {
		return hashId;
	}

	public Player getPlayerOfTheTurn () throws MatchException {
		if (playerTurn == 1){
			return playerOne;
		} else if (playerTurn == 2) {
			return playerTwo;
		} else{
			throw new MatchException("Sorry, this player not exists in this match.");
		}
	}
	
	public Player getPlayerWaitingAttack () throws MatchException {
		if (playerTurn == 1){
			return playerTwo;
		} else if (playerTurn == 2) {
			return playerOne;
		} else{
			throw new MatchException("Sorry, this player not exists in this match.");
		}
	}
	
	public int getPlayerTurn () {
		return this.playerTurn;
	}
	
	public void addNewPlayer (Player newPlayer) throws MatchException {
		if (playerOne == null){
			playerOne = newPlayer;
		} else {
			if (playerTwo == null){
				playerTurn = 1;
				playerTwo = newPlayer;
			} else {
				throw new MatchException("Maximum number of players exceeded.");
			}
		}
	}

	public AttackResponse receiveAttack(BoardCell cellHitted) throws MatchException {
		Player playerOfTheTurn = this.getPlayerOfTheTurn();
		if (playerOfTheTurn.isAttackAvailable(cellHitted)){
			AttackResponse responseForThisAttack = new AttackResponse(cellHitted);
			responseForThisAttack.setFire(checkIfAttackShootedAShip(cellHitted));
			responseForThisAttack.setWinner(checkIfGameIsOver()); 			
			playerOfTheTurn.addAttackResponse(responseForThisAttack);
			changePlayerTurn();
			return responseForThisAttack;
			
		} else {
			throw new MatchException("The cell "+cellHitted.toString()+" was attacked before.");
		}
	}
	
	private void changePlayerTurn(){
		if (playerTurn == 1){
			playerTurn = 2;
		} else {
			playerTurn = 1;
		}
	}
	
	private boolean checkIfGameIsOver() throws MatchException {
		return this.getPlayerWaitingAttack().allShipsAreSunk();
	}

	private boolean checkIfAttackShootedAShip(BoardCell cellHitted) throws MatchException {
		Player playerBeingAttacked = this.getPlayerWaitingAttack();
		boolean shootFired = false;
		for (Ship currentShipInAnalysis : playerBeingAttacked.getBoard().getShips()) {
			if (currentShipInAnalysis.isNotSunk()){
				for (ShipPart part : currentShipInAnalysis.getParts()) {
					if (part.getPositionOnTable().equals(cellHitted)){
						shootFired = true;
						part.setFired(shootFired);
						break;
					} 
				}
				if (shootFired){
					break;
				}
			}
		}
		return shootFired;
	}
}
