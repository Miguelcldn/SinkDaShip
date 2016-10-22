package sinkdaship;

import org.junit.Before;
import org.junit.Test;

import com.teamNode.domain.Match;
import com.teamNode.domain.Player;
import com.teamNode.exceptions.MatchException;

public class DomainTester {
	
	Match match;
	Player firstPlayer;
	Player secondPlayer;
	Player lastPlayer;
	
	@Before
	public void mockPlayers () {
		firstPlayer = new Player("First player");
		secondPlayer = new Player("Second player");
		lastPlayer = new Player("Overload player");
	}
	
	@Test
	public void testMatchWithTwoPlayers () throws MatchException {
		match = new Match();
		match.addNewPlayer(firstPlayer);
		match.addNewPlayer(secondPlayer);
	}
	
	@Test(expected=MatchException.class)
	public void testMatchWithThreePlayers () throws MatchException {
		testMatchWithTwoPlayers();
		match.addNewPlayer(lastPlayer);
	}
	
}
