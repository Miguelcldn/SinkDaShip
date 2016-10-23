package com.teamNode.domain;

import com.teamNode.interfaces.AbstractDomain;

public class GeneralResponse extends AbstractDomain {

	private static final long serialVersionUID = -6723977335882015840L;

	boolean ok;
	
	Object resultObject;
	
	public GeneralResponse(boolean ok, Object resultObject) {
		this.ok = ok;
		this.resultObject = resultObject;
	}
	
}
