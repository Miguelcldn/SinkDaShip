package com.teamNode.domain;

import java.security.MessageDigest;
import java.util.Calendar;

import javax.xml.bind.DatatypeConverter;

import com.teamNode.exceptions.MatchException;
import com.teamNode.interfaces.AbstractDomain;

@SuppressWarnings("restriction")
public class Match extends AbstractDomain {

	private static final long serialVersionUID = 4244956101691004024L;

	private String hashId;
	
	private Player playerOne;
	
	private Player playerTwo;
	
	private int playerTurn;
	
	public Match() {
		this(null,null);
	}
	
	public Match(Player playerOne, Player playerTwo) {
		createHashIdentificator();
		this.playerOne = playerOne;
		this.playerTwo = playerTwo;
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

	public Player getPlayerOne() {
		return playerOne;
	}

	public void setPlayerOne(Player playerOne) {
		this.playerOne = playerOne;
	}

	public Player getPlayerTwo() {
		return playerTwo;
	}

	public void setPlayerTwo(Player playerTwo) {
		this.playerTwo = playerTwo;
	}

	public int getPlayerTurn() {
		return playerTurn;
	}

	public void setPlayerTurn(int playerTurn) {
		this.playerTurn = playerTurn;
	}
	
	/**
	 * Acho que não será mais necessário....
	 * @param newPlayer
	 * @throws MatchException
	 */
	@Deprecated
	public void addNewPlayer (Player newPlayer) throws MatchException {
		if (playerOne == null){
			playerOne = newPlayer;
		} else {
			if (playerTwo == null){
				playerTwo = newPlayer;
			} else {
				throw new MatchException("Maximum number of players exceeded.");
			}
		}
	}

	public AttackResponse receiveAttack(BoardCell cellHitted) {
		
		return null;
	}
}
