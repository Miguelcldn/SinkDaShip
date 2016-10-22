package com.teamNode.domain;

import java.io.Serializable;

public class BoardCell implements Serializable{

	private static final long serialVersionUID = 7680342118470460056L;
	
	private int verticalPosition;
	
	private int horizontalPosition;

	public int getVerticalPosition() {
		return verticalPosition;
	}

	public void setVerticalPosition(int verticalPosition) {
		this.verticalPosition = verticalPosition;
	}

	public int getHorizontalPosition() {
		return horizontalPosition;
	}

	public void setHorizontalPosition(int horizontalPosition) {
		this.horizontalPosition = horizontalPosition;
	}

}
