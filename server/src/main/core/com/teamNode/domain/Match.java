package com.teamNode.domain;

import java.io.Serializable;
import java.security.MessageDigest;
import java.util.Calendar;

import javax.xml.bind.DatatypeConverter;

import com.teamNode.exceptions.FullGameException;

@SuppressWarnings("restriction")
public class Match implements Serializable{

	private static final long serialVersionUID = 3139549675390776409L;

	private String hashId;
	
	private Player playerOne;
	
	private Player playerTwo;
	
	private int playerTurn;
	
	public Match() {
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
	
	public void addNewPlayer (Player newPlayer) throws FullGameException {
		if (playerOne == null){
			playerOne = newPlayer;
		} else {
			if (playerTwo == null){
				playerTwo = newPlayer;
			} else {
				throw new FullGameException("Maximum number of players reached.");
			}
		}
	}
}
